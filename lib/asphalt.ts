export type LengthUnit = "ft" | "m" | "yd" | "in" | "cm";
export type AreaUnit = "ft2" | "m2" | "yd2";
export type InputMode = "rectangular" | "area";

export type AsphaltInputs = {
  mode: InputMode;
  length: string;
  lengthUnit: LengthUnit;
  width: string;
  widthUnit: LengthUnit;
  thickness: string;
  thicknessUnit: LengthUnit;
  area: string;
  areaUnit: AreaUnit;
  density: string;
  allowance: string;
  price: string;
};

export type AsphaltResult = {
  areaSqFt: number;
  areaSqM: number;
  volumeCubicFt: number;
  volumeCubicYd: number;
  volumeCubicM: number;
  weightLb: number;
  weightShortTons: number;
  weightMetricTonnes: number;
  orderTons: number;
  estimatedCost: number;
};

export const defaultAsphaltInputs = (): AsphaltInputs => ({
  mode: "rectangular",
  length: "20",
  lengthUnit: "ft",
  width: "10",
  widthUnit: "ft",
  thickness: "3",
  thicknessUnit: "in",
  area: "200",
  areaUnit: "ft2",
  density: "145",
  allowance: "5",
  price: "120",
});

const parseFiniteNumber = (value: string | number | undefined): number | null => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const validateAsphaltInputs = (input: AsphaltInputs): string | null => {
  const lengthValue = parseFiniteNumber(input.length);
  const widthValue = parseFiniteNumber(input.width);
  const thicknessValue = parseFiniteNumber(input.thickness);
  const areaValue = parseFiniteNumber(input.area);
  const densityValue = parseFiniteNumber(input.density);
  const allowanceValue = parseFiniteNumber(input.allowance);
  const priceValue = parseFiniteNumber(input.price);

  if (input.mode === "rectangular") {
    if (lengthValue === null || lengthValue <= 0) return "Length must be greater than zero.";
    if (widthValue === null || widthValue <= 0) return "Width must be greater than zero.";
  }

  if (input.mode === "area") {
    if (areaValue === null || areaValue <= 0) return "Known area must be greater than zero.";
  }

  if (thicknessValue === null || thicknessValue <= 0) return "Asphalt thickness must be greater than zero.";
  if (densityValue === null || densityValue <= 0) return "Asphalt density must be greater than zero.";
  if (allowanceValue === null || allowanceValue < 0) return "Waste allowance must be zero or greater.";
  if (priceValue !== null && priceValue < 0) return "Price per ton cannot be negative.";

  return null;
};

const convertLengthToFeet = (value: number, unit: LengthUnit): number => {
  switch (unit) {
    case "ft":
      return value;
    case "m":
      return value * 3.280839895013123;
    case "yd":
      return value * 3;
    case "in":
      return value / 12;
    case "cm":
      return value / 30.48;
    default:
      return value;
  }
};

const convertAreaToSquareFeet = (value: number, unit: AreaUnit): number => {
  switch (unit) {
    case "ft2":
      return value;
    case "m2":
      return value * 10.76391041670972;
    case "yd2":
      return value * 9;
    default:
      return value;
  }
};

const convertThicknessToFeet = (value: number, unit: LengthUnit): number => {
  switch (unit) {
    case "ft":
      return value;
    case "m":
      return value * 3.280839895013123;
    case "yd":
      return value * 3;
    case "in":
      return value / 12;
    case "cm":
      return value / 30.48;
    default:
      return value;
  }
};

export const calculateAsphalt = (input: AsphaltInputs): AsphaltResult => {
  const validationError = validateAsphaltInputs(input);
  if (validationError) {
    throw new Error(validationError);
  }

  const lengthFeet = input.mode === "rectangular"
    ? convertLengthToFeet(parseFiniteNumber(input.length) as number, input.lengthUnit)
    : 0;
  const widthFeet = input.mode === "rectangular"
    ? convertLengthToFeet(parseFiniteNumber(input.width) as number, input.widthUnit)
    : 0;
  const areaSqFt = input.mode === "rectangular"
    ? lengthFeet * widthFeet
    : convertAreaToSquareFeet(parseFiniteNumber(input.area) as number, input.areaUnit);
  const thicknessFeet = convertThicknessToFeet(parseFiniteNumber(input.thickness) as number, input.thicknessUnit);
  const densityLbPerFt3 = parseFiniteNumber(input.density) as number;
  const allowancePercent = parseFiniteNumber(input.allowance) as number;
  const pricePerTon = parseFiniteNumber(input.price) ?? 0;

  const volumeCubicFt = areaSqFt * thicknessFeet;
  const volumeCubicYd = volumeCubicFt / 27;
  const volumeCubicM = volumeCubicFt * 0.028316846592;
  const weightLb = volumeCubicFt * densityLbPerFt3;
  const weightShortTons = weightLb / 2000;
  const weightMetricTonnes = weightLb * 0.00045359237;
  const orderTons = weightShortTons * (1 + allowancePercent / 100);
  const estimatedCost = orderTons * pricePerTon;

  return {
    areaSqFt,
    areaSqM: areaSqFt * 0.09290304,
    volumeCubicFt,
    volumeCubicYd,
    volumeCubicM,
    weightLb,
    weightShortTons,
    weightMetricTonnes,
    orderTons,
    estimatedCost,
  };
};

export const formatNumber = (value: number, digits = 2): string => {
  if (!Number.isFinite(value)) return "0";
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
};
