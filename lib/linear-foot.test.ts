import { describe, expect, it } from "vitest";
import { calculateLinearFeet, defaultLinearFootInputs, validateLinearFootInputs } from "./linear-foot";

describe("linear foot calculator", () => {
  it("matches the room perimeter, opening deduction, allowance, and cost example", () => {
    const result = calculateLinearFeet({
      ...defaultLinearFootInputs(),
      mode: "perimeter",
      roomLength: "15",
      roomWidth: "12",
      deductions: "3",
      deductionUnit: "ft",
      wastePercent: "10",
      pricePerFoot: "2.5",
    });

    expect(result.perimeterFeet).toBe(54);
    expect(result.measuredLengthFeet).toBe(51);
    expect(result.orderLengthFeet).toBeCloseTo(56.1);
    expect(result.estimatedCost).toBeCloseTo(140.25);
  });

  it("multiplies repeated lengths by their quantity", () => {
    const result = calculateLinearFeet({
      ...defaultLinearFootInputs(),
      mode: "lengths",
      lengthLines: [{ length: "8", unit: "ft", quantity: "3" }],
      wastePercent: "0",
    });
    expect(result.measuredLengthFeet).toBe(24);
  });

  it("converts area to linear feet only when material width is supplied", () => {
    const result = calculateLinearFeet({
      ...defaultLinearFootInputs(),
      mode: "area",
      area: "120",
      areaUnit: "ft2",
      materialWidth: "6",
      materialWidthUnit: "in",
      wastePercent: "0",
    });
    expect(result.measuredLengthFeet).toBe(240);
  });

  it("converts inches, meters, and mixed measurement units accurately", () => {
    const defaults = defaultLinearFootInputs();
    const inches = calculateLinearFeet({
      ...defaults,
      lengthLines: [{ length: "100", unit: "in", quantity: "1" }],
      wastePercent: "0",
    });
    const meters = calculateLinearFeet({
      ...defaults,
      lengthLines: [{ length: "10", unit: "m", quantity: "1" }],
      wastePercent: "0",
    });
    const mixed = calculateLinearFeet({
      ...defaults,
      lengthLines: [
        { length: "3", unit: "ft", quantity: "2" },
        { length: "24", unit: "in", quantity: "1" },
        { length: "1", unit: "yd", quantity: "1" },
      ],
      wastePercent: "0",
    });

    expect(inches.measuredLengthFeet).toBeCloseTo(8.333333333, 8);
    expect(meters.measuredLengthFeet).toBeCloseTo(32.80839895, 7);
    expect(mixed.measuredLengthFeet).toBe(11);
  });

  it("calculates a lower-bound stock piece count from adjusted footage", () => {
    const result = calculateLinearFeet({
      ...defaultLinearFootInputs(),
      lengthLines: [{ length: "17", unit: "ft", quantity: "1" }],
      wastePercent: "10",
      stockLength: "8",
      stockLengthUnit: "ft",
    });
    expect(result.orderLengthFeet).toBeCloseTo(18.7);
    expect(result.stockPieceLowerBound).toBe(3);
  });

  it("rejects invalid lengths, widths, deductions, counts, units, and nonfinite values", () => {
    const defaults = defaultLinearFootInputs();
    expect(validateLinearFootInputs({ ...defaults, lengthLines: [{ length: "0", unit: "ft", quantity: "1" }] })).not.toBeNull();
    expect(validateLinearFootInputs({ ...defaults, lengthLines: [{ length: "8", unit: "ft", quantity: "0" }] })).not.toBeNull();
    expect(validateLinearFootInputs({ ...defaults, lengthLines: [{ length: "8", unit: "parsec" as never, quantity: "1" }] })).not.toBeNull();
    expect(validateLinearFootInputs({ ...defaults, mode: "area", materialWidth: "0" })).not.toBeNull();
    expect(validateLinearFootInputs({ ...defaults, mode: "area", materialWidth: "-1" })).not.toBeNull();
    expect(validateLinearFootInputs({ ...defaults, mode: "perimeter", deductions: "-1" })).not.toBeNull();
    expect(validateLinearFootInputs({ ...defaults, mode: "perimeter", deductions: "60", deductionUnit: "ft" })).not.toBeNull();
    expect(validateLinearFootInputs({ ...defaults, mode: "area", area: "Infinity" })).not.toBeNull();
    expect(validateLinearFootInputs({ ...defaults, stockLength: "0" })).not.toBeNull();
  });
});
