"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../material-calculator.module.css";
import { calculateFillDirt, defaultFillDirtInputs, validateFillDirtInputs, type FillDirtInputs } from "@/lib/fill-dirt";
import { formatMaterialNumber, lengthUnits } from "@/lib/material-units";

const description = "Estimate fill dirt volume, weight, and material cost for leveling, backfilling, and landscaping projects.";
const faqItems = [
  {
    question: "How much fill dirt do I need for 100 square feet?",
    answer: "At 6 inches deep, 100 ft² requires 50 ft³, or about 1.85 yd³ of finished volume before any compaction adjustment or order allowance. Multiply the area by the measured average depth, then apply only project-appropriate adjustments.",
  },
  {
    question: "How many cubic yards of fill dirt are in a ton?",
    answer: "It depends on the soil's loose bulk density and moisture. At this calculator's illustrative 90 lb/ft³ assumption, a cubic yard weighs 2,430 lb, or 1.215 US short tons. This is not a standard conversion; confirm density and units with the supplier.",
  },
  {
    question: "Does fill dirt shrink when compacted?",
    answer: "Loose soil can occupy less volume after placement and compaction, but the change depends on soil type, moisture, and compaction method. Enter a project-specific additional loose-volume percentage only if you have a reasonable basis; use geotechnical specifications and testing for engineered fill.",
  },
];
const webApplicationData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildCalc Fill Dirt Calculator",
  url: "https://buildcalc.com/calculators/fill-dirt-calculator",
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
    { "@type": "ListItem", position: 3, name: "Fill Dirt Calculator", item: "https://buildcalc.com/calculators/fill-dirt-calculator" },
  ],
};

export default function FillDirtCalculatorClient() {
  const [form, setForm] = useState<FillDirtInputs>(defaultFillDirtInputs);
  const error = useMemo(() => validateFillDirtInputs(form), [form]);
  const result = useMemo(() => error ? null : calculateFillDirt(form), [error, form]);
  const update = <K extends keyof FillDirtInputs>(field: K, value: FillDirtInputs[K]) =>
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
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><a href="/calculators">Calculators</a><span>/</span><span>Fill Dirt Calculator</span></nav>
        <section className={styles.hero}>
          <p className={styles.kicker}>Earthwork & landscaping</p>
          <h1>Fill Dirt Calculator</h1>
          <p className={styles.intro}>Estimate fill dirt for a level area, backfilled space, trench, or other measured footprint. Enter dimensions and finished depth to calculate target volume, then add a separate planning adjustment for loose material, an order allowance, and supplier pricing if known. The estimate distinguishes finished fill volume from loose volume to order; density, moisture, and compaction can change delivered weight and volume, so treat assumptions as adjustable planning inputs.</p>
        </section>

        <section className={styles.calculatorCard} aria-label="Fill dirt calculator">
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Area shape</span><select className={styles.shapeSelect} aria-label="Area shape" value={form.shape} onChange={(event) => update("shape", event.target.value as FillDirtInputs["shape"])}><option value="rectangle">Rectangle</option><option value="circle">Circle</option></select></label>
            <label className={styles.field}><span>{form.shape === "circle" ? "Radius" : "Length"}</span><div className={styles.inputGroup}><input aria-label={form.shape === "circle" ? "Radius" : "Length"} type="number" min="0" step="any" value={form.length} onChange={(event) => update("length", event.target.value)} /><select aria-label="Length unit" value={form.lengthUnit} onChange={(event) => update("lengthUnit", event.target.value as FillDirtInputs["lengthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
          </div>
          {form.shape === "rectangle" ? <div className={styles.formGrid}><label className={styles.field}><span>Width</span><div className={styles.inputGroup}><input aria-label="Width" type="number" min="0" step="any" value={form.width} onChange={(event) => update("width", event.target.value)} /><select aria-label="Width unit" value={form.widthUnit} onChange={(event) => update("widthUnit", event.target.value as FillDirtInputs["widthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label><div className={styles.note}>Circle measurements use the radius above. Divide a nonuniform area into measured sections and total the volumes.</div></div> : null}
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Finished fill depth</span><div className={styles.inputGroup}><input aria-label="Fill depth" type="number" min="0" step="any" value={form.depth} onChange={(event) => update("depth", event.target.value)} /><select aria-label="Depth unit" value={form.depthUnit} onChange={(event) => update("depthUnit", event.target.value as FillDirtInputs["depthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
            <label className={styles.field}><span>Soil bulk density (illustrative)</span><div className={styles.inputGroup}><input aria-label="Soil bulk density" type="number" min="0" step="any" value={form.density} onChange={(event) => update("density", event.target.value)} /><span className={styles.unitTag}>lb/ft³</span></div><small className={styles.fieldHint}>Default 90 lb/ft³ is an assumption, not a standard for every soil. Confirm supplier density and moisture condition.</small></label>
          </div>
          <details className={styles.details}>
            <summary>Advanced options: compaction, allowance & supplier quote</summary>
            <div className={styles.detailsContent}>
              <div className={styles.formGrid}>
                <label className={styles.field}><span>Order allowance</span><div className={styles.inputGroup}><input aria-label="Order allowance" type="number" min="0" step="any" value={form.allowance} onChange={(event) => update("allowance", event.target.value)} /><span className={styles.unitTag}>%</span></div><small className={styles.fieldHint}>Covers measurement and placement variability; applied after any compaction adjustment.</small></label>
                <div className={styles.field}><label><input aria-label="Enable compaction adjustment" type="checkbox" checked={form.compactionEnabled} onChange={(event) => update("compactionEnabled", event.target.checked)} /> Enable loose-volume adjustment</label><label htmlFor="compaction-adjustment">Additional loose-volume percentage required</label><div className={styles.inputGroup}><input id="compaction-adjustment" aria-label="Compaction adjustment" type="number" min="0" step="any" disabled={!form.compactionEnabled} value={form.compactionAdjustment} onChange={(event) => update("compactionAdjustment", event.target.value)} /><span className={styles.unitTag}>% extra loose volume</span></div><small className={styles.fieldHint}>User-entered planning factor to reach target finished fill. Not a universal shrinkage rate or engineering specification.</small></div>
              </div>
              <div className={styles.formGrid}>
                <label className={styles.field}><span>Supplier price (optional)</span><div className={styles.inputGroup}><input aria-label="Supplier price" type="number" min="0" step="any" placeholder="Enter quote" value={form.price} onChange={(event) => update("price", event.target.value)} /><select aria-label="Price unit" value={form.priceUnit} onChange={(event) => update("priceUnit", event.target.value as FillDirtInputs["priceUnit"])}><option value="yd3">per cubic yard</option><option value="ton">per US short ton</option></select></div></label>
                <label className={styles.field}><span>Supplier order increment (optional)</span><div className={styles.inputGroup}><input aria-label="Supplier order increment" type="number" min="0" step="any" placeholder="e.g. 0.5" value={form.orderIncrement} onChange={(event) => update("orderIncrement", event.target.value)} /><span className={styles.unitTag}>yd³</span></div><small className={styles.fieldHint}>Rounds the loose order volume up before the material cost is estimated.</small></label>
              </div>
            </div>
          </details>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {result ? <div className={styles.resultPanel} aria-live="polite">
            <div className={styles.resultHeader}><span>Estimated loose fill dirt to order</span><strong data-testid="fill-order-yard">{formatMaterialNumber(result.orderVolumeCubicYd, 3)} yd³</strong></div>
            <div className={styles.resultGrid}>
              <div className={styles.resultCard}><span>Area</span><strong>{formatMaterialNumber(result.areaSqFt)} ft²</strong><small>Calculated footprint</small></div>
              <div className={styles.resultCard}><span>Target finished volume</span><strong>{formatMaterialNumber(result.targetVolumeCubicYd, 3)} yd³</strong><small>{formatMaterialNumber(result.targetVolumeCubicFt)} ft³ · {formatMaterialNumber(result.targetVolumeCubicM, 3)} m³</small></div>
              <div className={styles.resultCard}><span>Loose volume before allowance</span><strong>{formatMaterialNumber(result.looseVolumeBeforeAllowanceCubicYd, 3)} yd³</strong><small>Compaction adjustment: {form.compactionEnabled ? `${form.compactionAdjustment}%` : "off"}</small></div>
              {form.compactionEnabled ? <div className={styles.resultCard}><span>Compaction volume adjustment</span><strong>{formatMaterialNumber(result.compactionQuantityCubicYd, 3)} yd³</strong><small>Additional loose volume before allowance</small></div> : null}
              <div className={styles.resultCard}><span>Target weight</span><strong>{formatMaterialNumber((result.targetVolumeCubicFt * Number(form.density)) / 2000, 3)} US short tons</strong><small>{formatMaterialNumber(result.targetVolumeCubicFt * Number(form.density))} lb · {formatMaterialNumber(result.targetVolumeCubicFt * Number(form.density) * 0.00045359237, 3)} metric tonnes</small></div>
              <div className={styles.resultCard}><span>Order weight</span><strong>{formatMaterialNumber(result.orderShortTons, 3)} US short tons</strong><small>{formatMaterialNumber(result.orderWeightLb)} lb · {formatMaterialNumber(result.orderMetricTonnes, 3)} metric tonnes</small></div>
              <div className={styles.resultCard}><span>Metric order volume</span><strong>{formatMaterialNumber(result.orderVolumeCubicYd * 0.764554857984, 3)} m³</strong><small>Loose delivered-volume estimate</small></div>
              <div className={styles.resultCard}><span>Allowance</span><strong>{formatMaterialNumber(result.allowanceQuantityCubicYd, 3)} yd³ extra</strong><small>Excludes compaction adjustment</small></div>
              <div className={styles.resultCard}><span>Material cost</span><strong>{result.estimatedCost === null ? "Add a quote" : `$${formatMaterialNumber(result.estimatedCost, 2)}`}</strong><small>{form.priceUnit === "ton" ? "Quote basis: US short tons" : "Quote basis: cubic yards"}; delivery and labor excluded</small></div>
              {form.orderIncrement ? <div className={styles.resultCard}><span>Supplier rounding</span><strong>{formatMaterialNumber(result.orderVolumeCubicYd, 3)} yd³</strong><small>Rounded up to {form.orderIncrement} yd³ increments</small></div> : null}
            </div>
            <p className={styles.note}>The order is loose delivered material; target volume is finished fill. Density and volume vary with soil type, water content, and compaction. “US short tons” means 2,000 lb per ton. This estimate is not a geotechnical design or certified compaction test.</p>
          </div> : null}
        </section>

        <article className={styles.contentSection}>
          <h2>How to Use the Fill Dirt Calculator</h2>
          <p>Choose rectangle and enter length and width, or choose circle and enter its radius. Dimensions can use feet, inches, yards, meters, or centimeters. Measure the average depth to the intended finished grade. For a sloped yard or irregular trench, split the space into simple sections and total their volumes instead of using only its deepest point.</p>
          <p>Enter supplier bulk density when available. The 90 lb/ft³ default is illustrative; soil composition, moisture, and handling change weight. The optional compaction adjustment estimates additional loose volume to reach a target finished volume. The separate order allowance covers placement or measurement variation and is applied afterward. Leave either at zero when not appropriate; neither percentage is a universal shrinkage factor.</p>
          <p>Enter pricing per cubic yard or per US short ton to match the quote. An optional volume increment rounds the order up before cost. Delivery, taxes, labor, excavation, and access fees are excluded.</p>

          <h2>How Much Fill Dirt Do I Need?</h2>
          <p>Volume follows footprint multiplied by depth. A 100 ft² space filled 6 inches deep has a target volume of 100 × 0.5 = 50 ft³, or 1.85 yd³. A larger area or deeper fill increases the amount in direct proportion. This table assumes flat rectangular areas and shows target finished volume before compaction or order allowance; it is a geometric example, not a recommendation for depth.</p>
          <div className={styles.tableWrap}><table><thead><tr><th>Footprint</th><th>Depth</th><th>Finished volume</th></tr></thead><tbody><tr><td>100 ft²</td><td>6 in</td><td>1.85 yd³</td></tr><tr><td>200 ft²</td><td>6 in</td><td>3.70 yd³</td></tr><tr><td>200 ft²</td><td>12 in</td><td>7.41 yd³</td></tr></tbody></table></div>

          <h2>Fill Dirt Calculator Formula</h2>
          <div className={styles.mathBox}><p>Rectangle area (ft²) = Length × Width</p><p>Circle area (ft²) = π × Radius²</p><p>Cubic feet = Area × Depth (ft)</p><p>Cubic yards = Cubic feet ÷ 27</p><p>US short tons = Cubic feet × Density (lb/ft³) ÷ 2,000</p></div>
          <p>For the default 30 ft × 12 ft footprint at a 6-inch depth, the area is 360 ft² and finished volume is 360 × 0.5 = 180 ft³, or 6.66667 yd³. At the illustrative 90 lb/ft³ density, that target volume corresponds to 16,200 lb (8.1 US short tons). With no compaction adjustment and a 10% allowance, loose order volume is 7.33333 yd³ and estimated weight is 8.91 US short tons. At an entered illustrative quote of $30 per cubic yard, estimated material cost is $220. This calculation uses the calculator&apos;s defaults and excludes delivery.</p>

          <h2>How Many Tons Are in a Cubic Yard of Fill Dirt?</h2>
          <p>A cubic yard is volume; a ton is weight. At the illustrative 90 lb/ft³, 27 ft³ weighs 2,430 lb, or 1.215 US short tons. This is not a standard for every soil: texture, organic matter, rocks, moisture, and packing affect bulk density.</p>
          <p>The USDA NRCS reference on <a href="https://www.nrcs.usda.gov/sites/default/files/2022-10/Soil%20Bulk%20Density%20Moisture%20Aeration.pdf" target="_blank" rel="noreferrer">soil bulk density, moisture, and aeration</a> explains why density matters. Penn State&apos;s <a href="https://agsci.psu.edu/safes/guide-to-urban-soil-management/section-2-soil-testing/physical-testing-and-specifications" target="_blank" rel="noreferrer">physical testing guide</a> describes how moisture and compaction affect density. These are context, not a specification for delivered fill; confirm density and units with the supplier.</p>
          <p>One US short ton equals 2,000 pounds. One metric tonne equals 1,000 kilograms, approximately 2,204.62 pounds. They are not interchangeable. The result cards show both labels explicitly to reduce ambiguity when comparing estimates and supplier tickets.</p>

          <h2>Loose Fill Dirt vs. Compacted Fill Dirt</h2>
          <p>Soil particles can rearrange as loose fill is spread and compacted, changing volume. The amount depends on soil, moisture, lift thickness, and equipment. The optional user-entered factor is only a planning estimate; it applies before a separate allowance and is not inferred from material type.</p>
          <p>Engineered earthwork may specify soil, moisture conditioning, lift placement, and compaction relative to a laboratory test. Follow project documents and qualified testing for foundations, walls, or pavement. This calculator is not geotechnical design or certified field testing.</p>

          <h2>Fill Dirt vs. Topsoil</h2>
          <p>Fill dirt is generally used to raise grade or occupy volume; topsoil is selected for planting and may contain more organic matter. Product names vary, so check what a load contains. Backfill may not provide the texture or organic content a garden needs, while using planting soil deep in a fill area may be uneconomical.</p>
          <p>Penn State&apos;s <a href="https://agsci.psu.edu/safes/guide-to-urban-soil-management/section-2-soil-testing/physical-testing-and-specifications" target="_blank" rel="noreferrer">soil texture and testing guide</a> helps explain soil properties, not a universal fill-dirt density.</p>

          <h2>How Much Does Fill Dirt Cost?</h2>
          <p>Quotes may use cubic yards or weight; confirm whether volume is loose or compacted. At a hypothetical $30 per yard, 7.333 yd³ costs $220 before delivery. This is arithmetic, not a market average. Minimum loads, access, taxes, excavation, and labor affect total cost.</p>

          <h2>Common Mistakes When Estimating Fill Dirt</h2>
          <ul><li>Using a deepest-point measurement as the average depth over an uneven area.</li><li>Mixing units, such as multiplying a depth in inches directly by dimensions in feet.</li><li>Treating the default 90 lb/ft³ density as a product specification.</li><li>Applying a compaction factor and allowance without understanding that they are separate adjustments.</li><li>Assuming a simple percentage replaces engineered compaction specifications or field testing.</li><li>Comparing supplier prices without confirming volume versus weight or short-ton versus metric-ton units.</li></ul>
          <p>For other aggregate estimates, use the <a href="/calculators/pea-gravel-calculator">Pea Gravel Calculator</a>, <a href="/calculators/landscape-rock-calculator">Landscape Rock Calculator</a>, or <a href="/calculators/sand-calculator">Sand Calculator</a>.</p>

          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>{faqItems.map((faq) => <section className={styles.faqItem} key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></section>)}</div>
          <h2>Final Thoughts</h2>
          <p>Measure the footprint and average finished depth carefully, then separate target fill from loose-volume and ordering adjustments. Use supplier-specific product information for density and quote units. For engineered work, follow the design documents and testing requirements rather than relying on an online material estimate.</p>
          <h2>Related calculators</h2>
          <div className={styles.relatedGrid}><a href="/calculators/pea-gravel-calculator">Pea Gravel Calculator</a><a href="/calculators/landscape-rock-calculator">Landscape Rock Calculator</a><a href="/calculators/sand-calculator">Sand Calculator</a><a href="/calculators/asphalt-calculator">Asphalt Calculator</a></div>
        </article>
      </main>
    </div>
  );
}
