import { isLengthUnit, parseFinite, toFeet, type LengthUnit } from "./material-units";

export type StudInputs = {
  wallLength: string;
  wallLengthUnit: LengthUnit;
  wallHeight: string;
  wallHeightUnit: LengthUnit;
  spacingMode: "16" | "24" | "custom";
  customSpacingInches: string;
  segmentCount: string;
  additionalStuds: string;
  wastePercent: string;
  pricePerStud: string;
};

export type StudResult = {
  wallLengthFeet: number;
  wallHeightFeet: number;
  spacingInches: number;
  baseStudCount: number;
  additionalStuds: number;
  totalBeforeWaste: number;
  wasteQuantity: number;
  purchaseCount: number;
  estimatedCost: number | null;
};

export const defaultStudInputs = (): StudInputs => ({
  wallLength: "20",
  wallLengthUnit: "ft",
  wallHeight: "8",
  wallHeightUnit: "ft",
  spacingMode: "16",
  customSpacingInches: "16",
  segmentCount: "1",
  additionalStuds: "0",
  wastePercent: "10",
  pricePerStud: "",
});

export const validateStudInputs = (input: StudInputs): string | null => {
  if (!isLengthUnit(input.wallLengthUnit) || !isLengthUnit(input.wallHeightUnit)) return "Choose supported wall measurement units.";
  if (input.spacingMode !== "16" && input.spacingMode !== "24" && input.spacingMode !== "custom") return "Choose a supported stud spacing.";
  const wallLength = parseFinite(input.wallLength);
  const wallHeight = parseFinite(input.wallHeight);
  const customSpacing = parseFinite(input.customSpacingInches);
  const segmentCount = parseFinite(input.segmentCount);
  const additionalStuds = parseFinite(input.additionalStuds);
  const wastePercent = parseFinite(input.wastePercent);
  const price = parseFinite(input.pricePerStud);
  if (wallLength === null || wallLength <= 0) return "Wall length must be greater than zero.";
  if (wallHeight === null || wallHeight <= 0) return "Wall height must be greater than zero.";
  if (input.spacingMode === "custom" && (customSpacing === null || customSpacing <= 0)) return "Custom stud spacing must be greater than zero.";
  if (segmentCount === null || !Number.isInteger(segmentCount) || segmentCount < 1) return "Number of wall segments must be a whole number greater than zero.";
  if (additionalStuds === null || !Number.isInteger(additionalStuds) || additionalStuds < 0) return "Additional studs must be a nonnegative whole number.";
  if (wastePercent === null || wastePercent < 0) return "Waste allowance must be zero or greater.";
  if (input.pricePerStud !== "" && (price === null || price < 0)) return "Price per stud must be a nonnegative finite number.";
  return null;
};

export const calculateStuds = (input: StudInputs): StudResult => {
  const error = validateStudInputs(input);
  if (error) throw new Error(error);

  const wallLengthFeet = toFeet(parseFinite(input.wallLength)!, input.wallLengthUnit);
  const wallHeightFeet = toFeet(parseFinite(input.wallHeight)!, input.wallHeightUnit);
  const spacingInches = input.spacingMode === "custom" ? parseFinite(input.customSpacingInches)! : Number(input.spacingMode);
  const wallLengthInches = wallLengthFeet * 12;
  const studsPerSegment = Math.ceil(wallLengthInches / spacingInches - 1e-12) + 1;
  const baseStudCount = studsPerSegment * parseFinite(input.segmentCount)!;
  const additionalStuds = parseFinite(input.additionalStuds)!;
  const totalBeforeWaste = baseStudCount + additionalStuds;
  const purchaseCount = Math.ceil(totalBeforeWaste * (1 + parseFinite(input.wastePercent)! / 100) - 1e-12);
  const wasteQuantity = purchaseCount - totalBeforeWaste;
  const price = parseFinite(input.pricePerStud);

  return {
    wallLengthFeet,
    wallHeightFeet,
    spacingInches,
    baseStudCount,
    additionalStuds,
    totalBeforeWaste,
    wasteQuantity,
    purchaseCount,
    estimatedCost: price === null ? null : purchaseCount * price,
  };
};
