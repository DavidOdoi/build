import { isLengthUnit, parseFinite, roundUpToIncrement, toFeet, type LengthUnit } from "./material-units";

export type LandscapeRockMaterial = "decorative" | "river" | "crushed" | "pea" | "lava" | "custom";
export type LandscapeRockInputs = {
  shape: "rectangle" | "circle";
  length: string;
  lengthUnit: LengthUnit;
  width: string;
  widthUnit: LengthUnit;
  depth: string;
  depthUnit: LengthUnit;
  material: LandscapeRockMaterial;
  density: string;
  allowance: string;
  price: string;
  priceUnit: "ton" | "yd3";
  bagVolume: string;
  orderIncrement: string;
};

export type LandscapeRockResult = {
  areaSqFt: number;
  baseVolumeCubicFt: number;
  baseVolumeCubicYd: number;
  baseVolumeCubicM: number;
  baseWeightLb: number;
  baseShortTons: number;
  baseMetricTonnes: number;
  orderVolumeCubicYd: number;
  orderVolumeCubicFt: number;
  orderWeightLb: number;
  orderShortTons: number;
  orderMetricTonnes: number;
  estimatedCost: number | null;
  bagCount: number | null;
  selectedDensityLbPerFt3: number;
  allowanceQuantityCubicYd: number;
};

export const defaultLandscapeRockInputs = (): LandscapeRockInputs => ({
  shape: "rectangle",
  length: "15",
  lengthUnit: "ft",
  width: "8",
  widthUnit: "ft",
  depth: "2",
  depthUnit: "in",
  material: "decorative",
  density: "110",
  allowance: "5",
  price: "",
  priceUnit: "yd3",
  bagVolume: "",
  orderIncrement: "",
});

export const validateLandscapeRockInputs = (input: LandscapeRockInputs): string | null => {
  if (input.shape !== "rectangle" && input.shape !== "circle") return "Choose a supported area shape.";
  if (!isLengthUnit(input.lengthUnit) || !isLengthUnit(input.depthUnit)) return "Choose supported measurement units.";
  if (input.shape === "rectangle" && !isLengthUnit(input.widthUnit)) return "Choose a supported width unit.";
  if (!["decorative", "river", "crushed", "pea", "lava", "custom"].includes(input.material)) return "Choose a supported rock material.";
  const length = parseFinite(input.length);
  const width = parseFinite(input.width);
  const depth = parseFinite(input.depth);
  const density = parseFinite(input.density);
  const allowance = parseFinite(input.allowance);
  const price = parseFinite(input.price);
  const bagVolume = parseFinite(input.bagVolume);
  const increment = parseFinite(input.orderIncrement);
  if (length === null || length <= 0) return input.shape === "circle" ? "Radius must be greater than zero." : "Length must be greater than zero.";
  if (input.shape === "rectangle" && (width === null || width <= 0)) return "Width must be greater than zero.";
  if (depth === null || depth <= 0) return "Rock depth must be greater than zero.";
  if (density === null || density <= 0) return "Enter the selected material's bulk density.";
  if (allowance === null || allowance < 0) return "Order allowance must be zero or greater.";
  if (input.price !== "" && (price === null || price < 0)) return "Price must be a nonnegative finite number.";
  if (input.priceUnit !== "ton" && input.priceUnit !== "yd3") return "Choose a supported price unit.";
  if (input.bagVolume !== "" && (bagVolume === null || bagVolume <= 0)) return "Bag volume must be greater than zero.";
  if (input.orderIncrement !== "" && (increment === null || increment <= 0)) return "Supplier order increment must be greater than zero.";
  return null;
};

export const calculateLandscapeRock = (input: LandscapeRockInputs): LandscapeRockResult => {
  const error = validateLandscapeRockInputs(input);
  if (error) throw new Error(error);

  const lengthFt = toFeet(parseFinite(input.length)!, input.lengthUnit);
  const widthFt = input.shape === "rectangle" ? toFeet(parseFinite(input.width)!, input.widthUnit) : 0;
  const depthFt = toFeet(parseFinite(input.depth)!, input.depthUnit);
  const areaSqFt = input.shape === "circle" ? Math.PI * lengthFt ** 2 : lengthFt * widthFt;
  const baseVolumeCubicFt = areaSqFt * depthFt;
  const baseVolumeCubicYd = baseVolumeCubicFt / 27;
  const baseVolumeCubicM = baseVolumeCubicFt * 0.028316846592;
  const density = parseFinite(input.density)!;
  const baseWeightLb = baseVolumeCubicFt * density;
  const baseShortTons = baseWeightLb / 2000;
  const baseMetricTonnes = baseWeightLb * 0.00045359237;
  const orderVolumeWithoutRounding = baseVolumeCubicYd * (1 + parseFinite(input.allowance)! / 100);
  const increment = parseFinite(input.orderIncrement);
  const orderVolumeCubicYd = increment === null
    ? orderVolumeWithoutRounding
    : roundUpToIncrement(orderVolumeWithoutRounding, increment);
  const orderVolumeCubicFt = orderVolumeCubicYd * 27;
  const orderWeightLb = orderVolumeCubicFt * density;
  const orderShortTons = orderWeightLb / 2000;
  const orderMetricTonnes = orderWeightLb * 0.00045359237;
  const price = parseFinite(input.price);
  const estimatedCost = price === null
    ? null
    : (input.priceUnit === "ton" ? orderShortTons : orderVolumeCubicYd) * price;
  const bagVolume = parseFinite(input.bagVolume);

  return {
    areaSqFt,
    baseVolumeCubicFt,
    baseVolumeCubicYd,
    baseVolumeCubicM,
    baseWeightLb,
    baseShortTons,
    baseMetricTonnes,
    orderVolumeCubicYd,
    orderVolumeCubicFt,
    orderWeightLb,
    orderShortTons,
    orderMetricTonnes,
    estimatedCost,
    bagCount: bagVolume === null ? null : Math.ceil(orderVolumeCubicFt / bagVolume),
    selectedDensityLbPerFt3: density,
    allowanceQuantityCubicYd: orderVolumeWithoutRounding - baseVolumeCubicYd,
  };
};

export const landscapeRockCoverageSqFt = (depthInches: number): number => {
  if (!Number.isFinite(depthInches) || depthInches <= 0) throw new Error("Depth must be greater than zero.");
  return 27 / (depthInches / 12);
};
