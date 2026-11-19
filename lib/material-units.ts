export type LengthUnit = "ft" | "in" | "yd" | "m" | "cm";
export type AreaShape = "rectangle" | "circle";

export const lengthUnits: { value: LengthUnit; label: string }[] = [
  { value: "ft", label: "ft" },
  { value: "in", label: "in" },
  { value: "yd", label: "yd" },
  { value: "m", label: "m" },
  { value: "cm", label: "cm" },
];

export const parseFinite = (value: string | number | undefined): number | null => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const isLengthUnit = (unit: string): unit is LengthUnit =>
  unit === "ft" || unit === "in" || unit === "yd" || unit === "m" || unit === "cm";

export const toFeet = (value: number, unit: LengthUnit): number => {
  switch (unit) {
    case "ft": return value;
    case "in": return value / 12;
    case "yd": return value * 3;
    case "m": return value * 3.280839895013123;
    case "cm": return value / 30.48;
  }
};

export const areaInSquareFeet = (
  shape: AreaShape,
  length: number,
  lengthUnit: LengthUnit,
  width: number,
  widthUnit: LengthUnit,
): number => {
  const lengthFt = toFeet(length, lengthUnit);
  return shape === "circle"
    ? Math.PI * lengthFt ** 2
    : lengthFt * toFeet(width, widthUnit);
};

export const formatMaterialNumber = (value: number, digits = 2): string =>
  Number.isFinite(value)
    ? Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: digits,
      })
    : "—";

export const roundUpToIncrement = (quantity: number, increment: number): number =>
  increment > 0 ? Math.ceil((quantity - Number.EPSILON) / increment) * increment : quantity;
