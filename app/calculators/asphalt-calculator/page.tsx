'use client';

import { useMemo, useState } from "react";
import styles from "./page.module.css";
import {
  type AsphaltInputs,
  calculateAsphalt,
  defaultAsphaltInputs,
  formatNumber,
  validateAsphaltInputs,
} from "@/lib/asphalt";

const unitOptions = {
  length: [
    { value: "ft", label: "ft" },
    { value: "m", label: "m" },
    { value: "yd", label: "yd" },
    { value: "in", label: "in" },
    { value: "cm", label: "cm" },
  ],
  area: [
    { value: "ft2", label: "ft²" },
    { value: "m2", label: "m²" },
    { value: "yd2", label: "yd²" },
  ],
};

const faqs = [
  {
    question: "What thickness should I use for a driveway?",
    answer:
      "For most driveways, a compacted thickness between 2 and 4 inches is common for residential jobs, but the right value depends on vehicle load, base quality, and local standards.",
  },
  {
    question: "Does this include labor and installation?",
    answer:
      "No. This calculator estimates material quantities and material cost only. Labor, excavation, sub-base prep, and equipment are not included unless you add them separately.",
  },
  {
    question: "Why do I see a waste allowance?",
    answer:
      "A small waste allowance accounts for trimming, compaction, and edges. The default is 5%, which is a reasonable planning factor for many paving jobs.",
  },
];

export default function AsphaltCalculatorPage() {
  const [form, setForm] = useState<AsphaltInputs>(defaultAsphaltInputs());

  const validationError = useMemo(() => validateAsphaltInputs(form), [form]);
  const result = useMemo(() => {
    if (validationError) {
      return null;
    }
    return calculateAsphalt(form);
  }, [form, validationError]);

  const updateField = <K extends keyof AsphaltInputs>(field: K, value: AsphaltInputs[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brandWrap}>
          <div className={styles.logo}>B</div>
          <div className={styles.brand}>BuildCalc</div>
          <span className={styles.dot}>.</span>
        </div>
        <a href="/calculators" className={styles.headerLink}>All calculators</a>
      </header>

      <main className={styles.main}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/calculators">Calculators</a>
          <span>/</span>
          <span>Asphalt Calculator</span>
        </nav>

        <div className={styles.contentWrapper}>
          <section className={styles.hero}>
            <p className={styles.kicker}>Construction & DIY</p>
            <h1>Asphalt Calculator</h1>
            <p className={styles.intro}>
              Estimate asphalt quantity and material cost for a driveway, parking lot,
              walkway, or patching project using the area, thickness, density, and waste
              allowance that best match your job.
            </p>
          </section>

          <section className={styles.calculatorCard}>
            <div className={styles.modeRow}>
              <button
                type="button"
                className={form.mode === "rectangular" ? styles.modeButtonActive : styles.modeButton}
                onClick={() => updateField("mode", "rectangular")}
              >
                Rectangular dimensions
              </button>
              <button
                type="button"
                className={form.mode === "area" ? styles.modeButtonActive : styles.modeButton}
                onClick={() => updateField("mode", "area")}
              >
                Total known area
              </button>
            </div>

            {form.mode === "rectangular" ? (
              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Length</span>
                  <div className={styles.inputGroup}>
                    <input
                      aria-label="Length"
                      name="length"
                      type="number"
                      min="0"
                      step="any"
                      value={form.length}
                      onChange={(e) => updateField("length", e.target.value)}
                    />
                    <select
                      aria-label="Length unit"
                      value={form.lengthUnit}
                      onChange={(e) => updateField("lengthUnit", e.target.value as AsphaltInputs["lengthUnit"])}
                    >
                      {unitOptions.length.map((unit) => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </label>

                <label className={styles.field}>
                  <span>Width</span>
                  <div className={styles.inputGroup}>
                    <input
                      aria-label="Width"
                      name="width"
                      type="number"
                      min="0"
                      step="any"
                      value={form.width}
                      onChange={(e) => updateField("width", e.target.value)}
                    />
                    <select
                      aria-label="Width unit"
                      value={form.widthUnit}
                      onChange={(e) => updateField("widthUnit", e.target.value as AsphaltInputs["widthUnit"])}
                    >
                      {unitOptions.length.map((unit) => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>
            ) : (
              <div className={styles.formGridSingle}>
                <label className={styles.field}>
                  <span>Known area</span>
                  <div className={styles.inputGroup}>
                    <input
                      aria-label="Known area"
                      name="area"
                      type="number"
                      min="0"
                      step="any"
                      value={form.area}
                      onChange={(e) => updateField("area", e.target.value)}
                    />
                    <select
                      aria-label="Area unit"
                      value={form.areaUnit}
                      onChange={(e) => updateField("areaUnit", e.target.value as AsphaltInputs["areaUnit"])}
                    >
                      {unitOptions.area.map((unit) => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>
            )}

            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>Thickness</span>
                <div className={styles.inputGroup}>
                  <input
                    aria-label="Thickness"
                    name="thickness"
                    type="number"
                    min="0"
                    step="any"
                    value={form.thickness}
                    onChange={(e) => updateField("thickness", e.target.value)}
                  />
                  <select
                    aria-label="Thickness unit"
                    value={form.thicknessUnit}
                    onChange={(e) => updateField("thicknessUnit", e.target.value as AsphaltInputs["thicknessUnit"])}
                  >
                    {unitOptions.length.map((unit) => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                    ))}
                  </select>
                </div>
              </label>

              <label className={styles.field}>
                <span>Density</span>
                <div className={styles.inputGroup}>
                  <input
                    aria-label="Density"
                    name="density"
                    type="number"
                    min="0"
                    step="any"
                    value={form.density}
                    onChange={(e) => updateField("density", e.target.value)}
                  />
                  <span className={styles.unitTag}>lb/ft³</span>
                </div>
              </label>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>Waste allowance</span>
                <div className={styles.inputGroup}>
                  <input
                    aria-label="Waste allowance"
                    name="allowance"
                    type="number"
                    min="0"
                    step="any"
                    value={form.allowance}
                    onChange={(e) => updateField("allowance", e.target.value)}
                  />
                  <span className={styles.unitTag}>%</span>
                </div>
              </label>

              <label className={styles.field}>
                <span>Asphalt price</span>
                <div className={styles.inputGroup}>
                  <input
                    aria-label="Asphalt price"
                    name="price"
                    type="number"
                    min="0"
                    step="any"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                  />
                  <span className={styles.unitTag}>$/ton</span>
                </div>
              </label>
            </div>

            {validationError ? (
              <p className={styles.error} role="alert">{validationError}</p>
            ) : null}

            {result ? (
              <div className={styles.resultPanel}>
                <div className={styles.resultHeader}>
                  <span>Estimated asphalt required</span>
                  <strong data-testid="order-tons">{formatNumber(result.orderTons, 2)} tons</strong>
                </div>

                <div className={styles.resultGrid}>
                  <div className={styles.resultCard}>
                    <span>Total area</span>
                    <strong>{formatNumber(result.areaSqFt, 2)} ft²</strong>
                    <small>{formatNumber(result.areaSqM, 2)} m²</small>
                  </div>
                  <div className={styles.resultCard}>
                    <span>Volume</span>
                    <strong>{formatNumber(result.volumeCubicYd, 2)} yd³</strong>
                    <small>{formatNumber(result.volumeCubicFt, 2)} ft³</small>
                  </div>
                  <div className={styles.resultCard}>
                    <span>Weight</span>
                    <strong>{formatNumber(result.weightShortTons, 2)} tons</strong>
                    <small>{formatNumber(result.weightLb, 2)} lb</small>
                  </div>
                  <div className={styles.resultCard}>
                    <span>Material cost</span>
                    <strong>${formatNumber(result.estimatedCost, 2)}</strong>
                    <small>{formatNumber(result.orderTons, 2)} tons incl. allowance</small>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <section className={styles.contentSection}>
            <h2>How to calculate asphalt tonnage</h2>
            <p>
              Asphalt quantity is based on the area you need to cover, the compacted pavement
              thickness, and the density of the mix. The general relationship is simple: area ×
              thickness × density gives the total weight of asphalt. From there, a small waste
              allowance is added to account for trims, edges, and compaction.
            </p>
            <p>
              The formulas behind this calculator follow the standard planning approach used by
              contractors and estimators in the U.S. We convert the project dimensions to square
              feet, convert the thickness to feet, then compute cubic feet and cubic yards before
              converting to weight and tons.
            </p>

            <div className={styles.mathBox}>
              <p>Area (ft²) = Length × Width</p>
              <p>Volume (ft³) = Area × Thickness</p>
              <p>Volume (yd³) = Volume ÷ 27</p>
              <p>Weight (lb) = Volume × Density</p>
              <p>Short tons = Weight ÷ 2,000</p>
            </div>

            <h3>Worked example</h3>
            <p>
              For a 20 ft × 10 ft asphalt driveway at 3 inches thick with a density of 145 lb/ft³,
              the area is 200 ft². The thickness is 0.25 ft, giving a volume of 50 ft³. That is
              1.85 yd³. The weight works out to 7,250 lb, or 3.625 short tons. With a 5% allowance,
              the order amount becomes 3.81 tons, which at $120 per ton is about $456.75 in material.
            </p>

            <h3>What is an asphalt calculator?</h3>
            <p>
              An asphalt calculator is a quick planning tool that helps you estimate how much hot mix
              asphalt you need before ordering. It is especially useful for driveways, parking areas,
              and patch jobs, where knowing the tonnage early helps avoid over-ordering or a mid-project
              shortage.
            </p>

            <h3>Asphalt material cost vs. installation cost</h3>
            <p>
              Material cost is only one part of the total paving budget. Installation costs often include
              grading, sub-base preparation, compaction, equipment, and labor, which are separate from
              asphalt tonnage calculations. This estimate should be treated as a material planning number,
              not a full installation quote.
            </p>

            <h3>Common mistakes to avoid</h3>
            <ul>
              <li>Using the wrong thickness when the value should represent compacted depth.</li>
              <li>Forgetting to include a waste allowance for edges and trimming.</li>
              <li>Mixing up US short tons and metric tonnes.</li>
              <li>Assuming all asphalt has the same density; mix design and compaction can change it.</li>
            </ul>

            <h2>Frequently asked questions</h2>
            <div className={styles.faqList}>
              {faqs.map((faq) => (
                <div key={faq.question} className={styles.faqItem}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>

            <h2>Related calculators</h2>
            <div className={styles.relatedGrid}>
              <a href="/calculators/sand-calculator">Sand Calculator</a>
              <a href="/calculators">All Calculators</a>
              <a href="/">BuildCalc Home</a>
              <a href="/categories">Categories</a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
