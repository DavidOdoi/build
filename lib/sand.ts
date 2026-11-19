export type SandLengthUnit = "ft" | "m" | "yd" | "in" | "cm";
export type SandPriceUnit = "ton" | "yd3";

export type SandInputs = {
  length: string;
  lengthUnit: SandLengthUnit;
  width: string;
  widthUnit: SandLengthUnit;
  depth: string;
  depthUnit: SandLengthUnit;
  density: string;
  allowance: string;
  price: string;
  priceUnit: SandPriceUnit;
};

export type SandResult = {
  volumeCubicFt: number;
  volumeCubicYd: number;
  volumeCubicM: number;
  weightLb: number;
  shortTons: number;
  metricTonnes: number;
  orderTons: number;
  orderCubicYd: number;
  estimatedCost: number;
};

export const defaultSandInputs = (): SandInputs => ({
  length: "12",
  lengthUnit: "ft",
  width: "10",
  widthUnit: "ft",
  depth: "4",
  depthUnit: "in",
  density: "100",
  allowance: "5",
  price: "45",
  priceUnit: "ton",
});

const parseFiniteNumber = (value: string | number | undefined): number | null => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const validateSandInputs = (input: SandInputs): string | null => {
  const lengthValue = parseFiniteNumber(input.length);
  const widthValue = parseFiniteNumber(input.width);
  const depthValue = parseFiniteNumber(input.depth);
  const densityValue = parseFiniteNumber(input.density);
  const allowanceValue = parseFiniteNumber(input.allowance);
  const priceValue = parseFiniteNumber(input.price);

  if (lengthValue === null || lengthValue <= 0) return "Length must be greater than zero.";
  if (widthValue === null || widthValue <= 0) return "Width must be greater than zero.";
  if (depthValue === null || depthValue <= 0) return "Depth must be greater than zero.";
  if (densityValue === null || densityValue <= 0) return "Sand density must be greater than zero.";
  if (allowanceValue === null || allowanceValue < 0) return "Waste allowance must be zero or greater.";
  if (priceValue !== null && priceValue < 0) return "Price cannot be negative.";

  return null;
};

const convertLengthToFeet = (value: number, unit: SandLengthUnit): number => {
  switch (unit) {
    case "ft": return value;
    case "m": return value * 3.280839895013123;
    case "yd": return value * 3;
    case "in": return value / 12;
    case "cm": return value / 30.48;
    default: return value;
  }
};

export const calculateSand = (input: SandInputs): SandResult => {
  const validationError = validateSandInputs(input);
  if (validationError) throw new Error(validationError);

  const lengthFt = convertLengthToFeet(parseFiniteNumber(input.length) as number, input.lengthUnit);
  const widthFt = convertLengthToFeet(parseFiniteNumber(input.width) as number, input.widthUnit);
  const depthFt = convertLengthToFeet(parseFiniteNumber(input.depth) as number, input.depthUnit);
  const densityLbPerFt3 = parseFiniteNumber(input.density) as number;
  const allowancePercent = parseFiniteNumber(input.allowance) as number;
  const pricePerTon = input.priceUnit === "ton" ? (parseFiniteNumber(input.price) as number) : 0;
  const pricePerCubicYd = input.priceUnit === "yd3" ? (parseFiniteNumber(input.price) as number) : 0;

  const volumeCubicFt = lengthFt * widthFt * depthFt;
  const volumeCubicYd = volumeCubicFt / 27;
  const volumeCubicM = volumeCubicFt * 0.028316846592;
  const weightLb = volumeCubicFt * densityLbPerFt3;
  const shortTons = weightLb / 2000;
  const metricTonnes = weightLb * 0.00045359237;
  const orderTons = shortTons * (1 + allowancePercent / 100);
  const orderCubicYd = volumeCubicYd * (1 + allowancePercent / 100);

  const estimatedCost =
    input.priceUnit === "ton"
      ? orderTons * pricePerTon
      : orderCubicYd * pricePerCubicYd;

  return {
    volumeCubicFt,
    volumeCubicYd,
    volumeCubicM,
    weightLb,
    shortTons,
    metricTonnes,
    orderTons,
    orderCubicYd,
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
