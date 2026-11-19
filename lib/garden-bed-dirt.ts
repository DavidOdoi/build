import { areaInSquareFeet, isLengthUnit, parseFinite, toFeet, type AreaShape, type LengthUnit } from "./material-units";

export type GardenBedDirtInputs = {
  shape: AreaShape;
  length: string;
  lengthUnit: LengthUnit;
  width: string;
  widthUnit: LengthUnit;
  depth: string;
  depthUnit: LengthUnit;
  bedCount: string;
  allowance: string;
  bagVolume: string;
  bulkPricePerYard: string;
};

export type GardenBedDirtResult = {
  areaSqFt: number;
  baseVolumeCubicFt: number;
  baseVolumeCubicYd: number;
  baseVolumeCubicM: number;
  orderVolumeCubicFt: number;
  orderVolumeCubicYd: number;
  orderVolumeCubicM: number;
  bagCount: number | null;
  estimatedBulkCost: number | null;
  allowanceVolumeCubicFt: number;
};

export const defaultGardenBedDirtInputs = (): GardenBedDirtInputs => ({
  shape: "rectangle",
  length: "4",
  lengthUnit: "ft",
  width: "8",
  widthUnit: "ft",
  depth: "3",
  depthUnit: "in",
  bedCount: "1",
  allowance: "10",
  bagVolume: "2",
  bulkPricePerYard: "",
});

export const validateGardenBedDirtInputs = (input: GardenBedDirtInputs): string | null => {
  if (input.shape !== "rectangle" && input.shape !== "circle") return "Choose a supported bed shape.";
  if (!isLengthUnit(input.lengthUnit) || !isLengthUnit(input.depthUnit)) return "Choose supported measurement units.";
  if (input.shape === "rectangle" && !isLengthUnit(input.widthUnit)) return "Choose a supported width unit.";
  const length = parseFinite(input.length);
  const width = parseFinite(input.width);
  const depth = parseFinite(input.depth);
  const count = parseFinite(input.bedCount);
  const allowance = parseFinite(input.allowance);
  const bagVolume = parseFinite(input.bagVolume);
  const price = parseFinite(input.bulkPricePerYard);
  if (length === null || length <= 0) return input.shape === "circle" ? "Radius must be greater than zero." : "Length must be greater than zero.";
  if (input.shape === "rectangle" && (width === null || width <= 0)) return "Width must be greater than zero.";
  if (depth === null || depth <= 0) return "Added soil depth must be greater than zero.";
  if (count === null || !Number.isInteger(count) || count < 1) return "Number of beds must be a whole number greater than zero.";
  if (allowance === null || allowance < 0) return "Allowance must be zero or greater.";
  if (input.bagVolume !== "" && (bagVolume === null || bagVolume <= 0)) return "Bag volume must be greater than zero.";
  if (input.bulkPricePerYard !== "" && (price === null || price < 0)) return "Bulk soil price must be a nonnegative finite number.";
  return null;
};

export const calculateGardenBedDirt = (input: GardenBedDirtInputs): GardenBedDirtResult => {
  const error = validateGardenBedDirtInputs(input);
  if (error) throw new Error(error);

  const areaPerBed = areaInSquareFeet(
    input.shape,
    parseFinite(input.length)!,
    input.lengthUnit,
    input.shape === "rectangle" ? parseFinite(input.width)! : 0,
    input.widthUnit,
  );
  const areaSqFt = areaPerBed * parseFinite(input.bedCount)!;
  const baseVolumeCubicFt = areaSqFt * toFeet(parseFinite(input.depth)!, input.depthUnit);
  const baseVolumeCubicYd = baseVolumeCubicFt / 27;
  const baseVolumeCubicM = baseVolumeCubicFt * 0.028316846592;
  const orderVolumeCubicFt = baseVolumeCubicFt * (1 + parseFinite(input.allowance)! / 100);
  const orderVolumeCubicYd = orderVolumeCubicFt / 27;
  const orderVolumeCubicM = orderVolumeCubicFt * 0.028316846592;
  const bagVolume = parseFinite(input.bagVolume);
  const price = parseFinite(input.bulkPricePerYard);

  return {
    areaSqFt,
    baseVolumeCubicFt,
    baseVolumeCubicYd,
    baseVolumeCubicM,
    orderVolumeCubicFt,
    orderVolumeCubicYd,
    orderVolumeCubicM,
    bagCount: bagVolume === null ? null : Math.ceil(orderVolumeCubicFt / bagVolume),
    estimatedBulkCost: price === null ? null : orderVolumeCubicYd * price,
    allowanceVolumeCubicFt: orderVolumeCubicFt - baseVolumeCubicFt,
  };
};
