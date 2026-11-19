import { fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import FillDirtCalculatorClient from "@/app/calculators/fill-dirt-calculator/FillDirtCalculatorClient";
import { calculateFillDirt, defaultFillDirtInputs, validateFillDirtInputs } from "./fill-dirt";

describe("fill dirt calculator", () => {
  it("calculates the standard volume, allowance, weight, and cubic-yard cost", () => {
    const result = calculateFillDirt({
      ...defaultFillDirtInputs(),
      length: "30",
      width: "12",
      depth: "6",
      density: "90",
      allowance: "10",
      price: "30",
      priceUnit: "yd3",
    });
    expect(result.areaSqFt).toBeCloseTo(360);
    expect(result.targetVolumeCubicFt).toBeCloseTo(180);
    expect(result.targetVolumeCubicYd).toBeCloseTo(6.66666667, 7);
    expect(result.orderVolumeCubicYd).toBeCloseTo(7.33333333, 7);
    expect(result.orderWeightLb).toBeCloseTo(17820);
    expect(result.orderShortTons).toBeCloseTo(8.91);
    expect(result.estimatedCost).toBeCloseTo(220);
  });

  it("does not add order allowance when set to zero", () => {
    const result = calculateFillDirt({ ...defaultFillDirtInputs(), allowance: "0" });
    expect(result.orderVolumeCubicYd).toBeCloseTo(result.targetVolumeCubicYd);
  });

  it("applies a separately enabled loose-volume adjustment", () => {
    const result = calculateFillDirt({
      ...defaultFillDirtInputs(),
      allowance: "0",
      compactionEnabled: true,
      compactionAdjustment: "20",
    });
    expect(result.targetVolumeCubicFt).toBeCloseTo(180);
    expect(result.looseVolumeBeforeAllowanceCubicYd).toBeCloseTo(8);
    expect(result.orderVolumeCubicYd).toBeCloseTo(8);
  });

  it("calculates weight-based costs", () => {
    const result = calculateFillDirt({
      ...defaultFillDirtInputs(),
      allowance: "0",
      price: "25",
      priceUnit: "ton",
    });
    expect(result.orderShortTons).toBeCloseTo(8.1);
    expect(result.estimatedCost).toBeCloseTo(202.5);
  });

  it("converts metric dimensions and rounds supplier increments up before pricing", () => {
    const imperial = calculateFillDirt({ ...defaultFillDirtInputs(), allowance: "0" });
    const metric = calculateFillDirt({
      ...defaultFillDirtInputs(),
      length: "9.144",
      lengthUnit: "m",
      width: "3.6576",
      widthUnit: "m",
      depth: "15.24",
      depthUnit: "cm",
      allowance: "0",
    });
    expect(metric.targetVolumeCubicFt).toBeCloseTo(imperial.targetVolumeCubicFt, 6);

    const rounded = calculateFillDirt({
      ...defaultFillDirtInputs(),
      price: "30",
      priceUnit: "yd3",
      orderIncrement: "0.5",
    });
    expect(rounded.orderVolumeCubicYd).toBeCloseTo(7.5);
    expect(rounded.estimatedCost).toBeCloseTo(225);
  });

  it("rejects invalid measurements, density, price, and units", () => {
    const defaults = defaultFillDirtInputs();
    expect(validateFillDirtInputs({ ...defaults, width: "-1" })).not.toBeNull();
    expect(validateFillDirtInputs({ ...defaults, depth: "0" })).not.toBeNull();
    expect(validateFillDirtInputs({ ...defaults, density: "Infinity" })).not.toBeNull();
    expect(validateFillDirtInputs({ ...defaults, price: "-1" })).not.toBeNull();
    expect(validateFillDirtInputs({ ...defaults, lengthUnit: "parsec" as never })).not.toBeNull();
    expect(validateFillDirtInputs({ ...defaults, compactionEnabled: true, compactionAdjustment: "-1" })).not.toBeNull();
  });

  it("enables the optional compaction input and updates the order estimate", () => {
    render(createElement(FillDirtCalculatorClient));
    const compaction = screen.getByLabelText("Compaction adjustment");
    expect(compaction).toBeDisabled();
    fireEvent.click(screen.getByRole("checkbox", { name: "Enable compaction adjustment" }));
    expect(compaction).toBeEnabled();
    fireEvent.change(screen.getByLabelText("Order allowance"), { target: { value: "0" } });
    fireEvent.change(compaction, { target: { value: "20" } });
    expect(screen.getByTestId("fill-order-yard")).toHaveTextContent("8 yd³");
  });
});
