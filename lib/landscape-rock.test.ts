import { describe, expect, it } from "vitest";
import { calculateLandscapeRock, defaultLandscapeRockInputs, landscapeRockCoverageSqFt, validateLandscapeRockInputs } from "./landscape-rock";

describe("landscape rock calculator", () => {
  it("calculates the standard estimate and cubic-yard cost", () => {
    const result = calculateLandscapeRock({
      ...defaultLandscapeRockInputs(),
      length: "15",
      width: "8",
      depth: "2",
      density: "110",
      allowance: "5",
      price: "80",
      priceUnit: "yd3",
    });
    expect(result.areaSqFt).toBeCloseTo(120);
    expect(result.baseVolumeCubicFt).toBeCloseTo(20);
    expect(result.baseVolumeCubicYd).toBeCloseTo(0.74074074, 7);
    expect(result.baseWeightLb).toBeCloseTo(2200);
    expect(result.baseShortTons).toBeCloseTo(1.1);
    expect(result.orderVolumeCubicYd).toBeCloseTo(0.77777778, 7);
    expect(result.orderShortTons).toBeCloseTo(1.155);
    expect(result.estimatedCost).toBeCloseTo(62.2222224, 5);
  });

  it("supports no allowance and alternate density", () => {
    const result = calculateLandscapeRock({
      ...defaultLandscapeRockInputs(),
      density: "80",
      allowance: "0",
    });
    expect(result.orderVolumeCubicYd).toBeCloseTo(20 / 27);
    expect(result.baseWeightLb).toBeCloseTo(1600);
    expect(result.baseShortTons).toBeCloseTo(0.8);
  });

  it("calculates circles, theoretical coverage, and ton pricing", () => {
    const circle = calculateLandscapeRock({
      ...defaultLandscapeRockInputs(),
      shape: "circle",
      length: "6",
      depth: "2",
      allowance: "0",
    });
    expect(circle.baseVolumeCubicFt).toBeCloseTo(Math.PI * 36 * (2 / 12), 7);
    expect(landscapeRockCoverageSqFt(3)).toBeCloseTo(108);

    const priced = calculateLandscapeRock({
      ...defaultLandscapeRockInputs(),
      allowance: "0",
      price: "75",
      priceUnit: "ton",
    });
    expect(priced.estimatedCost).toBeCloseTo(82.5);
  });

  it("converts metric dimensions and rounds orders for bags", () => {
    const imperial = calculateLandscapeRock({ ...defaultLandscapeRockInputs(), allowance: "0" });
    const metric = calculateLandscapeRock({
      ...defaultLandscapeRockInputs(),
      length: "4.572",
      lengthUnit: "m",
      width: "2.4384",
      widthUnit: "m",
      depth: "5.08",
      depthUnit: "cm",
      allowance: "0",
    });
    expect(metric.baseVolumeCubicFt).toBeCloseTo(imperial.baseVolumeCubicFt, 6);
    const bagged = calculateLandscapeRock({
      ...defaultLandscapeRockInputs(),
      allowance: "0",
      bagVolume: "2",
      orderIncrement: "0.5",
    });
    expect(bagged.bagCount).toBe(Math.ceil(bagged.orderVolumeCubicFt / 2));
  });

  it("rejects invalid inputs, including unspecified non-default densities", () => {
    const defaults = defaultLandscapeRockInputs();
    expect(validateLandscapeRockInputs({ ...defaults, length: "0" })).not.toBeNull();
    expect(validateLandscapeRockInputs({ ...defaults, depth: "0" })).not.toBeNull();
    expect(validateLandscapeRockInputs({ ...defaults, density: "" })).not.toBeNull();
    expect(validateLandscapeRockInputs({ ...defaults, density: "NaN" })).not.toBeNull();
    expect(validateLandscapeRockInputs({ ...defaults, price: "-1" })).not.toBeNull();
    expect(validateLandscapeRockInputs({ ...defaults, widthUnit: "parsec" as never })).not.toBeNull();
    expect(validateLandscapeRockInputs({ ...defaults, material: "granite" as never })).not.toBeNull();
  });
});
