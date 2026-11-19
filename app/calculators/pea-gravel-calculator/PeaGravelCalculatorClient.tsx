"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../material-calculator.module.css";
import { calculatePeaGravel, defaultPeaGravelInputs, validatePeaGravelInputs, type PeaGravelInputs } from "@/lib/pea-gravel";
import { formatMaterialNumber, lengthUnits } from "@/lib/material-units";

const description = "Estimate pea gravel volume, weight, coverage, and material cost for landscaping projects.";
const faqItems = [
  {
    question: "How much pea gravel do I need for 100 square feet?",
    answer: "At 3 inches deep, 100 ft² takes 25 ft³, or about 0.93 yd³ before allowance. At 2 inches deep it takes about 0.62 yd³. Measure the actual depth and add an allowance only after calculating the base volume.",
  },
  {
    question: "How many cubic yards of pea gravel are in a ton?",
    answer: "There is no fixed conversion because bulk density and moisture vary. With the calculator's illustrative 100 lb/ft³ assumption, one cubic yard weighs 2,700 lb, or 1.35 US short tons; confirm the product's delivered density with the supplier.",
  },
  {
    question: "How much extra pea gravel should I order?",
    answer: "The default 10% is a planning allowance, not a rule. The right amount depends on uneven ground, edge losses, settling, and the supplier's minimum order or delivery increment. Use a smaller allowance for a well-measured level bed and verify order rounding.",
  },
];

const webApplicationData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildCalc Pea Gravel Calculator",
  url: "https://buildcalc.com/calculators/pea-gravel-calculator",
  description,
  applicationCategory: "ConstructionCalculator",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};
const breadcrumbData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://buildcalc.com/" },
    { "@type": "ListItem", position: 2, name: "Calculators", item: "https://buildcalc.com/calculators" },
    { "@type": "ListItem", position: 3, name: "Pea Gravel Calculator", item: "https://buildcalc.com/calculators/pea-gravel-calculator" },
  ],
};

export default function PeaGravelCalculatorClient() {
  const [form, setForm] = useState<PeaGravelInputs>(defaultPeaGravelInputs);
  const error = useMemo(() => validatePeaGravelInputs(form), [form]);
  const result = useMemo(() => error ? null : calculatePeaGravel(form), [error, form]);
  const update = <K extends keyof PeaGravelInputs>(field: K, value: PeaGravelInputs[K]) =>
    setForm((current) => ({ ...current, [field]: value }));

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <header className={styles.topbar}>
        <div className={styles.brandWrap}><div className={styles.logo}>B</div><div className={styles.brand}>BuildCalc</div><span className={styles.dot}>.</span></div>
        <a href="/calculators" className={styles.headerLink}>All calculators</a>
      </header>
      <main className={styles.main}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><a href="/calculators">Calculators</a><span>/</span><span>Pea Gravel Calculator</span></nav>
        <section className={styles.hero}>
          <p className={styles.kicker}>Landscaping & aggregates</p>
          <h1>Pea Gravel Calculator</h1>
          <p className={styles.intro}>
            This pea gravel calculator estimates the material volume, weight, and optional cost for a walkway, garden path, patio, or decorative area. Enter the footprint and finished depth, then adjust the bulk-density assumption and order allowance to match supplier information. Results show the calculated amount before allowance and the larger amount to plan for ordering, so you can compare cubic yards with weight-based quotes.
          </p>
        </section>

        <section className={styles.calculatorCard} aria-label="Pea gravel calculator">
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Area shape</span><select className={styles.shapeSelect} aria-label="Area shape" value={form.shape} onChange={(event) => update("shape", event.target.value as PeaGravelInputs["shape"])}><option value="rectangle">Rectangle</option><option value="circle">Circle</option></select></label>
            <label className={styles.field}><span>{form.shape === "circle" ? "Radius" : "Length"}</span><div className={styles.inputGroup}><input aria-label={form.shape === "circle" ? "Radius" : "Length"} type="number" min="0" step="any" value={form.length} onChange={(event) => update("length", event.target.value)} /><select aria-label="Length unit" value={form.lengthUnit} onChange={(event) => update("lengthUnit", event.target.value as PeaGravelInputs["lengthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
          </div>
          {form.shape === "rectangle" ? <div className={styles.formGrid}><label className={styles.field}><span>Width</span><div className={styles.inputGroup}><input aria-label="Width" type="number" min="0" step="any" value={form.width} onChange={(event) => update("width", event.target.value)} /><select aria-label="Width unit" value={form.widthUnit} onChange={(event) => update("widthUnit", event.target.value as PeaGravelInputs["widthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label><div className={styles.note}>For a circle, enter the radius above; the calculator uses π × radius².</div></div> : null}
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Gravel depth</span><div className={styles.inputGroup}><input aria-label="Gravel depth" type="number" min="0" step="any" value={form.depth} onChange={(event) => update("depth", event.target.value)} /><select aria-label="Depth unit" value={form.depthUnit} onChange={(event) => update("depthUnit", event.target.value as PeaGravelInputs["depthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
            <div className={styles.note}>Measure the intended installed depth. A supplier can advise on a suitable depth for the stone size and project.</div>
          </div>
          <details className={styles.details}>
            <summary>Advanced options: density, allowance, pricing & bags</summary>
            <div className={styles.detailsContent}>
              <div className={styles.formGrid}>
                <label className={styles.field}><span>Bulk density (illustrative assumption)</span><div className={styles.inputGroup}><input aria-label="Bulk density" type="number" min="0" step="any" value={form.density} onChange={(event) => update("density", event.target.value)} /><span className={styles.unitTag}>lb/ft³</span></div><small className={styles.fieldHint}>Default 100 lb/ft³ is editable and not a universal material specification. Ask your supplier for the product&apos;s loose bulk density.</small></label>
                <label className={styles.field}><span>Waste / order allowance</span><div className={styles.inputGroup}><input aria-label="Waste allowance" type="number" min="0" step="any" value={form.allowance} onChange={(event) => update("allowance", event.target.value)} /><span className={styles.unitTag}>%</span></div></label>
              </div>
              <div className={styles.formGrid}>
                <label className={styles.field}><span>Supplier price (optional)</span><div className={styles.inputGroup}><input aria-label="Supplier price" type="number" min="0" step="any" placeholder="Enter quote" value={form.price} onChange={(event) => update("price", event.target.value)} /><select aria-label="Price unit" value={form.priceUnit} onChange={(event) => update("priceUnit", event.target.value as PeaGravelInputs["priceUnit"])}><option value="ton">per US short ton</option><option value="yd3">per cubic yard</option></select></div></label>
                <label className={styles.field}><span>Bag volume (optional)</span><div className={styles.inputGroup}><input aria-label="Bag volume" type="number" min="0" step="any" placeholder="e.g. 0.5" value={form.bagVolume} onChange={(event) => update("bagVolume", event.target.value)} /><span className={styles.unitTag}>ft³ / bag</span></div><small className={styles.fieldHint}>Use labeled volume, not bag weight, for a bag-count estimate.</small></label>
              </div>
              <div className={styles.formGrid}>
                <label className={styles.field}><span>Bag price (optional)</span><div className={styles.inputGroup}><input aria-label="Bag price" type="number" min="0" step="any" placeholder="Enter bag quote" value={form.bagPrice} onChange={(event) => update("bagPrice", event.target.value)} /><span className={styles.unitTag}>$/bag</span></div></label>
              </div>
            </div>
          </details>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {result ? <div className={styles.resultPanel} aria-live="polite">
            <div className={styles.resultHeader}><span>Estimated pea gravel to order</span><strong data-testid="pea-order-yard">{formatMaterialNumber(result.orderVolumeCubicYd, 3)} yd³</strong></div>
            <div className={styles.resultGrid}>
              <div className={styles.resultCard}><span>Area</span><strong>{formatMaterialNumber(result.areaSqFt)} ft²</strong><small>Calculated footprint</small></div>
              <div className={styles.resultCard}><span>Base volume</span><strong>{formatMaterialNumber(result.baseVolumeCubicYd, 3)} yd³</strong><small>{formatMaterialNumber(result.baseVolumeCubicFt)} ft³ before allowance</small></div>
              <div className={styles.resultCard}><span>Weight before allowance</span><strong>{formatMaterialNumber(result.baseShortTons, 3)} US short tons</strong><small>{formatMaterialNumber(result.baseMetricTonnes, 3)} metric tonnes</small></div>
              <div className={styles.resultCard}><span>Order weight</span><strong>{formatMaterialNumber(result.orderShortTons, 3)} US short tons</strong><small>{formatMaterialNumber(result.orderMetricTonnes, 3)} metric tonnes · {formatMaterialNumber(result.orderWeightLb)} lb</small></div>
              <div className={styles.resultCard}><span>Metric volume</span><strong>{formatMaterialNumber(result.baseVolumeCubicM, 3)} m³ base</strong><small>{formatMaterialNumber(result.orderVolumeCubicYd * 0.764554857984, 3)} m³ to order</small></div>
              <div className={styles.resultCard}><span>Allowance</span><strong>{formatMaterialNumber(result.allowanceQuantityCubicYd, 3)} yd³ extra</strong><small>{form.allowance}% above base volume</small></div>
              <div className={styles.resultCard}><span>Material cost</span><strong>{result.estimatedCost === null ? "Add a quote" : `$${formatMaterialNumber(result.estimatedCost, 2)}`}</strong><small>{form.priceUnit === "ton" ? "Quote basis: US short tons" : "Quote basis: cubic yards"}; delivery and labor excluded</small></div>
              {result.bagCount !== null ? <div className={styles.resultCard}><span>Approximate bags</span><strong>{formatMaterialNumber(result.bagCount, 0)}</strong><small>At {form.bagVolume} ft³ per bag{result.bagCost === null ? "" : ` · $${formatMaterialNumber(result.bagCost, 2)} bag cost`}</small></div> : null}
            </div>
            <p className={styles.note}>Weight uses the entered {form.density} lb/ft³ loose bulk-density assumption. Actual weight varies with particle grading, packing, and moisture; particle density is not loose bulk density. “US short tons” means 2,000 lb per ton.</p>
          </div> : null}
        </section>

        <article className={styles.contentSection}>
          <h2>How to Use Our Pea Gravel Calculator</h2>
          <p>Choose a rectangle and measure length and width, or choose circle and enter its radius. Dimensions can use feet, inches, yards, meters, or centimeters. Enter the intended installed depth in the unit you measured.</p>
          <p>Advanced options include editable loose bulk density, order allowance, optional price and quote unit, plus bag volume and price. Enter a bag&apos;s labeled volume and quote per bag for a separate bag count and cost. The default 100 lb/ft³ is illustrative, not universal. Grading, packing, and moisture affect weight, so use supplier data when available. Per-short-ton quotes use order weight; per-yard quotes use volume. Delivery and labor are excluded.</p>

          <h2>How Much Pea Gravel Do I Need?</h2>
          <p>Quantity depends on footprint and depth: a 100 ft² area needs twice as much at 4 inches as at 2 inches. Rectangles use length × width; circles use π × radius², so entering diameter as radius overstates area fourfold. Divide irregular beds into simple shapes and add their volumes.</p>
          <p>This 100 ft² rectangle table shows volume before allowance or site adjustment. Depths are examples, not recommendations.</p>
          <div className={styles.tableWrap}><table><thead><tr><th>Depth</th><th>Volume (ft³)</th><th>Volume (yd³)</th></tr></thead><tbody><tr><td>2 in</td><td>16.67</td><td>0.62</td></tr><tr><td>3 in</td><td>25.00</td><td>0.93</td></tr><tr><td>4 in</td><td>33.33</td><td>1.23</td></tr></tbody></table></div>

          <h2>Pea Gravel Calculator Formula</h2>
          <p>The calculator first converts all lengths to feet. It then computes area and multiplies that area by depth to find the base volume. The default allowance is applied only after the base quantity is calculated. Weight is a separate estimate based on the density field.</p>
          <div className={styles.mathBox}><p>Rectangle area (ft²) = Length × Width</p><p>Circle area (ft²) = π × Radius²</p><p>Volume (ft³) = Area × Depth (ft)</p><p>Cubic yards = Cubic feet ÷ 27</p><p>Weight (lb) = Cubic feet × Bulk density</p><p>US short tons = Weight (lb) ÷ 2,000</p></div>
          <p>With the defaults (20 ft × 10 ft × 3 in), area is 200 ft² and depth is 0.25 ft. Base volume is 50 ft³, or 1.85185 yd³. At 100 lb/ft³, it weighs 5,000 lb (2.5 US short tons). A 10% allowance gives 2.03704 yd³ and 2.75 short tons to order. At $50 per US short ton, illustrative material cost is $137.50. Density changes weight, not geometric volume.</p>

          <h2>How Many Tons Are in a Cubic Yard of Pea Gravel?</h2>
          <p>There is no fixed ton-per-yard conversion: grading, packing, and moisture change loose weight. At 100 lb/ft³, one cubic yard weighs 2,700 lb, or 1.35 US short tons—an assumption, not a specification. <a href="https://www.usgs.gov/centers/national-minerals-information-center/construction-sand-and-gravel-statistics-and" target="_blank" rel="noreferrer">USGS aggregate statistics</a> give industry context, not pea-gravel density; ask your supplier for product data.</p>
          <p>A US short ton is 2,000 lb; a metric tonne is 1,000 kg (about 2,204.62 lb). They differ, so check which unit appears on supplier tickets. The calculator labels both.</p>

          <h2>How Deep Should Pea Gravel Be?</h2>
          <p>Depth varies by use: decorative beds, pedestrian paths, and load-bearing areas have different purposes and base requirements. Particle size, edging, and drainage also matter. Choose a measured project depth rather than borrowing guidance for an unrelated material.</p>
          <p><a href="https://gardeningsolutions.ifas.ufl.edu/care/planting/mulch/" target="_blank" rel="noreferrer">UF/IFAS mulch guidance</a> identifies pathways, dry creek beds, and downspouts as possible uses for inorganic rock, but does not recommend it as garden-bed mulch. Its organic-mulch depths do not automatically apply to pea gravel. Vehicle, drainage, or structural work may require specified aggregate and professional design; check local requirements and supplier guidance.</p>

          <h2>Pea Gravel Cost Calculator</h2>
          <p>Suppliers may quote pea gravel by cubic yard, US short ton, or bag. Choose the quote&apos;s actual unit in the calculator. Cubic-yard pricing multiplies the volume after allowance by the quoted rate. Per-ton pricing multiplies the estimated order weight by the per-short-ton rate. As a purely illustrative example, a 2.75-short-ton order at an entered $50 per short ton yields $137.50 in material. That is not a market average or a current local price.</p>
          <p>Ask whether a quote includes delivery, minimum orders, surcharges, and taxes. Access can affect truck size or placement, and bags may cost more per volume. The estimate excludes delivery and installation.</p>

          <h2>Common Mistakes When Ordering Pea Gravel</h2>
          <ul><li>Entering the wrong depth unit or using an unconverted inch value as feet.</li><li>Using circle diameter as the radius, or measuring a sloping bed as if it were level.</li><li>Treating the default density as a universal value or confusing rock particle density with loose bulk density.</li><li>Forgetting to account for openings and separate irregular sections in the measured area.</li><li>Comparing a price per cubic yard with a price per ton without converting using a supplier-supported density.</li><li>Ignoring bag volume, order increments, delivery minimums, or whether “ton” means US short ton.</li></ul>
          <p>For related material estimates, see the <a href="/calculators/sand-calculator">Sand Calculator</a>, <a href="/calculators/asphalt-calculator">Asphalt Calculator</a>, <a href="/calculators/fill-dirt-calculator">Fill Dirt Calculator</a>, and <a href="/calculators/landscape-rock-calculator">Landscape Rock Calculator</a>.</p>

          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>{faqItems.map((faq) => <section className={styles.faqItem} key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></section>)}</div>
          <h2>Final Thoughts</h2>
          <p>Accurate dimensions and depth give you a sound volume estimate; supplier-specific bulk density makes the weight and ton-based cost more useful. Treat the default density and allowance as editable planning assumptions, confirm the product and order units, and ask about delivery terms before placing an order.</p>
          <h2>Related calculators</h2>
          <div className={styles.relatedGrid}><a href="/calculators/sand-calculator">Sand Calculator</a><a href="/calculators/asphalt-calculator">Asphalt Calculator</a><a href="/calculators/fill-dirt-calculator">Fill Dirt Calculator</a><a href="/calculators/landscape-rock-calculator">Landscape Rock Calculator</a></div>
        </article>
      </main>
    </div>
  );
}
