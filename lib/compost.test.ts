import { describe, expect, it } from "vitest";
import { calculateCompost, defaultCompostInputs, validateCompostInputs } from "./compost";

describe("compost calculator", () => {
  it("matches the article's example application-volume table", () => {
    const cases = [
      { area: 100, depth: 1, volume: 100 / 12 },
      { area: 100, depth: 2, volume: 200 / 12 },
      { area: 200, depth: 2, volume: 400 / 12 },
      { area: 200, depth: 3, volume: 50 },
      { area: 400, depth: 1, volume: 400 / 12 },
    ];

    for (const testCase of cases) {
      const result = calculateCompost({
        ...defaultCompostInputs(),
        length: String(testCase.area),
        width: "1",
        depth: String(testCase.depth),
        depthUnit: "in",
        allowance: "0",
      });
      expect(result.baseVolumeCubicFt).toBeCloseTo(testCase.volume, 2);
    }
  });

  it("matches the article's 20 by 10 foot, 2 inch, 5% allowance example", () => {
    const result = calculateCompost({
      ...defaultCompostInputs(),
      length: "20",
      width: "10",
      depth: "2",
      depthUnit: "in",
      allowance: "5",
      bagVolume: "2",
      price: "45",
      priceUnit: "yd3",
    });

    expect(result.baseVolumeCubicFt).toBeCloseTo(33.3333333, 6);
    expect(result.orderVolumeCubicFt).toBeCloseTo(35);
    expect(result.orderVolumeCubicYd).toBeCloseTo(35 / 27);
    expect(result.bagCount).toBe(18);
    expect(result.estimatedCost).toBeCloseTo(58.3333333, 6);
    expect(calculateCompost({ ...defaultCompostInputs(), length: "100", width: "1", depth: "2", depthUnit: "in", allowance: "0" }).baseVolumeCubicFt).toBeCloseTo(16.6666667, 6);
    expect(calculateCompost({ ...defaultCompostInputs(), length: "200", width: "1", depth: "3", depthUnit: "in", allowance: "0" }).baseVolumeCubicFt).toBeCloseTo(50);
    expect(calculateCompost({ ...defaultCompostInputs(), allowance: "5", bagVolume: "1", priceUnit: "bag" }).bagCount).toBe(35);
    expect(calculateCompost({ ...defaultCompostInputs(), allowance: "5", bagVolume: "1.5", priceUnit: "bag" }).bagCount).toBe(24);
  });

  it("uses whole bag counts for bag-based pricing and supports circles", () => {
    const result = calculateCompost({
      ...defaultCompostInputs(),
      shape: "circle",
      length: "5",
      lengthUnit: "ft",
      depth: "2",
      depthUnit: "in",
      areaCount: "2",
      allowance: "0",
      bagVolume: "2",
      price: "6",
      priceUnit: "bag",
    });

    const volume = 2 * Math.PI * 25 * (2 / 12);
    expect(result.baseVolumeCubicFt).toBeCloseTo(volume);
    expect(result.bagCount).toBe(Math.ceil(volume / 2));
    expect(result.estimatedCost).toBe(result.bagCount! * 6);
  });

  it("rejects invalid counts, negative allowances, and bag pricing without bag size", () => {
    const defaults = defaultCompostInputs();
    expect(validateCompostInputs({ ...defaults, areaCount: "1.5" })).not.toBeNull();
    expect(validateCompostInputs({ ...defaults, allowance: "-1" })).not.toBeNull();
    expect(validateCompostInputs({ ...defaults, priceUnit: "bag", price: "5", bagVolume: "" })).not.toBeNull();
  });
});
