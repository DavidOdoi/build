'use client';

import { useMemo, useState } from "react";
import styles from "./page.module.css";
import { calculateSand, defaultSandInputs, formatNumber, type SandInputs, validateSandInputs } from "@/lib/sand";

const faqItems = [
  {
    question: "How many tons of sand are in a cubic yard?",
    answer:
      "At a dry bulk density of about 100 lb/ft³, one cubic yard weighs approximately 2,700 lb, or 1.35 US short tons. The actual weight varies with moisture content and sand type, so verify the supplier's density before ordering.",
  },
  {
    question: "How much sand do I need for 100 square feet?",
    answer:
      "At a depth of 2 inches, a 100-square-foot area requires about 16.67 ft³, or roughly 0.62 cubic yards, before any waste allowance. A 5% to 10% allowance is often reasonable for landscaping and patio-base work.",
  },
  {
    question: "Can I use this calculator for wet sand?",
    answer:
      "Yes. Enter the wet bulk density supplied by the supplier, because moist or compacted sand can weigh noticeably more than dry sand. Using the wrong density changes both the estimated tonnage and the cost.",
  },
];

const lengthOptions = [
  { value: "ft", label: "ft" },
  { value: "m", label: "m" },
  { value: "yd", label: "yd" },
  { value: "in", label: "in" },
  { value: "cm", label: "cm" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildCalc Sand Calculator",
  url: "https://buildcalc.com/calculators/sand-calculator",
  description:
    "Free sand calculator for estimating cubic yards, tons, weight, and cost for landscaping, patio bases, and construction projects.",
  applicationCategory: "ConstructionCalculator",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const breadcrumbData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://buildcalc.com/" },
    { "@type": "ListItem", position: 2, name: "Calculators", item: "https://buildcalc.com/calculators" },
    { "@type": "ListItem", position: 3, name: "Sand Calculator", item: "https://buildcalc.com/calculators/sand-calculator" },
  ],
};

export default function SandCalculatorClient() {
  const [form, setForm] = useState<SandInputs>(defaultSandInputs());

  const validationError = useMemo(() => validateSandInputs(form), [form]);
  const result = useMemo(() => {
    if (validationError) return null;
    return calculateSand(form);
  }, [form, validationError]);

  const updateField = <K extends keyof SandInputs>(field: K, value: SandInputs[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

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
          <span>Sand Calculator</span>
        </nav>

        <section className={styles.hero}>
          <p className={styles.kicker}>Construction & DIY</p>
          <h1>Sand Calculator</h1>
          <p className={styles.intro}>
            Estimate how much sand you need for a patio, paving base, sandbox, grading job,
            or landscaping project using the footprint, depth, density, and allowance that match the job.
          </p>
        </section>

        <section className={styles.calculatorCard}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Length</span>
              <div className={styles.inputGroup}>
                <input aria-label="Length" type="number" min="0" step="any" value={form.length} onChange={(e) => updateField("length", e.target.value)} />
                <select aria-label="Length unit" value={form.lengthUnit} onChange={(e) => updateField("lengthUnit", e.target.value as SandInputs["lengthUnit"])}>
                  {lengthOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </label>

            <label className={styles.field}>
              <span>Width</span>
              <div className={styles.inputGroup}>
                <input aria-label="Width" type="number" min="0" step="any" value={form.width} onChange={(e) => updateField("width", e.target.value)} />
                <select aria-label="Width unit" value={form.widthUnit} onChange={(e) => updateField("widthUnit", e.target.value as SandInputs["widthUnit"])}>
                  {lengthOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Depth</span>
              <div className={styles.inputGroup}>
                <input aria-label="Depth" type="number" min="0" step="any" value={form.depth} onChange={(e) => updateField("depth", e.target.value)} />
                <select aria-label="Depth unit" value={form.depthUnit} onChange={(e) => updateField("depthUnit", e.target.value as SandInputs["depthUnit"])}>
                  {lengthOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </label>

            <label className={styles.field}>
              <span>Sand density</span>
              <div className={styles.inputGroup}>
                <input aria-label="Sand density" type="number" min="0" step="any" value={form.density} onChange={(e) => updateField("density", e.target.value)} />
                <span className={styles.unitTag}>lb/ft³</span>
              </div>
            </label>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Waste allowance</span>
              <div className={styles.inputGroup}>
                <input aria-label="Waste allowance" type="number" min="0" step="any" value={form.allowance} onChange={(e) => updateField("allowance", e.target.value)} />
                <span className={styles.unitTag}>%</span>
              </div>
            </label>

            <label className={styles.field}>
              <span>Sand price</span>
              <div className={styles.inputGroup}>
                <input aria-label="Sand price" type="number" min="0" step="any" value={form.price} onChange={(e) => updateField("price", e.target.value)} />
                <select aria-label="Price unit" value={form.priceUnit} onChange={(e) => updateField("priceUnit", e.target.value as SandInputs["priceUnit"])}>
                  <option value="ton">$/ton</option>
                  <option value="yd3">$/yd³</option>
                </select>
              </div>
            </label>
          </div>

          {validationError ? <p className={styles.error} role="alert">{validationError}</p> : null}

          {result ? (
            <div className={styles.resultPanel}>
              <div className={styles.resultHeader}>
                <span>Estimated sand required</span>
                <strong data-testid="order-tons">{formatNumber(result.orderTons, 2)} US tons</strong>
              </div>

              <div className={styles.resultGrid}>
                <div className={styles.resultCard}>
                  <span>Volume</span>
                  <strong>{formatNumber(result.volumeCubicYd, 2)} yd³</strong>
                  <small>{formatNumber(result.volumeCubicFt, 2)} ft³</small>
                </div>
                <div className={styles.resultCard}>
                  <span>Weight</span>
                  <strong>{formatNumber(result.shortTons, 2)} US tons</strong>
                  <small>{formatNumber(result.weightLb, 2)} lb</small>
                </div>
                <div className={styles.resultCard}>
                  <span>Metric</span>
                  <strong>{formatNumber(result.metricTonnes, 2)} t</strong>
                  <small>{formatNumber(result.volumeCubicM, 2)} m³</small>
                </div>
                <div className={styles.resultCard}>
                  <span>Cost</span>
                  <strong>${formatNumber(result.estimatedCost, 2)}</strong>
                  <small>{formatNumber(result.orderCubicYd, 2)} yd³ incl. allowance</small>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className={styles.contentSection}>
          <h2>How to calculate sand volume</h2>
          <p>
            The most reliable way to estimate sand is to start with the exact footprint and depth of the area you want to fill. For a rectangular base, the formula is straightforward: length × width × depth. Before you compare pounds, cubic yards, or metric tonnes, make sure all measurements are converted to the same unit, because mixing inches, feet, and meters will create a wrong result even when the geometry is correct.
          </p>
          <p>
            After volume is known, the next step is converting that volume into weight using a realistic sand bulk density. Sand density is not constant. Damp, compacted, or fine-grained sand typically measures more than dry, loose material, and a small error in density can skew the tonnage by a meaningful amount. That is why BuildCalc includes an editable density field rather than a single fixed assumption. When you are planning a patio base, paver bed, or landscaping fill, the allowance percentage should reflect real-world trimming and compaction so you order enough without overspending.
          </p>

          <div className={styles.mathBox}>
            <p>Volume (ft³) = Length × Width × Depth</p>
            <p>Volume (yd³) = Volume ÷ 27</p>
            <p>Weight (lb) = Volume × Density</p>
            <p>US short tons = Weight ÷ 2,000</p>
            <p>Metric tonnes = Weight × 0.00045359237</p>
          </div>

          <h3>Why US short tons and metric tonnes are different</h3>
          <p>
            This calculator clearly separates US short tons from metric tonnes because they are not interchangeable. One US short ton equals 2,000 lb, while one metric tonne equals 1,000 kg, or about 2,204.62 lb. In other words, a 2-ton estimate is 2 short tons, not 2 metric tonnes. This matters most when comparing supplier quotes, ordering from an international source, or translating a material quantity into an export or transport metric. The calculator shows both outputs so you can cross-check the job with the same measurements in different systems.
          </p>

          <h3>Sand calculation example</h3>
          <p>
            A 12 ft × 10 ft patio pad with a 4-inch sand depth and a density of 100 lb/ft³ gives a volume of 40 ft³, which is about 1.48 yd³. Multiplying by 100 lb/ft³ produces 4,000 lb of sand, which is 2.0 US short tons. Add a 5% waste allowance and the order equals roughly 2.10 US short tons, or about 1.56 yd³. If the price is $45 per US ton, the estimated material cost is $94.50. The same volume would weigh about 1.81 metric tonnes if converted, but that is a different unit from the US short ton figure and should not be confused with the estimate in tons.
          </p>

          <h3>How much does a cubic yard of sand weigh?</h3>
          <p>
            Cubic yard weight depends on the specific material, its moisture state, and whether it is loose or compacted. Typical dry sand falls somewhere around 90 to 110 lb/ft³, while wetter or more densely packed material can be higher. For a project estimate, that means the bulk density value matters just as much as the calculated volume. Always check with your supplier if the sand will be delivered wet, screened, or used as a sub-base rather than a loose fill. See the <a href="https://www.epa.gov/sites/default/files/2016-03/documents/conversions.pdf" target="_blank" rel="noreferrer">EPA conversion guide</a>, the <a href="https://www.fhwa.dot.gov/engineering/geotech/pubs/05037/05a.cfm" target="_blank" rel="noreferrer">FHWA geotechnical reference</a>, and the <a href="https://www.usgs.gov/centers/national-minerals-information-center/construction-sand-and-gravel-statistics-and" target="_blank" rel="noreferrer">USGS construction sand and gravel data</a> for defensible unit and material references.
          </p>

          <h3>How much sand do you need for a patio or paver base?</h3>
          <p>
            Patio and paver projects often use a thin bed of sand beneath the stone or pavers, but the actual thickness varies by system design and manufacturer instructions. A 200-square-foot patio with a 1-inch bed uses 16.67 ft³, or roughly 0.62 yd³, before waste allowance. Using a 5% or 10% adjustment covers edge loss, compaction, and placement variation. The calculator makes it easy to test multiple density assumptions and see how a higher moisture level changes the final tonnage and cost, which is useful during budget planning and material ordering.
          </p>

          <h3>Common mistakes when estimating sand</h3>
          <ul>
            <li>Calculating volume with mixed units, such as using inches for depth and feet for length without converting first.</li>
            <li>Forgetting that sand density changes with water content and compaction.</li>
            <li>Mixing up US tons and metric tonnes when comparing supplier estimates.</li>
            <li>Ignoring waste allowance when the base will be trimmed, leveled, or compacted.</li>
          </ul>

          <h2>Frequently asked questions</h2>
          <div className={styles.faqList}>
            {faqItems.map((faq) => (
              <div key={faq.question} className={styles.faqItem}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>

          <h2>Related calculators</h2>
          <div className={styles.relatedGrid}>
            <a href="/calculators/asphalt-calculator">Asphalt Calculator</a>
            <a href="/calculators">All Calculators</a>
            <a href="/">BuildCalc Home</a>
            <a href="/categories">Categories</a>
          </div>
        </section>
      </main>
    </div>
  );
}
