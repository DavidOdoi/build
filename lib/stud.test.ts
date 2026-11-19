import { describe, expect, it } from "vitest";
import { calculateStuds, defaultStudInputs, validateStudInputs } from "./stud";

describe("stud calculator", () => {
  it("calculates the article's 20-foot wall at 16 inches on center", () => {
    const result = calculateStuds({
      ...defaultStudInputs(),
      wallLength: "20",
      spacingMode: "16",
      wastePercent: "0",
    });
    expect(result.baseStudCount).toBe(16);
  });

  it("includes waste and estimates cost from the purchased quantity", () => {
    const result = calculateStuds({
      ...defaultStudInputs(),
      wallLength: "20",
      spacingMode: "16",
      wastePercent: "10",
      pricePerStud: "5",
    });
    expect(result.purchaseCount).toBe(18);
    expect(result.wasteQuantity).toBe(2);
    expect(result.estimatedCost).toBe(90);
  });

  it("matches the 20-foot and 10-foot wall examples at both standard spacings", () => {
    const defaults = defaultStudInputs();
    expect(calculateStuds({ ...defaults, wallLength: "20", spacingMode: "24", wastePercent: "0" }).baseStudCount).toBe(11);
    expect(calculateStuds({ ...defaults, wallLength: "10", spacingMode: "16", wastePercent: "0" }).baseStudCount).toBe(9);
  });

  it("counts separate wall segments independently and includes specified framing", () => {
    const defaults = defaultStudInputs();
    expect(calculateStuds({ ...defaults, wallLength: "10", segmentCount: "2", spacingMode: "16", wastePercent: "0" }).baseStudCount).toBe(18);
    const withExtra = calculateStuds({ ...defaults, additionalStuds: "4", wastePercent: "10" });
    expect(withExtra.totalBeforeWaste).toBe(20);
    expect(withExtra.purchaseCount).toBe(22);
  });

  it("supports custom spacing and equivalent metric wall lengths", () => {
    const defaults = defaultStudInputs();
    const custom = calculateStuds({ ...defaults, spacingMode: "custom", customSpacingInches: "16", wastePercent: "0" });
    const metric = calculateStuds({ ...defaults, wallLength: "6.096", wallLengthUnit: "m", spacingMode: "16", wastePercent: "0" });
    expect(custom.baseStudCount).toBe(metric.baseStudCount);
  });

  it("rejects invalid dimensions, counts, spacing, price, and units", () => {
    const defaults = defaultStudInputs();
    expect(validateStudInputs({ ...defaults, wallLength: "0" })).not.toBeNull();
    expect(validateStudInputs({ ...defaults, wallLength: "-1" })).not.toBeNull();
    expect(validateStudInputs({ ...defaults, spacingMode: "custom", customSpacingInches: "0" })).not.toBeNull();
    expect(validateStudInputs({ ...defaults, additionalStuds: "-1" })).not.toBeNull();
    expect(validateStudInputs({ ...defaults, segmentCount: "1.5" })).not.toBeNull();
    expect(validateStudInputs({ ...defaults, wallHeight: "Infinity" })).not.toBeNull();
    expect(validateStudInputs({ ...defaults, pricePerStud: "-2" })).not.toBeNull();
    expect(validateStudInputs({ ...defaults, wallLengthUnit: "parsec" as never })).not.toBeNull();
  });
});
