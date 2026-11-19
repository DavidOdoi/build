import { describe, expect, it } from "vitest";
import { calculateRafter, defaultRafterInputs, validateRafterInputs } from "./rafter";

describe("rafter calculator", () => {
  it("calculates run, rise, length, and angle from symmetrical span", () => {
    const result = calculateRafter({
      ...defaultRafterInputs(),
      dimensionMode: "span",
      horizontalLength: "24",
      lengthUnit: "ft",
      pitchRise: "6",
    });

    expect(result.runFeet).toBe(12);
    expect(result.riseFeet).toBe(6);
    expect(result.rafterLineFeet).toBeCloseTo(Math.sqrt(180), 10);
    expect(result.roofAngleDegrees).toBeCloseTo(26.56505118, 7);
  });

  it("adds the sloped contribution of a horizontal overhang", () => {
    const result = calculateRafter({
      ...defaultRafterInputs(),
      horizontalOverhang: "2",
      overhangUnit: "ft",
    });

    expect(result.slopedOverhangFeet).toBeCloseTo(Math.sqrt(5), 10);
    expect(result.totalSlopedLengthFeet).toBeCloseTo(15.652475842, 8);
  });

  it("supports zero pitch, a direct run, and equivalent metric measurements", () => {
    const flat = calculateRafter({ ...defaultRafterInputs(), dimensionMode: "run", horizontalLength: "12", pitchRise: "0" });
    expect(flat.rafterLineFeet).toBe(12);
    expect(flat.roofAngleDegrees).toBe(0);

    const imperial = calculateRafter({ ...defaultRafterInputs(), dimensionMode: "run", horizontalLength: "12", lengthUnit: "ft", pitchRise: "6" });
    const metric = calculateRafter({ ...defaultRafterInputs(), dimensionMode: "run", horizontalLength: "3.6576", lengthUnit: "m", pitchRise: "6" });
    expect(metric.rafterLineFeet).toBeCloseTo(imperial.rafterLineFeet, 8);
  });

  it("rejects invalid lengths, pitch, units, and nonfinite values", () => {
    const defaults = defaultRafterInputs();
    expect(validateRafterInputs({ ...defaults, horizontalLength: "0" })).not.toBeNull();
    expect(validateRafterInputs({ ...defaults, horizontalLength: "-1" })).not.toBeNull();
    expect(validateRafterInputs({ ...defaults, pitchRise: "-1" })).not.toBeNull();
    expect(validateRafterInputs({ ...defaults, horizontalLength: "Infinity" })).not.toBeNull();
    expect(validateRafterInputs({ ...defaults, lengthUnit: "parsec" as never })).not.toBeNull();
    expect(validateRafterInputs({ ...defaults, overhangUnit: "parsec" as never })).not.toBeNull();
  });
});
