import { isLengthUnit, parseFinite, toFeet, type LengthUnit } from "./material-units";

export type RafterInputs = {
  dimensionMode: "run" | "span";
  horizontalLength: string;
  lengthUnit: LengthUnit;
  pitchRise: string;
  horizontalOverhang: string;
  overhangUnit: LengthUnit;
};

export type RafterResult = {
  runFeet: number;
  riseFeet: number;
  rafterLineFeet: number;
  roofAngleDegrees: number;
  horizontalOverhangFeet: number;
  slopedOverhangFeet: number;
  totalSlopedLengthFeet: number;
};

export const defaultRafterInputs = (): RafterInputs => ({
  dimensionMode: "span",
  horizontalLength: "24",
  lengthUnit: "ft",
  pitchRise: "6",
  horizontalOverhang: "0",
  overhangUnit: "ft",
});

export const validateRafterInputs = (input: RafterInputs): string | null => {
  if (input.dimensionMode !== "run" && input.dimensionMode !== "span") return "Choose run or symmetrical roof span.";
  if (!isLengthUnit(input.lengthUnit) || !isLengthUnit(input.overhangUnit)) return "Choose supported length units.";
  const horizontalLength = parseFinite(input.horizontalLength);
  const pitchRise = parseFinite(input.pitchRise);
  const overhang = parseFinite(input.horizontalOverhang);
  if (horizontalLength === null || horizontalLength <= 0) {
    return input.dimensionMode === "span" ? "Roof span must be greater than zero." : "Horizontal run must be greater than zero.";
  }
  if (pitchRise === null || pitchRise < 0) return "Pitch rise must be a nonnegative finite number.";
  if (input.horizontalOverhang !== "" && (overhang === null || overhang < 0)) return "Horizontal overhang must be zero or greater.";
  return null;
};

export const calculateRafter = (input: RafterInputs): RafterResult => {
  const error = validateRafterInputs(input);
  if (error) throw new Error(error);

  const enteredLengthFeet = toFeet(parseFinite(input.horizontalLength)!, input.lengthUnit);
  const runFeet = input.dimensionMode === "span" ? enteredLengthFeet / 2 : enteredLengthFeet;
  const pitchRatio = parseFinite(input.pitchRise)! / 12;
  const riseFeet = runFeet * pitchRatio;
  const rafterLineFeet = Math.hypot(runFeet, riseFeet);
  const roofAngleDegrees = Math.atan(pitchRatio) * 180 / Math.PI;
  const horizontalOverhangFeet = input.horizontalOverhang === ""
    ? 0
    : toFeet(parseFinite(input.horizontalOverhang)!, input.overhangUnit);
  const slopedOverhangFeet = horizontalOverhangFeet * Math.sqrt(1 + pitchRatio ** 2);

  return {
    runFeet,
    riseFeet,
    rafterLineFeet,
    roofAngleDegrees,
    horizontalOverhangFeet,
    slopedOverhangFeet,
    totalSlopedLengthFeet: rafterLineFeet + slopedOverhangFeet,
  };
};
