export type BrickLengthUnit = "ft" | "m" | "yd" | "in" | "cm";
export type BrickPreset = "us-modular" | "custom";

export type BrickInputs = {
  length: string;
  lengthUnit: BrickLengthUnit;
  height: string;
  heightUnit: BrickLengthUnit;
  brickPreset: BrickPreset;
  brickLength: string;
  brickHeight: string;
  mortarJoint: string;
  layers: string;
  windowsCount: string;
  windowWidth: string;
  windowHeight: string;
  doorsCount: string;
  doorWidth: string;
  doorHeight: string;
  waste: string;
  price: string;
  openingUnit: BrickLengthUnit;
};

export type BrickResult = {
  grossAreaSqFt: number;
  netAreaSqFt: number;
  baseBricks: number;
  wasteBricks: number;
  orderBricks: number;
  bricksPerSquareFoot: number;
  estimatedBrickCost: number;
  moduleLengthIn: number;
  moduleHeightIn: number;
  mortarJointIn: number;
};

export const defaultBrickInputs = (): BrickInputs => ({
  length: "20",
  lengthUnit: "ft",
  height: "8",
  heightUnit: "ft",
  brickPreset: "us-modular",
  brickLength: "7.625",
  brickHeight: "2.25",
  mortarJoint: "0.375",
  layers: "1",
  windowsCount: "0",
  windowWidth: "3",
  windowHeight: "4",
  doorsCount: "0",
  doorWidth: "3",
  doorHeight: "7",
  waste: "10",
  price: "0.9",
  openingUnit: "ft",
});

const parseFiniteNumber = (value: string | number | undefined): number | null => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const convertLengthToFeet = (value: number, unit: BrickLengthUnit): number => {
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

export const validateBrickInputs = (input: BrickInputs): string | null => {
  const lengthValue = parseFiniteNumber(input.length);
  const heightValue = parseFiniteNumber(input.height);
  const brickLengthValue = parseFiniteNumber(input.brickLength);
  const brickHeightValue = parseFiniteNumber(input.brickHeight);
  const mortarJointValue = parseFiniteNumber(input.mortarJoint);
  const layersValue = parseFiniteNumber(input.layers);
  const windowsCountValue = parseFiniteNumber(input.windowsCount);
  const doorsCountValue = parseFiniteNumber(input.doorsCount);
  const wasteValue = parseFiniteNumber(input.waste);
  const priceValue = parseFiniteNumber(input.price);
  const windowWidthValue = parseFiniteNumber(input.windowWidth);
  const windowHeightValue = parseFiniteNumber(input.windowHeight);
  const doorWidthValue = parseFiniteNumber(input.doorWidth);
  const doorHeightValue = parseFiniteNumber(input.doorHeight);

  if (lengthValue === null || lengthValue <= 0) return "Wall length must be greater than zero.";
  if (heightValue === null || heightValue <= 0) return "Wall height must be greater than zero.";
  if (layersValue === null || layersValue <= 0) return "Number of layers must be greater than zero.";
  if (brickLengthValue === null || brickLengthValue <= 0) return "Brick length must be greater than zero.";
  if (brickHeightValue === null || brickHeightValue <= 0) return "Brick height must be greater than zero.";
  if (mortarJointValue === null || mortarJointValue < 0) return "Mortar joint cannot be negative.";
  if (windowsCountValue === null || windowsCountValue < 0) return "Window count cannot be negative.";
  if (doorsCountValue === null || doorsCountValue < 0) return "Door count cannot be negative.";
  if (wasteValue === null || wasteValue < 0) return "Waste allowance cannot be negative.";
  if (priceValue !== null && priceValue < 0) return "Brick price cannot be negative.";
  if (windowWidthValue !== null && windowWidthValue <= 0) return "Window width must be greater than zero when provided.";
  if (windowHeightValue !== null && windowHeightValue <= 0) return "Window height must be greater than zero when provided.";
  if (doorWidthValue !== null && doorWidthValue <= 0) return "Door width must be greater than zero when provided.";
  if (doorHeightValue !== null && doorHeightValue <= 0) return "Door height must be greater than zero when provided.";

  return null;
};

export const calculateBrick = (input: BrickInputs): BrickResult => {
  const validationError = validateBrickInputs(input);
  if (validationError) throw new Error(validationError);

  const lengthFt = convertLengthToFeet(parseFiniteNumber(input.length) as number, input.lengthUnit);
  const heightFt = convertLengthToFeet(parseFiniteNumber(input.height) as number, input.heightUnit);
  const grossAreaSqFt = lengthFt * heightFt;

  const windowsCount = parseFiniteNumber(input.windowsCount) as number;
  const doorsCount = parseFiniteNumber(input.doorsCount) as number;
  const windowWidthFt = convertLengthToFeet(parseFiniteNumber(input.windowWidth) as number, input.openingUnit);
  const windowHeightFt = convertLengthToFeet(parseFiniteNumber(input.windowHeight) as number, input.openingUnit);
  const doorWidthFt = convertLengthToFeet(parseFiniteNumber(input.doorWidth) as number, input.openingUnit);
  const doorHeightFt = convertLengthToFeet(parseFiniteNumber(input.doorHeight) as number, input.openingUnit);

  const openingAreaSqFt = (windowsCount * windowWidthFt * windowHeightFt) + (doorsCount * doorWidthFt * doorHeightFt);
  const netAreaSqFt = Math.max(grossAreaSqFt - openingAreaSqFt, 0);

  let bricksPerSquareFoot = 6.75;
  const mortarJointIn = parseFiniteNumber(input.mortarJoint) as number;

  if (input.brickPreset === "custom") {
    const moduleLengthIn = (parseFiniteNumber(input.brickLength) as number) + mortarJointIn;
    const moduleHeightIn = (parseFiniteNumber(input.brickHeight) as number) + mortarJointIn;
    bricksPerSquareFoot = 144 / (moduleLengthIn * moduleHeightIn);
  }

  const layersValue = parseFiniteNumber(input.layers) as number;
  const wastePercent = parseFiniteNumber(input.waste) as number;
  const baseBricks = netAreaSqFt * bricksPerSquareFoot * layersValue;
  const orderBricks = Math.ceil(baseBricks * (1 + wastePercent / 100));
  const wasteBricks = orderBricks - baseBricks;
  const estimatedBrickCost = orderBricks * (parseFiniteNumber(input.price) ?? 0);

  return {
    grossAreaSqFt,
    netAreaSqFt,
    baseBricks,
    wasteBricks,
    orderBricks,
    bricksPerSquareFoot,
    estimatedBrickCost,
    moduleLengthIn: input.brickPreset === "custom" ? (parseFiniteNumber(input.brickLength) as number) + mortarJointIn : 8,
    moduleHeightIn: input.brickPreset === "custom" ? (parseFiniteNumber(input.brickHeight) as number) + mortarJointIn : 2.625,
    mortarJointIn,
  };
};

export const formatNumber = (value: number, digits = 2): string => {
  if (!Number.isFinite(value)) return "0";
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
};
