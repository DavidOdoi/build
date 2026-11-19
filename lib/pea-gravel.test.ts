import { describe, expect, it } from "vitest";
import { calculatePeaGravel, defaultPeaGravelInputs, validatePeaGravelInputs } from "./pea-gravel";

describe("pea gravel calculator", () => {
  it("calculates the standard rectangle, allowance, and ton-based cost", () => {
    const result = calculatePeaGravel({
      ...defaultPeaGravelInputs(),
      length: "20",
      width: "10",
      depth: "3",
      density: "100",
      allowance: "10",
      price: "50",
      priceUnit: "ton",
    });
    expect(result.areaSqFt).toBeCloseTo(200);
    expect(result.baseVolumeCubicFt).toBeCloseTo(50);
    expect(result.baseVolumeCubicYd).toBeCloseTo(1.85185185, 7);
    expect(result.baseWeightLb).toBeCloseTo(5000);
    expect(result.baseShortTons).toBeCloseTo(2.5);
    expect(result.orderShortTons).toBeCloseTo(2.75);
    expect(result.orderVolumeCubicYd).toBeCloseTo(2.03703704, 7);
    expect(result.estimatedCost).toBeCloseTo(137.5);
  });

  it("supports zero allowance and cubic-yard pricing", () => {
    const result = calculatePeaGravel({
      ...defaultPeaGravelInputs(),
      allowance: "0",
      price: "40",
      priceUnit: "yd3",
    });
    expect(result.orderShortTons).toBeCloseTo(2.5);
    expect(result.estimatedCost).toBeCloseTo(result.baseVolumeCubicYd * 40);
  });

  it("uses the selected bulk density when estimating weight", () => {
    const result = calculatePeaGravel({
      ...defaultPeaGravelInputs(),
      length: "20",
      width: "10",
      depth: "3",
      density: "120",
      allowance: "0",
    });
    expect(result.baseWeightLb).toBeCloseTo(6000);
    expect(result.baseShortTons).toBeCloseTo(3);
  });

  it("calculates circular area and bag quantity", () => {
    const result = calculatePeaGravel({
      ...defaultPeaGravelInputs(),
      shape: "circle",
      length: "5",
      lengthUnit: "ft",
      depth: "3",
      depthUnit: "in",
      allowance: "0",
      bagVolume: "2",
      bagPrice: "5",
    });
    expect(result.baseVolumeCubicFt).toBeCloseTo(Math.PI * 25 * 0.25, 7);
    expect(result.bagCount).toBe(Math.ceil(result.baseVolumeCubicFt / 2));
    expect(result.bagCost).toBeCloseTo(result.bagCount! * 5);
  });

  it("returns equivalent volume for metric inputs", () => {
    const imperial = calculatePeaGravel({
      ...defaultPeaGravelInputs(),
      length: "20",
      width: "10",
      depth: "3",
      allowance: "0",
    });
    const metric = calculatePeaGravel({
      ...defaultPeaGravelInputs(),
      length: "6.096",
      lengthUnit: "m",
      width: "3.048",
      widthUnit: "m",
      depth: "7.62",
      depthUnit: "cm",
      allowance: "0",
    });
    expect(metric.baseVolumeCubicFt).toBeCloseTo(imperial.baseVolumeCubicFt, 6);
  });

  it("rejects invalid measurements, density, price, and units", () => {
    const defaults = defaultPeaGravelInputs();
    expect(validatePeaGravelInputs({ ...defaults, length: "-1" })).not.toBeNull();
    expect(validatePeaGravelInputs({ ...defaults, depth: "0" })).not.toBeNull();
    expect(validatePeaGravelInputs({ ...defaults, density: "0" })).not.toBeNull();
    expect(validatePeaGravelInputs({ ...defaults, density: "Infinity" })).not.toBeNull();
    expect(validatePeaGravelInputs({ ...defaults, price: "-1" })).not.toBeNull();
    expect(validatePeaGravelInputs({ ...defaults, bagPrice: "5" })).not.toBeNull();
    expect(validatePeaGravelInputs({ ...defaults, lengthUnit: "parsec" as never })).not.toBeNull();
    expect(validatePeaGravelInputs({ ...defaults, priceUnit: "bag" as never })).not.toBeNull();
  });
});
