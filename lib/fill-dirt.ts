import { isLengthUnit, parseFinite, roundUpToIncrement, toFeet, type LengthUnit } from "./material-units";

export type FillDirtInputs = {
  shape: "rectangle" | "circle";
  length: string;
  lengthUnit: LengthUnit;
  width: string;
  widthUnit: LengthUnit;
  depth: string;
  depthUnit: LengthUnit;
  density: string;
  allowance: string;
  compactionEnabled: boolean;
  compactionAdjustment: string;
  price: string;
  priceUnit: "ton" | "yd3";
  orderIncrement: string;
};

export type FillDirtResult = {
  areaSqFt: number;
  targetVolumeCubicFt: number;
  targetVolumeCubicYd: number;
  targetVolumeCubicM: number;
  looseVolumeBeforeAllowanceCubicYd: number;
  orderVolumeCubicYd: number;
  orderVolumeCubicFt: number;
  orderWeightLb: number;
  orderShortTons: number;
  orderMetricTonnes: number;
  estimatedCost: number | null;
  allowanceQuantityCubicYd: number;
  compactionQuantityCubicYd: number;
};

export const defaultFillDirtInputs = (): FillDirtInputs => ({
  shape: "rectangle",
  length: "30",
  lengthUnit: "ft",
  width: "12",
  widthUnit: "ft",
  depth: "6",
  depthUnit: "in",
  density: "90",
  allowance: "10",
  compactionEnabled: false,
  compactionAdjustment: "0",
  price: "",
  priceUnit: "yd3",
  orderIncrement: "",
});

export const validateFillDirtInputs = (input: FillDirtInputs): string | null => {
  if (input.shape !== "rectangle" && input.shape !== "circle") return "Choose a supported area shape.";
  if (!isLengthUnit(input.lengthUnit) || !isLengthUnit(input.depthUnit)) return "Choose supported measurement units.";
  if (input.shape === "rectangle" && !isLengthUnit(input.widthUnit)) return "Choose a supported width unit.";
  const length = parseFinite(input.length);
  const width = parseFinite(input.width);
  const depth = parseFinite(input.depth);
  const density = parseFinite(input.density);
  const allowance = parseFinite(input.allowance);
  const compaction = parseFinite(input.compactionAdjustment);
  const price = parseFinite(input.price);
  const increment = parseFinite(input.orderIncrement);
  if (length === null || length <= 0) return input.shape === "circle" ? "Radius must be greater than zero." : "Length must be greater than zero.";
  if (input.shape === "rectangle" && (width === null || width <= 0)) return "Width must be greater than zero.";
  if (depth === null || depth <= 0) return "Fill depth must be greater than zero.";
  if (density === null || density <= 0) return "Soil bulk density must be greater than zero.";
  if (allowance === null || allowance < 0) return "Order allowance must be zero or greater.";
  if (input.compactionEnabled && (compaction === null || compaction < 0)) return "Compaction adjustment must be zero or greater.";
  if (input.price !== "" && (price === null || price < 0)) return "Price must be a nonnegative finite number.";
  if (input.priceUnit !== "ton" && input.priceUnit !== "yd3") return "Choose a supported price unit.";
  if (input.orderIncrement !== "" && (increment === null || increment <= 0)) return "Supplier order increment must be greater than zero.";
  return null;
};

export const calculateFillDirt = (input: FillDirtInputs): FillDirtResult => {
  const error = validateFillDirtInputs(input);
  if (error) throw new Error(error);

  const lengthFt = toFeet(parseFinite(input.length)!, input.lengthUnit);
  const widthFt = input.shape === "rectangle" ? toFeet(parseFinite(input.width)!, input.widthUnit) : 0;
  const depthFt = toFeet(parseFinite(input.depth)!, input.depthUnit);
  const areaSqFt = input.shape === "circle" ? Math.PI * lengthFt ** 2 : lengthFt * widthFt;
  const targetVolumeCubicFt = areaSqFt * depthFt;
  const targetVolumeCubicYd = targetVolumeCubicFt / 27;
  const targetVolumeCubicM = targetVolumeCubicFt * 0.028316846592;
  const compactionFactor = input.compactionEnabled ? 1 + parseFinite(input.compactionAdjustment)! / 100 : 1;
  const looseVolumeBeforeAllowanceCubicYd = targetVolumeCubicYd * compactionFactor;
  const allowanceFactor = 1 + parseFinite(input.allowance)! / 100;
  const unroundedOrderVolume = looseVolumeBeforeAllowanceCubicYd * allowanceFactor;
  const increment = parseFinite(input.orderIncrement);
  const orderVolumeCubicYd = increment === null ? unroundedOrderVolume : roundUpToIncrement(unroundedOrderVolume, increment);
  const orderVolumeCubicFt = orderVolumeCubicYd * 27;
  const orderWeightLb = orderVolumeCubicFt * parseFinite(input.density)!;
  const orderShortTons = orderWeightLb / 2000;
  const orderMetricTonnes = orderWeightLb * 0.00045359237;
  const price = parseFinite(input.price);
  const estimatedCost = price === null
    ? null
    : (input.priceUnit === "ton" ? orderShortTons : orderVolumeCubicYd) * price;

  return {
    areaSqFt,
    targetVolumeCubicFt,
    targetVolumeCubicYd,
    targetVolumeCubicM,
    looseVolumeBeforeAllowanceCubicYd,
    orderVolumeCubicYd,
    orderVolumeCubicFt,
    orderWeightLb,
    orderShortTons,
    orderMetricTonnes,
    estimatedCost,
    allowanceQuantityCubicYd: unroundedOrderVolume - looseVolumeBeforeAllowanceCubicYd,
    compactionQuantityCubicYd: looseVolumeBeforeAllowanceCubicYd - targetVolumeCubicYd,
  };
};
