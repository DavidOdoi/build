import { isLengthUnit, parseFinite, toFeet, type LengthUnit } from "./material-units";

export type LinearFootMode = "lengths" | "perimeter" | "area";
export type AreaUnit = "ft2" | "in2" | "yd2" | "m2" | "cm2";
export type LinearLengthLine = { length: string; unit: LengthUnit; quantity: string };

export type LinearFootInputs = {
  mode: LinearFootMode;
  lengthLines: LinearLengthLine[];
  roomLength: string;
  roomLengthUnit: LengthUnit;
  roomWidth: string;
  roomWidthUnit: LengthUnit;
  deductions: string;
  deductionUnit: LengthUnit;
  area: string;
  areaUnit: AreaUnit;
  materialWidth: string;
  materialWidthUnit: LengthUnit;
  wastePercent: string;
  pricePerFoot: string;
  stockLength: string;
  stockLengthUnit: LengthUnit;
};

export type LinearFootResult = {
  measuredLengthFeet: number;
  orderLengthFeet: number;
  wasteLengthFeet: number;
  orderLengthMeters: number;
  estimatedCost: number | null;
  stockPieceLowerBound: number | null;
  perimeterFeet: number | null;
  deductionsFeet: number | null;
  areaSquareFeet: number | null;
  materialWidthFeet: number | null;
};

const isAreaUnit = (unit: string): unit is AreaUnit =>
  unit === "ft2" || unit === "in2" || unit === "yd2" || unit === "m2" || unit === "cm2";

export const defaultLinearFootInputs = (): LinearFootInputs => ({
  mode: "lengths",
  lengthLines: [{ length: "8", unit: "ft", quantity: "1" }],
  roomLength: "15",
  roomLengthUnit: "ft",
  roomWidth: "12",
  roomWidthUnit: "ft",
  deductions: "0",
  deductionUnit: "ft",
  area: "120",
  areaUnit: "ft2",
  materialWidth: "6",
  materialWidthUnit: "in",
  wastePercent: "10",
  pricePerFoot: "",
  stockLength: "",
  stockLengthUnit: "ft",
});

export const validateLinearFootInputs = (input: LinearFootInputs): string | null => {
  if (input.mode !== "lengths" && input.mode !== "perimeter" && input.mode !== "area") return "Choose a supported calculation mode.";
  const wastePercent = parseFinite(input.wastePercent);
  const price = parseFinite(input.pricePerFoot);
  const stockLength = parseFinite(input.stockLength);
  if (wastePercent === null || wastePercent < 0) return "Waste allowance must be zero or greater.";
  if (input.pricePerFoot !== "" && (price === null || price < 0)) return "Price per linear foot must be a nonnegative finite number.";
  if (input.stockLength !== "" && (stockLength === null || stockLength <= 0)) return "Stock length must be greater than zero.";
  if (!isLengthUnit(input.stockLengthUnit)) return "Choose a supported stock-length unit.";

  if (input.mode === "lengths") {
    if (input.lengthLines.length === 0) return "Add at least one length.";
    for (const [index, line] of input.lengthLines.entries()) {
      const length = parseFinite(line.length);
      const quantity = parseFinite(line.quantity);
      if (!isLengthUnit(line.unit)) return `Choose a supported unit for length ${index + 1}.`;
      if (length === null || length <= 0) return `Length ${index + 1} must be greater than zero.`;
      if (quantity === null || !Number.isInteger(quantity) || quantity < 1) return `Quantity for length ${index + 1} must be a whole number greater than zero.`;
    }
  }

  if (input.mode === "perimeter") {
    const length = parseFinite(input.roomLength);
    const width = parseFinite(input.roomWidth);
    const deductions = input.deductions === "" ? 0 : parseFinite(input.deductions);
    if (!isLengthUnit(input.roomLengthUnit) || !isLengthUnit(input.roomWidthUnit) || !isLengthUnit(input.deductionUnit)) return "Choose supported room measurement units.";
    if (length === null || length <= 0) return "Room length must be greater than zero.";
    if (width === null || width <= 0) return "Room width must be greater than zero.";
    if (deductions === null || deductions < 0) return "Opening deductions must be zero or greater.";
    const perimeterFeet = 2 * (toFeet(length, input.roomLengthUnit) + toFeet(width, input.roomWidthUnit));
    if (toFeet(deductions, input.deductionUnit) > perimeterFeet + 1e-9) return "Opening deductions cannot exceed the room perimeter.";
  }

  if (input.mode === "area") {
    const area = parseFinite(input.area);
    const width = parseFinite(input.materialWidth);
    if (!isAreaUnit(input.areaUnit)) return "Choose a supported area unit.";
    if (!isLengthUnit(input.materialWidthUnit)) return "Choose a supported material-width unit.";
    if (area === null || area <= 0) return "Area must be greater than zero.";
    if (width === null || width <= 0) return "Material width must be greater than zero.";
  }

  return null;
};

const toSquareFeet = (value: number, unit: AreaUnit): number => {
  switch (unit) {
    case "ft2": return value;
    case "in2": return value / 144;
    case "yd2": return value * 9;
    case "m2": return value * 10.7639104167097;
    case "cm2": return value / 929.0304;
  }
};

export const calculateLinearFeet = (input: LinearFootInputs): LinearFootResult => {
  const error = validateLinearFootInputs(input);
  if (error) throw new Error(error);

  let measuredLengthFeet = 0;
  let perimeterFeet: number | null = null;
  let deductionsFeet: number | null = null;
  let areaSquareFeet: number | null = null;
  let materialWidthFeet: number | null = null;

  if (input.mode === "lengths") {
    measuredLengthFeet = input.lengthLines.reduce(
      (total, line) => total + toFeet(parseFinite(line.length)!, line.unit) * parseFinite(line.quantity)!,
      0,
    );
  } else if (input.mode === "perimeter") {
    perimeterFeet = 2 * (
      toFeet(parseFinite(input.roomLength)!, input.roomLengthUnit)
      + toFeet(parseFinite(input.roomWidth)!, input.roomWidthUnit)
    );
    deductionsFeet = input.deductions === "" ? 0 : toFeet(parseFinite(input.deductions)!, input.deductionUnit);
    measuredLengthFeet = perimeterFeet - deductionsFeet;
  } else {
    areaSquareFeet = toSquareFeet(parseFinite(input.area)!, input.areaUnit);
    materialWidthFeet = toFeet(parseFinite(input.materialWidth)!, input.materialWidthUnit);
    measuredLengthFeet = areaSquareFeet / materialWidthFeet;
  }

  const orderLengthFeet = measuredLengthFeet * (1 + parseFinite(input.wastePercent)! / 100);
  const wasteLengthFeet = orderLengthFeet - measuredLengthFeet;
  const price = parseFinite(input.pricePerFoot);
  const stockLength = parseFinite(input.stockLength);
  const stockPieceLowerBound = stockLength === null
    ? null
    : Math.ceil(orderLengthFeet / toFeet(stockLength, input.stockLengthUnit) - 1e-12);

  return {
    measuredLengthFeet,
    orderLengthFeet,
    wasteLengthFeet,
    orderLengthMeters: orderLengthFeet * 0.3048,
    estimatedCost: price === null ? null : orderLengthFeet * price,
    stockPieceLowerBound,
    perimeterFeet,
    deductionsFeet,
    areaSquareFeet,
    materialWidthFeet,
  };
};
