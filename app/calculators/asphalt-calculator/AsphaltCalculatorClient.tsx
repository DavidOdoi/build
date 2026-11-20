"use client";

import { useMemo, useState } from "react";
import {
  type AreaUnit,
  type AsphaltInputs,
  type LengthUnit,
  calculateAsphalt,
  defaultAsphaltInputs,
  formatNumber,
  validateAsphaltInputs,
} from "@/lib/asphalt";
import styles from "./page.module.css";

const lengthUnits: { value: LengthUnit; label: string }[] = [
  { value: "ft", label: "ft" },
  { value: "m", label: "m" },
  { value: "yd", label: "yd" },
  { value: "in", label: "in" },
  { value: "cm", label: "cm" },
];

const areaUnits: { value: AreaUnit; label: string }[] = [
  { value: "ft2", label: "ft²" },
  { value: "m2", label: "m²" },
  { value: "yd2", label: "yd²" },
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

type MeasurementFieldProps<Unit extends string> = {
  id: string;
  label: string;
  value: string;
  unit: Unit;
  units: { value: Unit; label: string }[];
  onValueChange: (value: string) => void;
  onUnitChange: (unit: Unit) => void;
  hint?: string;
};

function MeasurementField<Unit extends string>({
  id, label, value, unit, units, onValueChange, onUnitChange, hint,
}: MeasurementFieldProps<Unit>) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputGroup}>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={value}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(event) => onValueChange(event.target.value)}
        />
        <select
          aria-label={`${label} unit`}
          value={unit}
          onChange={(event) => onUnitChange(event.target.value as Unit)}
        >
          {units.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      {hint && <small id={`${id}-hint`} className={styles.fieldHint}>{hint}</small>}
    </div>
  );
}

export default function AsphaltCalculatorClient() {
  const [form, setForm] = useState(defaultAsphaltInputs);

  const { error, result } = useMemo(() => {
    const error = validateAsphaltInputs(form);
    return { error, result: error ? null : calculateAsphalt(form) };
  }, [form]);

  const update = <Key extends keyof AsphaltInputs>(field: Key, value: AsphaltInputs[Key]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <section className={styles.calculatorCard} id="calculator" aria-labelledby="calculator-heading">
      <div className={styles.calculatorHeading}>
        <h2 id="calculator-heading">Estimate asphalt for your project</h2>
        <button
          type="button"
          className={styles.exampleButton}
          onClick={() => setForm({ ...defaultAsphaltInputs(), price: "120" })}
        >
          Load worked example
        </button>
      </div>
      <p className={styles.fieldHint}>The starting measurements, density, and allowance are examples. Replace them with your project values.</p>

      <div className={styles.modeRow} role="group" aria-label="How to enter paving area">
        <button
          type="button"
          className={form.mode === "rectangular" ? styles.modeButtonActive : styles.modeButton}
          aria-pressed={form.mode === "rectangular"}
          onClick={() => update("mode", "rectangular")}
        >
          Length × width
        </button>
        <button
          type="button"
          className={form.mode === "area" ? styles.modeButtonActive : styles.modeButton}
          aria-pressed={form.mode === "area"}
          onClick={() => update("mode", "area")}
        >
          Known area
        </button>
      </div>

      {form.mode === "rectangular" ? (
        <div className={styles.formGrid}>
          <MeasurementField
            id="asphalt-length" label="Length" value={form.length} unit={form.lengthUnit} units={lengthUnits}
            onValueChange={(value) => update("length", value)} onUnitChange={(unit) => update("lengthUnit", unit)}
          />
          <MeasurementField
            id="asphalt-width" label="Width" value={form.width} unit={form.widthUnit} units={lengthUnits}
            onValueChange={(value) => update("width", value)} onUnitChange={(unit) => update("widthUnit", unit)}
          />
        </div>
      ) : (
        <div className={styles.formGrid}>
          <MeasurementField
            id="asphalt-area" label="Known area" value={form.area} unit={form.areaUnit} units={areaUnits}
            onValueChange={(value) => update("area", value)} onUnitChange={(unit) => update("areaUnit", unit)}
            hint="Enter the total area after subtracting any sections you will not pave."
          />
        </div>
      )}

      <div className={styles.formGrid}>
        <MeasurementField
          id="asphalt-thickness" label="Compacted thickness" value={form.thickness} unit={form.thicknessUnit} units={lengthUnits}
          onValueChange={(value) => update("thickness", value)} onUnitChange={(unit) => update("thicknessUnit", unit)}
          hint="Use the finished layer thickness specified for the job."
        />
        <div className={styles.field}>
          <label htmlFor="asphalt-density">Density</label>
          <div className={styles.inputGroup}>
            <input
              id="asphalt-density" type="number" inputMode="decimal" min="0" step="any"
              value={form.density} aria-describedby="asphalt-density-hint"
              onChange={(event) => update("density", event.target.value)}
            />
            <span className={styles.unitTag}>lb/ft³</span>
          </div>
          <small id="asphalt-density-hint" className={styles.fieldHint}>Pounds per cubic foot of compacted mix. Ask your supplier for this value.</small>
        </div>
        <div className={styles.field}>
          <label htmlFor="asphalt-allowance">Order allowance</label>
          <div className={styles.inputGroup}>
            <input
              id="asphalt-allowance" type="number" inputMode="decimal" min="0" step="any"
              value={form.allowance} aria-describedby="asphalt-allowance-hint"
              onChange={(event) => update("allowance", event.target.value)}
            />
            <span className={styles.unitTag}>%</span>
          </div>
          <small id="asphalt-allowance-hint" className={styles.fieldHint}>Percentage of extra material for layout and estimating uncertainty. Use 0 to see the base quantity.</small>
        </div>
        <div className={styles.field}>
          <label htmlFor="asphalt-price">Asphalt price <span className={styles.fieldHint}>(optional)</span></label>
          <div className={styles.inputGroup}>
            <input
              id="asphalt-price" type="number" inputMode="decimal" min="0" step="any"
              value={form.price} aria-describedby="asphalt-price-hint"
              onChange={(event) => update("price", event.target.value)}
            />
            <span className={styles.unitTag}>$/US short ton</span>
          </div>
          <small id="asphalt-price-hint" className={styles.fieldHint}>Enter your material quote in US dollars per US short ton (2,000 lb).</small>
        </div>
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.resultPanel} aria-live="polite" aria-atomic="true">
        {result ? (
          <>
            <div className={styles.resultHeader}>
              <span>Estimated order, including allowance</span>
              <strong data-testid="order-tons">{formatNumber(result.orderTons)} US short tons</strong>
            </div>
            <dl className={styles.resultGrid}>
              <div className={styles.resultCard}>
                <dt>Paving area</dt>
                <dd>{formatNumber(result.areaSqFt)} ft²<small>{formatNumber(result.areaSqM)} m²</small></dd>
              </div>
              <div className={styles.resultCard}>
                <dt>Compacted volume</dt>
                <dd>{formatNumber(result.volumeCubicYd)} yd³<small>{formatNumber(result.volumeCubicFt)} ft³</small></dd>
              </div>
              <div className={styles.resultCard}>
                <dt>Base weight</dt>
                <dd>
                  {formatNumber(result.weightShortTons)} US short tons
                  <small>{formatNumber(result.orderTons - result.weightShortTons)} US short tons added as allowance</small>
                </dd>
              </div>
              <div className={styles.resultCard}>
                <dt>Estimated material cost</dt>
                <dd>
                  {result.estimatedCost === null ? "Enter a supplier quote" : currency.format(result.estimatedCost)}
                  <small>Uses unrounded order weight. Delivery, tax, and labor are extra.</small>
                </dd>
              </div>
            </dl>
          </>
        ) : <p>Enter valid project measurements to see your estimate.</p>}
      </div>
    </section>
  );
}
