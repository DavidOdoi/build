import { fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import SandCalculatorPage from "@/app/calculators/sand-calculator/SandCalculatorClient";
import { calculateSand, defaultSandInputs, validateSandInputs } from "@/lib/sand";

describe("sand calculator", () => {
  it("calculates the standard example", () => {
    const result = calculateSand({
      ...defaultSandInputs(),
      length: "12",
      lengthUnit: "ft",
      width: "10",
      widthUnit: "ft",
      depth: "4",
      depthUnit: "in",
      density: "100",
      allowance: "5",
      price: "45",
      priceUnit: "ton",
    });

    expect(result.volumeCubicFt).toBeCloseTo(40, 5);
    expect(result.volumeCubicYd).toBeCloseTo(1.48148, 3);
    expect(result.weightLb).toBeCloseTo(4000, 5);
    expect(result.shortTons).toBeCloseTo(2, 5);
    expect(result.orderTons).toBeCloseTo(2.1, 5);
    expect(result.orderCubicYd).toBeCloseTo(1.55556, 3);
    expect(result.estimatedCost).toBeCloseTo(94.5, 5);
  });

  it("supports zero allowance", () => {
    const result = calculateSand({
      ...defaultSandInputs(),
      allowance: "0",
    });

    expect(result.orderTons).toBeCloseTo(2, 5);
  });

  it("supports price per cubic yard", () => {
    const result = calculateSand({
      ...defaultSandInputs(),
      price: "60",
      priceUnit: "yd3",
    });

    expect(result.estimatedCost).toBeCloseTo(93.3333, 3);
  });

  it("rejects invalid values", () => {
    expect(() => calculateSand({
      ...defaultSandInputs(),
      depth: "0",
    })).toThrow();

    expect(() => calculateSand({
      ...defaultSandInputs(),
      density: "-1",
    })).toThrow();

    expect(validateSandInputs({
      ...defaultSandInputs(),
      length: "-5",
    })).toBe("Length must be greater than zero.");
  });

  it("handles metric conversions equivalently", () => {
    const imperial = calculateSand({
      ...defaultSandInputs(),
      length: "12",
      lengthUnit: "ft",
      width: "10",
      widthUnit: "ft",
      depth: "4",
      depthUnit: "in",
      density: "100",
      allowance: "0",
    });

    const metric = calculateSand({
      ...defaultSandInputs(),
      length: "3.6576",
      lengthUnit: "m",
      width: "3.048",
      widthUnit: "m",
      depth: "10.16",
      depthUnit: "cm",
      density: "100",
      allowance: "0",
    });

    expect(imperial.volumeCubicFt).toBeCloseTo(metric.volumeCubicFt, 2);
    expect(imperial.weightLb).toBeCloseTo(metric.weightLb, 2);
  });

  it("updates instant results in the UI", () => {
    render(createElement(SandCalculatorPage));
    const densityInput = screen.getByLabelText("Sand density");
    fireEvent.change(densityInput, { target: { value: "110" } });
    expect(screen.getByTestId("order-tons")).toHaveTextContent("2.31 US tons");
  });
});
