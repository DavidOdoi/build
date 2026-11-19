import { isLengthUnit, parseFinite, toFeet, type LengthUnit } from "./material-units";

export type RaisedBedSoilInputs = {
  length: string;
  lengthUnit: LengthUnit;
  width: string;
  widthUnit: LengthUnit;
  bedHeight: string;
  bedHeightUnit: LengthUnit;
  depth: string;
  depthUnit: LengthUnit;
  bedCount: string;
  allowance: string;
  mixEnabled: boolean;
  growingSoilPercent: string;
  compostPercent: string;
  bagVolume: string;
  growingSoilPricePerBag: string;
  compostPricePerBag: string;
};

export type RaisedBedSoilResult = {
  areaSqFtPerBed: number;
  totalAreaSqFt: number;
  baseVolumeCubicFt: number;
  baseVolumeCubicYd: number;
  orderVolumeCubicFt: number;
  orderVolumeCubicYd: number;
  orderVolumeCubicM: number;
  totalBagCount: number | null;
  growingSoilVolumeCubicFt: number | null;
  compostVolumeCubicFt: number | null;
  growingSoilBagCount: number | null;
  compostBagCount: number | null;
  estimatedCost: number | null;
  allowanceVolumeCubicFt: number;
};

export const defaultRaisedBedSoilInputs = (): RaisedBedSoilInputs => ({
  length: "8",
  lengthUnit: "ft",
  width: "4",
  widthUnit: "ft",
  bedHeight: "24",
  bedHeightUnit: "in",
  depth: "12",
  depthUnit: "in",
  bedCount: "1",
  allowance: "10",
  mixEnabled: false,
  growingSoilPercent: "60",
  compostPercent: "40",
  bagVolume: "2",
  growingSoilPricePerBag: "",
  compostPricePerBag: "",
});

export const validateRaisedBedSoilInputs = (input: RaisedBedSoilInputs): string | null => {
  if (!isLengthUnit(input.lengthUnit) || !isLengthUnit(input.widthUnit) || !isLengthUnit(input.bedHeightUnit) || !isLengthUnit(input.depthUnit)) return "Choose supported measurement units.";
  const length = parseFinite(input.length);
  const width = parseFinite(input.width);
  const bedHeight = parseFinite(input.bedHeight);
  const depth = parseFinite(input.depth);
  const count = parseFinite(input.bedCount);
  const allowance = parseFinite(input.allowance);
  const growingSoilPercent = parseFinite(input.growingSoilPercent);
  const compostPercent = parseFinite(input.compostPercent);
  const bagVolume = parseFinite(input.bagVolume);
  const growingSoilPrice = parseFinite(input.growingSoilPricePerBag);
  const compostPrice = parseFinite(input.compostPricePerBag);
  if (length === null || length <= 0) return "Bed interior length must be greater than zero.";
  if (width === null || width <= 0) return "Bed interior width must be greater than zero.";
  if (bedHeight === null || bedHeight <= 0) return "Bed interior height must be greater than zero.";
  if (depth === null || depth <= 0) return "Fill depth must be greater than zero.";
  if (toFeet(depth, input.depthUnit) > toFeet(bedHeight, input.bedHeightUnit) + 1e-9) return "Planned fill depth cannot exceed the bed interior height.";
  if (count === null || !Number.isInteger(count) || count < 1) return "Number of beds must be a whole number greater than zero.";
  if (allowance === null || allowance < 0) return "Allowance must be zero or greater.";
  if (input.mixEnabled) {
    if (growingSoilPercent === null || growingSoilPercent < 0 || compostPercent === null || compostPercent < 0) return "Mix percentages must be zero or greater.";
    if (Math.abs(growingSoilPercent + compostPercent - 100) > 1e-9) return "Growing soil and compost percentages must total 100%.";
  }
  if (input.bagVolume !== "" && (bagVolume === null || bagVolume <= 0)) return "Bag volume must be greater than zero.";
  if (input.growingSoilPricePerBag !== "" && (growingSoilPrice === null || growingSoilPrice < 0)) return "Growing soil price must be a nonnegative finite number.";
  if (input.compostPricePerBag !== "" && (compostPrice === null || compostPrice < 0)) return "Compost price must be a nonnegative finite number.";
  if ((input.growingSoilPricePerBag !== "" || input.compostPricePerBag !== "") && bagVolume === null) return "Enter bag volume to estimate bag costs.";
  return null;
};

export const calculateRaisedBedSoil = (input: RaisedBedSoilInputs): RaisedBedSoilResult => {
  const error = validateRaisedBedSoilInputs(input);
  if (error) throw new Error(error);

  const lengthFt = toFeet(parseFinite(input.length)!, input.lengthUnit);
  const widthFt = toFeet(parseFinite(input.width)!, input.widthUnit);
  const depthFt = toFeet(parseFinite(input.depth)!, input.depthUnit);
  const areaSqFtPerBed = lengthFt * widthFt;
  const totalAreaSqFt = areaSqFtPerBed * parseFinite(input.bedCount)!;
  const baseVolumeCubicFt = totalAreaSqFt * depthFt;
  const baseVolumeCubicYd = baseVolumeCubicFt / 27;
  const orderVolumeCubicFt = baseVolumeCubicFt * (1 + parseFinite(input.allowance)! / 100);
  const orderVolumeCubicYd = orderVolumeCubicFt / 27;
  const orderVolumeCubicM = orderVolumeCubicFt * 0.028316846592;
  const bagVolume = parseFinite(input.bagVolume);
  const totalBagCount = bagVolume === null ? null : Math.ceil(orderVolumeCubicFt / bagVolume);

  let growingSoilVolumeCubicFt: number | null = null;
  let compostVolumeCubicFt: number | null = null;
  let growingSoilBagCount: number | null = null;
  let compostBagCount: number | null = null;
  let estimatedCost: number | null = null;

  if (input.mixEnabled) {
    growingSoilVolumeCubicFt = orderVolumeCubicFt * parseFinite(input.growingSoilPercent)! / 100;
    compostVolumeCubicFt = orderVolumeCubicFt * parseFinite(input.compostPercent)! / 100;
    growingSoilBagCount = bagVolume === null ? null : Math.ceil(growingSoilVolumeCubicFt / bagVolume);
    compostBagCount = bagVolume === null ? null : Math.ceil(compostVolumeCubicFt / bagVolume);
    const soilPrice = parseFinite(input.growingSoilPricePerBag);
    const compostPrice = parseFinite(input.compostPricePerBag);
    if (growingSoilBagCount !== null && compostBagCount !== null && soilPrice !== null && compostPrice !== null) {
      estimatedCost = growingSoilBagCount * soilPrice + compostBagCount * compostPrice;
    }
  } else {
    const soilPrice = parseFinite(input.growingSoilPricePerBag);
    if (totalBagCount !== null && soilPrice !== null) estimatedCost = totalBagCount * soilPrice;
  }

  return {
    areaSqFtPerBed,
    totalAreaSqFt,
    baseVolumeCubicFt,
    baseVolumeCubicYd,
    orderVolumeCubicFt,
    orderVolumeCubicYd,
    orderVolumeCubicM,
    totalBagCount,
    growingSoilVolumeCubicFt,
    compostVolumeCubicFt,
    growingSoilBagCount,
    compostBagCount,
    estimatedCost,
    allowanceVolumeCubicFt: orderVolumeCubicFt - baseVolumeCubicFt,
  };
};
