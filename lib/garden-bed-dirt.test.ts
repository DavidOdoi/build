import { describe, expect, it } from "vitest";
import { calculateGardenBedDirt, defaultGardenBedDirtInputs, validateGardenBedDirtInputs } from "./garden-bed-dirt";

describe("garden bed dirt calculator", () => {
  it("matches the article's reference table", () => {
    const cases = [
      { length: "4", width: "4", depth: "3", cubicFeet: 4, cubicYards: 4 / 27 },
      { length: "4", width: "8", depth: "6", cubicFeet: 16, cubicYards: 16 / 27 },
      { length: "6", width: "10", depth: "4", cubicFeet: 20, cubicYards: 20 / 27 },
      { length: "10", width: "10", depth: "6", cubicFeet: 50, cubicYards: 50 / 27 },
    ];

    for (const testCase of cases) {
      const result = calculateGardenBedDirt({
        ...defaultGardenBedDirtInputs(),
        ...testCase,
        depthUnit: "in",
        allowance: "0",
      });
      expect(result.baseVolumeCubicFt).toBeCloseTo(testCase.cubicFeet);
      expect(result.baseVolumeCubicYd).toBeCloseTo(testCase.cubicYards);
    }
  });

  it("matches the article's 12 by 6 foot worked example", () => {
    const result = calculateGardenBedDirt({
      ...defaultGardenBedDirtInputs(),
      length: "12",
      width: "6",
      depth: "4",
      depthUnit: "in",
      allowance: "10",
      bagVolume: "1.5",
      bulkPricePerYard: "40",
    });

    expect(result.baseVolumeCubicFt).toBeCloseTo(24);
    expect(result.baseVolumeCubicYd).toBeCloseTo(0.8888889, 7);
    expect(result.orderVolumeCubicFt).toBeCloseTo(26.4);
    expect(result.orderVolumeCubicYd).toBeCloseTo(0.9777778, 7);
    expect(result.bagCount).toBe(18);
    expect(result.estimatedBulkCost).toBeCloseTo(39.111111, 6);
    expect(calculateGardenBedDirt({
      ...defaultGardenBedDirtInputs(),
      length: "12",
      width: "6",
      depth: "4",
      depthUnit: "in",
      allowance: "10",
      bagVolume: "1",
    }).bagCount).toBe(27);
    expect(calculateGardenBedDirt({
      ...defaultGardenBedDirtInputs(),
      length: "12",
      width: "6",
      depth: "4",
      depthUnit: "in",
      allowance: "10",
      bagVolume: "2",
    }).bagCount).toBe(14);
  });

  it("combines identical circular beds and converts metric dimensions", () => {
    const result = calculateGardenBedDirt({
      ...defaultGardenBedDirtInputs(),
      shape: "circle",
      length: "1.524",
      lengthUnit: "m",
      depth: "10",
      depthUnit: "cm",
      bedCount: "2",
      allowance: "0",
      bagVolume: "",
    });

    expect(result.areaSqFt).toBeCloseTo(2 * Math.PI * 25, 6);
    expect(result.baseVolumeCubicFt).toBeCloseTo(2 * Math.PI * 25 * (10 / 30.48), 6);
    expect(result.bagCount).toBeNull();
  });

  it("rejects fractional bed counts and invalid optional quantities", () => {
    const defaults = defaultGardenBedDirtInputs();
    expect(validateGardenBedDirtInputs({ ...defaults, bedCount: "1.5" })).not.toBeNull();
    expect(validateGardenBedDirtInputs({ ...defaults, bagVolume: "0" })).not.toBeNull();
    expect(validateGardenBedDirtInputs({ ...defaults, bulkPricePerYard: "-1" })).not.toBeNull();
  });
});
