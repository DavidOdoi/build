import { fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import BrickCalculatorClient from "@/app/calculators/brick-calculator/BrickCalculatorClient";
import { calculateBrick, defaultBrickInputs, validateBrickInputs } from "@/lib/brick";

describe("brick calculator", () => {
  it("matches the documented 20 ft x 8 ft modular test case", () => {
    const result = calculateBrick({
      ...defaultBrickInputs(),
      length: "20",
      lengthUnit: "ft",
      height: "8",
      heightUnit: "ft",
      brickPreset: "us-modular",
      layers: "1",
      waste: "10",
      windowsCount: "0",
      doorsCount: "0",
      price: "0.9",
    });

    expect(result.grossAreaSqFt).toBeCloseTo(160, 5);
    expect(result.baseBricks).toBeCloseTo(1080, 5);
    expect(result.orderBricks).toBe(1188);
  });

  it("subtracts openings and rounds the order quantity up", () => {
    const result = calculateBrick({
      ...defaultBrickInputs(),
      length: "20",
      lengthUnit: "ft",
      height: "8",
      heightUnit: "ft",
      brickPreset: "us-modular",
      layers: "1",
      waste: "10",
      windowsCount: "1",
      windowWidth: "3",
      windowHeight: "7",
      doorsCount: "0",
      openingUnit: "ft",
    });

    expect(result.netAreaSqFt).toBeCloseTo(139, 5);
    expect(result.baseBricks).toBeCloseTo(938.25, 5);
    expect(result.orderBricks).toBe(1033);
  });

  it("uses the custom brick formula when custom mode is selected", () => {
    const result = calculateBrick({
      ...defaultBrickInputs(),
      brickPreset: "custom",
      brickLength: "7.625",
      brickHeight: "2.25",
      mortarJoint: "0.375",
      length: "10",
      height: "8",
      waste: "0",
      price: "0.9",
    });

    expect(result.bricksPerSquareFoot).toBeCloseTo(6.857142857, 5);
    expect(result.baseBricks).toBeCloseTo(548.57142857, 5);
  });

  it("rejects invalid values", () => {
    expect(() => calculateBrick({
      ...defaultBrickInputs(),
      height: "0",
    })).toThrow();

    expect(validateBrickInputs({
      ...defaultBrickInputs(),
      waste: "-5",
    })).toBe("Waste allowance cannot be negative.");
  });

  it("updates the result in the UI as the user changes inputs", () => {
    render(createElement(BrickCalculatorClient));
    const wasteInput = screen.getByLabelText("Waste allowance");
    fireEvent.change(wasteInput, { target: { value: "37.5" } });
    expect(screen.getByTestId("ordered-bricks")).toHaveTextContent("1,485 bricks");
  });
});
