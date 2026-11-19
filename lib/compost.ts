import { areaInSquareFeet, isLengthUnit, parseFinite, toFeet, type AreaShape, type LengthUnit } from "./material-units";

export type CompostInputs = {
  shape: AreaShape;
  length: string;
  lengthUnit: LengthUnit;
  width: string;
  widthUnit: LengthUnit;
  depth: string;
  depthUnit: LengthUnit;
  areaCount: string;
  allowance: string;
  bagVolume: string;
  price: string;
  priceUnit: "yd3" | "bag";
};

export type CompostResult = {
  areaSqFt: number;
  baseVolumeCubicFt: number;
  baseVolumeCubicYd: number;
  baseVolumeCubicM: number;
  orderVolumeCubicFt: number;
  orderVolumeCubicYd: number;
  orderVolumeCubicM: number;
  bagCount: number | null;
  estimatedCost: number | null;
  allowanceVolumeCubicFt: number;
};

export const defaultCompostInputs = (): CompostInputs => ({
  shape: "rectangle",
  length: "20",
  lengthUnit: "ft",
  width: "10",
  widthUnit: "ft",
  depth: "2",
  depthUnit: "in",
  areaCount: "1",
  allowance: "5",
  bagVolume: "2",
  price: "",
  priceUnit: "yd3",
});

export const validateCompostInputs = (input: CompostInputs): string | null => {
  if (input.shape !== "rectangle" && input.shape !== "circle") return "Choose a supported area shape.";
  if (!isLengthUnit(input.lengthUnit) || !isLengthUnit(input.depthUnit)) return "Choose supported measurement units.";
  if (input.shape === "rectangle" && !isLengthUnit(input.widthUnit)) return "Choose a supported width unit.";
  const length = parseFinite(input.length);
  const width = parseFinite(input.width);
  const depth = parseFinite(input.depth);
  const count = parseFinite(input.areaCount);
  const allowance = parseFinite(input.allowance);
  const bagVolume = parseFinite(input.bagVolume);
  const price = parseFinite(input.price);
  if (length === null || length <= 0) return input.shape === "circle" ? "Radius must be greater than zero." : "Length must be greater than zero.";
  if (input.shape === "rectangle" && (width === null || width <= 0)) return "Width must be greater than zero.";
  if (depth === null || depth <= 0) return "Application depth must be greater than zero.";
  if (count === null || !Number.isInteger(count) || count < 1) return "Number of areas must be a whole number greater than zero.";
  if (allowance === null || allowance < 0) return "Allowance must be zero or greater.";
  if (input.bagVolume !== "" && (bagVolume === null || bagVolume <= 0)) return "Bag volume must be greater than zero.";
  if (input.price !== "" && (price === null || price < 0)) return "Price must be a nonnegative finite number.";
  if (input.priceUnit !== "yd3" && input.priceUnit !== "bag") return "Choose a supported price unit.";
  if (input.priceUnit === "bag" && input.price !== "" && bagVolume === null) return "Enter bag volume to estimate bag cost.";
  return null;
};

export const calculateCompost = (input: CompostInputs): CompostResult => {
  const error = validateCompostInputs(input);
  if (error) throw new Error(error);

  const areaSqFt = areaInSquareFeet(
    input.shape,
    parseFinite(input.length)!,
    input.lengthUnit,
    input.shape === "rectangle" ? parseFinite(input.width)! : 0,
    input.widthUnit,
  ) * parseFinite(input.areaCount)!;
  const baseVolumeCubicFt = areaSqFt * toFeet(parseFinite(input.depth)!, input.depthUnit);
  const baseVolumeCubicYd = baseVolumeCubicFt / 27;
  const baseVolumeCubicM = baseVolumeCubicFt * 0.028316846592;
  const orderVolumeCubicFt = baseVolumeCubicFt * (1 + parseFinite(input.allowance)! / 100);
  const orderVolumeCubicYd = orderVolumeCubicFt / 27;
  const orderVolumeCubicM = orderVolumeCubicFt * 0.028316846592;
  const bagVolume = parseFinite(input.bagVolume);
  const bagCount = bagVolume === null ? null : Math.ceil(orderVolumeCubicFt / bagVolume);
  const price = parseFinite(input.price);
  const estimatedCost = price === null
    ? null
    : input.priceUnit === "yd3"
      ? orderVolumeCubicYd * price
      : bagCount === null
        ? null
        : bagCount * price;

  return {
    areaSqFt,
    baseVolumeCubicFt,
    baseVolumeCubicYd,
    baseVolumeCubicM,
    orderVolumeCubicFt,
    orderVolumeCubicYd,
    orderVolumeCubicM,
    bagCount,
    estimatedCost,
    allowanceVolumeCubicFt: orderVolumeCubicFt - baseVolumeCubicFt,
  };
};
