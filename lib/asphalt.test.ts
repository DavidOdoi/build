import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import AsphaltCalculatorPage from "@/app/calculators/asphalt-calculator/page";
import { calculateAsphalt, defaultAsphaltInputs, validateAsphaltInputs } from "@/lib/asphalt";

describe("asphalt calculator logic", () => {
  it("calculates the standard asphalt estimate", () => {
    const result = calculateAsphalt({
      ...defaultAsphaltInputs(),
      length: "20",
      width: "10",
      thickness: "3",
      thicknessUnit: "in",
      density: "145",
      allowance: "5",
      price: "120",
    });

    expect(result.areaSqFt).toBeCloseTo(200, 5);
    expect(result.volumeCubicFt).toBeCloseTo(50, 5);
    expect(result.volumeCubicYd).toBeCloseTo(1.85185, 3);
    expect(result.weightLb).toBeCloseTo(7250, 5);
    expect(result.weightShortTons).toBeCloseTo(3.625, 5);
    expect(result.orderTons).toBeCloseTo(3.80625, 5);
    expect(result.estimatedCost).toBeCloseTo(456.75, 5);
  });

  it("handles zero allowance correctly", () => {
    const result = calculateAsphalt({
      ...defaultAsphaltInputs(),
      allowance: "0",
    });

    expect(result.orderTons).toBeCloseTo(3.625, 5);
  });

  it("updates weight when density changes", () => {
    const result = calculateAsphalt({
      ...defaultAsphaltInputs(),
      density: "150",
    });

    expect(result.weightLb).toBeCloseTo(7500, 5);
  });

  it("rejects invalid inputs", () => {
    expect(() =>
      calculateAsphalt({
        ...defaultAsphaltInputs(),
        thickness: "0",
      }),
    ).toThrow();

    expect(() =>
      calculateAsphalt({
        ...defaultAsphaltInputs(),
        density: "-10",
      }),
    ).toThrow();

    expect(validateAsphaltInputs({
      ...defaultAsphaltInputs(),
      mode: "area",
      area: "0",
    })).toBe("Known area must be greater than zero.");
  });

  it("confirms equivalent metric and imperial inputs return the same values", () => {
    const imperial = calculateAsphalt({
      ...defaultAsphaltInputs(),
      length: "20",
      width: "10",
      thickness: "3",
      lengthUnit: "ft",
      widthUnit: "ft",
      thicknessUnit: "in",
    });

    const metric = calculateAsphalt({
      ...defaultAsphaltInputs(),
      length: "6.096",
      width: "3.048",
      thickness: "7.62",
      lengthUnit: "m",
      widthUnit: "m",
      thicknessUnit: "cm",
    });

    expect(imperial.areaSqFt).toBeCloseTo(metric.areaSqFt, 2);
    expect(imperial.volumeCubicYd).toBeCloseTo(metric.volumeCubicYd, 2);
    expect(imperial.weightLb).toBeCloseTo(metric.weightLb, 2);
  });

  it("updates the visible result when inputs change", () => {
    render(createElement(AsphaltCalculatorPage));

    const densityInput = screen.getByLabelText("Density");
    fireEvent.change(densityInput, { target: { value: "150" } });

    expect(screen.getByTestId("order-tons")).toHaveTextContent("3.94 tons");
  });
});
