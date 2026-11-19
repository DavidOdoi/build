import { isLengthUnit, parseFinite, toFeet, type LengthUnit } from "./material-units";

export type PeaGravelInputs = {
  shape: "rectangle" | "circle";
  length: string;
  lengthUnit: LengthUnit;
  width: string;
  widthUnit: LengthUnit;
  depth: string;
  depthUnit: LengthUnit;
  density: string;
  allowance: string;
  price: string;
  priceUnit: "ton" | "yd3";
  bagVolume: string;
  bagPrice: string;
};

export type PeaGravelResult = {
  areaSqFt: number;
  baseVolumeCubicFt: number;
  baseVolumeCubicYd: number;
  baseVolumeCubicM: number;
  baseWeightLb: number;
  baseShortTons: number;
  baseMetricTonnes: number;
  orderVolumeCubicYd: number;
  orderWeightLb: number;
  orderShortTons: number;
  orderMetricTonnes: number;
  estimatedCost: number | null;
  bagCount: number | null;
  bagCost: number | null;
  allowanceQuantityCubicYd: number;
};

export const defaultPeaGravelInputs = (): PeaGravelInputs => ({
  shape: "rectangle",
  length: "20",
  lengthUnit: "ft",
  width: "10",
  widthUnit: "ft",
  depth: "3",
  depthUnit: "in",
  density: "100",
  allowance: "10",
  price: "",
  priceUnit: "ton",
  bagVolume: "",
  bagPrice: "",
});

export const validatePeaGravelInputs = (input: PeaGravelInputs): string | null => {
  if (input.shape !== "rectangle" && input.shape !== "circle") return "Choose a supported area shape.";
  if (!isLengthUnit(input.lengthUnit) || !isLengthUnit(input.depthUnit)) return "Choose supported measurement units.";
  if (input.shape === "rectangle" && !isLengthUnit(input.widthUnit)) return "Choose a supported width unit.";
  const length = parseFinite(input.length);
  const width = parseFinite(input.width);
  const depth = parseFinite(input.depth);
  const density = parseFinite(input.density);
  const allowance = parseFinite(input.allowance);
  const price = parseFinite(input.price);
  const bagVolume = parseFinite(input.bagVolume);
  const bagPrice = parseFinite(input.bagPrice);
  if (length === null || length <= 0) return input.shape === "circle" ? "Radius must be greater than zero." : "Length must be greater than zero.";
  if (input.shape === "rectangle" && (width === null || width <= 0)) return "Width must be greater than zero.";
  if (depth === null || depth <= 0) return "Depth must be greater than zero.";
  if (density === null || density <= 0) return "Bulk density must be greater than zero.";
  if (allowance === null || allowance < 0) return "Allowance must be zero or greater.";
  if (input.price !== "" && (price === null || price < 0)) return "Price must be a nonnegative finite number.";
  if (input.priceUnit !== "ton" && input.priceUnit !== "yd3") return "Choose a supported price unit.";
  if (input.bagVolume !== "" && (bagVolume === null || bagVolume <= 0)) return "Bag volume must be greater than zero.";
  if (input.bagPrice !== "" && (bagPrice === null || bagPrice < 0)) return "Bag price must be a nonnegative finite number.";
  if (input.bagPrice !== "" && input.bagVolume === "") return "Enter bag volume to estimate bag cost.";
  return null;
};

export const calculatePeaGravel = (input: PeaGravelInputs): PeaGravelResult => {
  const error = validatePeaGravelInputs(input);
  if (error) throw new Error(error);

  const lengthFt = toFeet(parseFinite(input.length)!, input.lengthUnit);
  const widthFt = input.shape === "rectangle" ? toFeet(parseFinite(input.width)!, input.widthUnit) : 0;
  const depthFt = toFeet(parseFinite(input.depth)!, input.depthUnit);
  const areaSqFt = input.shape === "circle" ? Math.PI * lengthFt ** 2 : lengthFt * widthFt;
  const baseVolumeCubicFt = areaSqFt * depthFt;
  const baseVolumeCubicYd = baseVolumeCubicFt / 27;
  const baseVolumeCubicM = baseVolumeCubicFt * 0.028316846592;
  const baseWeightLb = baseVolumeCubicFt * parseFinite(input.density)!;
  const baseShortTons = baseWeightLb / 2000;
  const baseMetricTonnes = baseWeightLb * 0.00045359237;
  const allowanceFactor = 1 + parseFinite(input.allowance)! / 100;
  const orderVolumeCubicYd = baseVolumeCubicYd * allowanceFactor;
  const orderWeightLb = baseWeightLb * allowanceFactor;
  const orderShortTons = orderWeightLb / 2000;
  const orderMetricTonnes = orderWeightLb * 0.00045359237;
  const price = parseFinite(input.price);
  const estimatedCost = price === null
    ? null
    : (input.priceUnit === "ton" ? orderShortTons : orderVolumeCubicYd) * price;
  const bagVolume = parseFinite(input.bagVolume);

  const bagCount = bagVolume === null ? null : Math.ceil((orderVolumeCubicYd * 27) / bagVolume);
  return {
    areaSqFt,
    baseVolumeCubicFt,
    baseVolumeCubicYd,
    baseVolumeCubicM,
    baseWeightLb,
    baseShortTons,
    baseMetricTonnes,
    orderVolumeCubicYd,
    orderWeightLb,
    orderShortTons,
    orderMetricTonnes,
    estimatedCost,
    bagCount,
    bagCost: bagCount === null || parseFinite(input.bagPrice) === null
      ? null
      : bagCount * parseFinite(input.bagPrice)!,
    allowanceQuantityCubicYd: orderVolumeCubicYd - baseVolumeCubicYd,
  };
};
