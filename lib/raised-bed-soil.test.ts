import { describe, expect, it } from "vitest";
import { calculateRaisedBedSoil, defaultRaisedBedSoilInputs, validateRaisedBedSoilInputs } from "./raised-bed-soil";

describe("raised bed soil calculator", () => {
  it("matches the article's raised-bed size table", () => {
    const cases = [
      { length: "4", width: "4", depth: "12", volume: 16 },
      { length: "4", width: "8", depth: "12", volume: 32 },
      { length: "4", width: "8", depth: "18", volume: 48 },
      { length: "4", width: "8", depth: "24", volume: 64 },
      { length: "4", width: "10", depth: "18", volume: 60 },
    ];

    for (const testCase of cases) {
      const result = calculateRaisedBedSoil({
        ...defaultRaisedBedSoilInputs(),
        ...testCase,
        depthUnit: "in",
        allowance: "0",
      });
      expect(result.baseVolumeCubicFt).toBeCloseTo(testCase.volume);
    }
  });

  it("matches the article's 8 by 4 foot bed at 18 inches deep", () => {
    const result = calculateRaisedBedSoil({
      ...defaultRaisedBedSoilInputs(),
      length: "8",
      width: "4",
      depth: "18",
      depthUnit: "in",
      allowance: "10",
    });

    expect(result.baseVolumeCubicFt).toBeCloseTo(48);
    expect(result.orderVolumeCubicFt).toBeCloseTo(52.8);
    expect(result.orderVolumeCubicYd).toBeCloseTo(1.9555556, 7);
    expect(result.totalBagCount).toBe(27);
  });

  it("calculates ingredient volumes, whole bags, and the example mix cost", () => {
    const result = calculateRaisedBedSoil({
      ...defaultRaisedBedSoilInputs(),
      depth: "18",
      depthUnit: "in",
      allowance: "10",
      mixEnabled: true,
      growingSoilPercent: "60",
      compostPercent: "40",
      bagVolume: "2",
      growingSoilPricePerBag: "8",
      compostPricePerBag: "6",
    });

    expect(result.growingSoilVolumeCubicFt).toBeCloseTo(31.68);
    expect(result.compostVolumeCubicFt).toBeCloseTo(21.12);
    expect(result.growingSoilBagCount).toBe(16);
    expect(result.compostBagCount).toBe(11);
    expect(result.estimatedCost).toBe(194);
  });

  it("calculates multiple beds and rejects mix percentages that do not total 100", () => {
    const input = {
      ...defaultRaisedBedSoilInputs(),
      bedCount: "3",
      allowance: "0",
    };
    expect(calculateRaisedBedSoil(input).baseVolumeCubicFt).toBeCloseTo(96);
    expect(validateRaisedBedSoilInputs({ ...input, mixEnabled: true, growingSoilPercent: "60", compostPercent: "30" })).not.toBeNull();
    expect(validateRaisedBedSoilInputs({ ...input, bedCount: "2.5" })).not.toBeNull();
    expect(validateRaisedBedSoilInputs({ ...input, bedHeight: "10", bedHeightUnit: "in", depth: "12", depthUnit: "in" })).not.toBeNull();
  });
});
