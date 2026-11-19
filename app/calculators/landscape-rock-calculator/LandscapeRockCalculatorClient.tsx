"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../material-calculator.module.css";
import { calculateLandscapeRock, defaultLandscapeRockInputs, landscapeRockCoverageSqFt, validateLandscapeRockInputs, type LandscapeRockInputs, type LandscapeRockMaterial } from "@/lib/landscape-rock";
import { formatMaterialNumber, lengthUnits } from "@/lib/material-units";

const description = "Calculate landscape rock volume, weight, coverage, and material cost for decorative stone projects.";
const faqItems = [
  {
    question: "How much landscape rock do I need for 100 square feet?",
    answer: "At 3 inches deep, 100 ft² requires 25 ft³, or about 0.93 yd³ before allowance. The needed quantity changes directly with depth; this geometric estimate does not include uneven ground, settling, or supplier rounding.",
  },
  {
    question: "How many tons of landscape rock are in a cubic yard?",
    answer: "It varies with rock type, grading, packing, and moisture. At the editable illustrative density of 110 lb/ft³, a cubic yard weighs 2,970 lb, or 1.485 US short tons. This is not a universal rock conversion; use supplier data when available.",
  },
  {
    question: "How deep should landscape rock be?",
    answer: "Depth depends on stone size, the intended use, base preparation, and site conditions. Choose a project-appropriate depth and verify product coverage with the supplier; do not assume one depth works for every planting bed, walkway, or drainage feature.",
  },
];
const materialLabels: Record<LandscapeRockMaterial, string> = {
  decorative: "General decorative rock",
  river: "River rock",
  crushed: "Crushed stone",
  pea: "Pea gravel",
  lava: "Lava rock",
  custom: "Custom material",
};
const webApplicationData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildCalc Landscape Rock Calculator",
  url: "https://buildcalc.com/calculators/landscape-rock-calculator",
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
    { "@type": "ListItem", position: 3, name: "Landscape Rock Calculator", item: "https://buildcalc.com/calculators/landscape-rock-calculator" },
  ],
};

export default function LandscapeRockCalculatorClient() {
  const [form, setForm] = useState<LandscapeRockInputs>(defaultLandscapeRockInputs);
  const error = useMemo(() => validateLandscapeRockInputs(form), [form]);
  const result = useMemo(() => error ? null : calculateLandscapeRock(form), [error, form]);
  const update = <K extends keyof LandscapeRockInputs>(field: K, value: LandscapeRockInputs[K]) =>
    setForm((current) => ({ ...current, [field]: value }));
  const changeMaterial = (material: LandscapeRockMaterial) => {
    setForm((current) => ({
      ...current,
      material,
      density: material === "decorative" ? "110" : "",
    }));
  };

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <header className={styles.topbar}>
        <div className={styles.brandWrap}><div className={styles.logo}>B</div><div className={styles.brand}>BuildCalc</div><span className={styles.dot}>.</span></div>
        <a href="/calculators" className={styles.headerLink}>All calculators</a>
      </header>
      <main className={styles.main}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><a href="/calculators">Calculators</a><span>/</span><span>Landscape Rock Calculator</span></nav>
        <section className={styles.hero}>
          <p className={styles.kicker}>Landscaping & aggregates</p>
          <h1>Landscape Rock Calculator</h1>
          <p className={styles.intro}>Estimate the landscape rock needed for a garden path, decorative area, or other measured space. Enter the area and depth to calculate cubic feet, cubic yards, and estimated weight, then add a supplier quote or bag volume if useful. Rock type matters: this calculator uses an editable assumption only for general decorative rock and asks you to provide density for other materials instead of assigning unsupported weights.</p>
        </section>

        <section className={styles.calculatorCard} aria-label="Landscape rock calculator">
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Area shape</span><select className={styles.shapeSelect} aria-label="Area shape" value={form.shape} onChange={(event) => update("shape", event.target.value as LandscapeRockInputs["shape"])}><option value="rectangle">Rectangle</option><option value="circle">Circle</option></select></label>
            <label className={styles.field}><span>{form.shape === "circle" ? "Radius" : "Length"}</span><div className={styles.inputGroup}><input aria-label={form.shape === "circle" ? "Radius" : "Length"} type="number" min="0" step="any" value={form.length} onChange={(event) => update("length", event.target.value)} /><select aria-label="Length unit" value={form.lengthUnit} onChange={(event) => update("lengthUnit", event.target.value as LandscapeRockInputs["lengthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
          </div>
          {form.shape === "rectangle" ? <div className={styles.formGrid}><label className={styles.field}><span>Width</span><div className={styles.inputGroup}><input aria-label="Width" type="number" min="0" step="any" value={form.width} onChange={(event) => update("width", event.target.value)} /><select aria-label="Width unit" value={form.widthUnit} onChange={(event) => update("widthUnit", event.target.value as LandscapeRockInputs["widthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label><div className={styles.note}>For circles, enter radius rather than diameter. Break irregular layouts into measured sections.</div></div> : null}
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Rock depth</span><div className={styles.inputGroup}><input aria-label="Rock depth" type="number" min="0" step="any" value={form.depth} onChange={(event) => update("depth", event.target.value)} /><select aria-label="Depth unit" value={form.depthUnit} onChange={(event) => update("depthUnit", event.target.value as LandscapeRockInputs["depthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
            <label className={styles.field}><span>Rock material</span><select className={styles.shapeSelect} aria-label="Rock material" value={form.material} onChange={(event) => changeMaterial(event.target.value as LandscapeRockMaterial)}>{Object.entries(materialLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </div>
          <details className={styles.details} open>
            <summary>Density, allowance, pricing & ordering</summary>
            <div className={styles.detailsContent}>
              <div className={styles.formGrid}>
                <label className={styles.field}><span>{form.material === "decorative" ? "Bulk density (illustrative assumption)" : `${materialLabels[form.material]} bulk density`}</span><div className={styles.inputGroup}><input aria-label="Bulk density" type="number" min="0" step="any" value={form.density} onChange={(event) => update("density", event.target.value)} placeholder="Enter supplier value" /><span className={styles.unitTag}>lb/ft³</span></div><small className={styles.fieldHint}>{form.material === "decorative" ? "110 lb/ft³ is an editable planning assumption for general decorative rock only." : "No preset density is assumed for this material. Enter its supplier-provided loose bulk density; lava rock may be substantially lighter than dense stone."}</small></label>
                <label className={styles.field}><span>Waste / order allowance</span><div className={styles.inputGroup}><input aria-label="Waste allowance" type="number" min="0" step="any" value={form.allowance} onChange={(event) => update("allowance", event.target.value)} /><span className={styles.unitTag}>%</span></div></label>
              </div>
              <div className={styles.formGrid}>
                <label className={styles.field}><span>Supplier price (optional)</span><div className={styles.inputGroup}><input aria-label="Supplier price" type="number" min="0" step="any" placeholder="Enter quote" value={form.price} onChange={(event) => update("price", event.target.value)} /><select aria-label="Price unit" value={form.priceUnit} onChange={(event) => update("priceUnit", event.target.value as LandscapeRockInputs["priceUnit"])}><option value="yd3">per cubic yard</option><option value="ton">per US short ton</option></select></div></label>
                <label className={styles.field}><span>Bag volume (optional)</span><div className={styles.inputGroup}><input aria-label="Bag volume" type="number" min="0" step="any" placeholder="e.g. 0.5" value={form.bagVolume} onChange={(event) => update("bagVolume", event.target.value)} /><span className={styles.unitTag}>ft³ / bag</span></div><small className={styles.fieldHint}>Enter labeled volume, not bag weight.</small></label>
              </div>
              <label className={styles.field}><span>Supplier order increment (optional)</span><div className={styles.inputGroup}><input aria-label="Supplier order increment" type="number" min="0" step="any" placeholder="e.g. 0.25" value={form.orderIncrement} onChange={(event) => update("orderIncrement", event.target.value)} /><span className={styles.unitTag}>yd³</span></div></label>
            </div>
          </details>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {result ? <div className={styles.resultPanel} aria-live="polite">
            <div className={styles.resultHeader}><span>Estimated landscape rock to order</span><strong data-testid="rock-order-yard">{formatMaterialNumber(result.orderVolumeCubicYd, 3)} yd³</strong></div>
            <div className={styles.resultGrid}>
              <div className={styles.resultCard}><span>Area</span><strong>{formatMaterialNumber(result.areaSqFt)} ft²</strong><small>Calculated footprint</small></div>
              <div className={styles.resultCard}><span>Base volume</span><strong>{formatMaterialNumber(result.baseVolumeCubicYd, 3)} yd³</strong><small>{formatMaterialNumber(result.baseVolumeCubicFt)} ft³ · {formatMaterialNumber(result.baseVolumeCubicM, 3)} m³</small></div>
              <div className={styles.resultCard}><span>Base weight</span><strong>{formatMaterialNumber(result.baseShortTons, 3)} US short tons</strong><small>{formatMaterialNumber(result.baseWeightLb)} lb · {formatMaterialNumber(result.baseMetricTonnes, 3)} metric tonnes</small></div>
              <div className={styles.resultCard}><span>Order weight</span><strong>{formatMaterialNumber(result.orderShortTons, 3)} US short tons</strong><small>{formatMaterialNumber(result.orderMetricTonnes, 3)} metric tonnes · allowance included</small></div>
              <div className={styles.resultCard}><span>Order volume</span><strong>{formatMaterialNumber(result.orderVolumeCubicYd * 0.764554857984, 3)} m³</strong><small>{formatMaterialNumber(result.orderVolumeCubicFt)} ft³ loose volume</small></div>
              <div className={styles.resultCard}><span>Allowance</span><strong>{formatMaterialNumber(result.allowanceQuantityCubicYd, 3)} yd³ extra</strong><small>{form.allowance}% above base volume</small></div>
              <div className={styles.resultCard}><span>Material cost</span><strong>{result.estimatedCost === null ? "Add a quote" : `$${formatMaterialNumber(result.estimatedCost, 2)}`}</strong><small>{form.priceUnit === "ton" ? "Quote basis: US short tons" : "Quote basis: cubic yards"}; delivery and labor excluded</small></div>
              {result.bagCount !== null ? <div className={styles.resultCard}><span>Approximate bags</span><strong>{formatMaterialNumber(result.bagCount, 0)}</strong><small>At {form.bagVolume} ft³ per bag</small></div> : null}
            </div>
            <p className={styles.note}>Weight is estimated from {result.selectedDensityLbPerFt3} lb/ft³ for {materialLabels[form.material]}. {form.material === "decorative" ? "This is an illustrative loose bulk-density assumption for general decorative rock only." : "This is the bulk density you entered; confirm it and the material's moisture and packing condition with the supplier."} US short tons equal 2,000 lb.</p>
          </div> : null}
        </section>

        <article className={styles.contentSection}>
          <h2>How to Use the Landscape Rock Calculator</h2>
          <p>Choose rectangle or circle and enter dimensions in feet, inches, yards, meters, or centimeters. Measure the layer depth and select a material label. The 110 lb/ft³ starting value is an illustrative assumption for general decorative rock only. Selecting river rock, crushed stone, pea gravel, lava rock, or custom clears density so the calculator does not assign an unsupported value to another product.</p>
          <p>Confirm whether a density is loose bulk density and note its moisture condition. Match the price unit to the quote, and use an allowance for site variation. An optional supplier increment rounds volume up before cost and weight calculations. Bag counts require labeled volume, not bag weight.</p>

          <h2>How Much Landscape Rock Do I Need?</h2>
          <p>One cubic yard is 27 ft³. At 2 inches deep it covers 162 ft²; at 3 inches, 108 ft²; at 4 inches, 81 ft². These are theoretical values before allowance or uneven placement, not depth recommendations.</p>
          <div className={styles.tableWrap}><table><thead><tr><th>Depth</th><th>Theoretical coverage per 1 yd³</th><th>Calculation</th></tr></thead><tbody><tr><td>2 in</td><td>{formatMaterialNumber(landscapeRockCoverageSqFt(2), 0)} ft²</td><td>27 ft³ ÷ (2/12 ft)</td></tr><tr><td>3 in</td><td>{formatMaterialNumber(landscapeRockCoverageSqFt(3), 0)} ft²</td><td>27 ft³ ÷ (3/12 ft)</td></tr><tr><td>4 in</td><td>{formatMaterialNumber(landscapeRockCoverageSqFt(4), 0)} ft²</td><td>27 ft³ ÷ (4/12 ft)</td></tr></tbody></table></div>
          <p>Rectangles use length times width; circles use π times radius squared. Break irregular borders into simple shapes, then total their volumes. Measure only the net area that will receive rock.</p>

          <h2>Landscape Rock Calculator Formula</h2>
          <div className={styles.mathBox}><p>Area (ft²) = Length × Width, or π × Radius²</p><p>Volume (ft³) = Area × Depth (ft)</p><p>Cubic yards = Cubic feet ÷ 27</p><p>Weight (lb) = Volume (ft³) × Selected bulk density</p><p>US short tons = Weight (lb) ÷ 2,000</p></div>
          <p>For the initial 15 ft × 8 ft area at 2 inches deep, area is 120 ft² and depth is 2/12 ft. Base volume is 20 ft³, or 0.74074 yd³. At the illustrative 110 lb/ft³ density, that equals 2,200 lb, or 1.1 US short tons. Add the default 5% allowance to get about 0.77778 yd³ and 1.155 short tons to order. With an illustrative user-entered price of $80 per cubic yard, estimated material cost is $62.22. No delivery or labor cost is added.</p>

          <h2>How Many Tons Are in a Cubic Yard of Landscape Rock?</h2>
          <p>The number changes with material density and packing. With the calculator&apos;s illustrative 110 lb/ft³ assumption, one cubic yard weighs 110 × 27 = 2,970 lb, equal to 1.485 US short tons. This does not apply to every decorative stone. Rounded river rock, crushed products, pea gravel, and porous lava rock can differ substantially, and moisture or how tightly material settles can change a bulk estimate. The tool therefore makes density editable and does not provide unsupported product-specific defaults.</p>
          <p><a href="https://www.usgs.gov/centers/national-minerals-information-center/construction-sand-and-gravel-statistics-and" target="_blank" rel="noreferrer">USGS aggregate statistics</a> provide industry context, not landscape-rock density. Request supplier data. A US short ton is 2,000 lb; a metric tonne is about 2,204.62 lb.</p>

          <h2>Types of Landscape Rock</h2>
          <p>Product labels do not guarantee size or weight: river rock is generally rounded, crushed stone angular, pea gravel small and rounded, and porous lava rock can be lighter than dense stone. Confirm the specific material and bulk density with the supplier.</p>
          <p>The <a href="https://gardeningsolutions.ifas.ufl.edu/care/planting/mulch/" target="_blank" rel="noreferrer">UF/IFAS mulch guide</a> explains rock mulch&apos;s limitations around plants and identifies pathways and dry creek beds as possible uses. USGS statistics give aggregate context, not product specifications.</p>

          <h2>How Deep Should Landscape Rock Be?</h2>
          <p>Depth depends on stone size, intended use, base, edging, and drainage. A decorative layer, path, and dry creek may need different approaches. Follow supplier coverage guidance or project plans; larger pieces may leave more gaps at the same depth.</p>
          <p>UF/IFAS notes that rock does not add nutrients or improve water-holding like organic mulch and advises limiting it in planting beds. Do not copy organic-mulch depths for stone. Fabric also does not guarantee a weed-free surface.</p>

          <h2>Landscape Rock Cost Calculator</h2>
          <p>Bulk quotes may be per yard or ton; retail orders may be bagged. At a hypothetical $80 per yard, 0.77778 yd³ costs $62.22 for material, not including delivery. This is an example, not a market price. Distance, minimum loads, access, and availability can add cost.</p>
          <p>Compare a bag&apos;s volume with bulk volume, and confirm whether a ton is short or metric.</p>

          <h2>Common Landscaping Rock Estimation Mistakes</h2>
          <ul><li>Using a single depth reading on a sloped or uneven space.</li><li>Assuming all decorative rock has the default 110 lb/ft³ density.</li><li>Confusing cubic feet with cubic yards or inches with feet.</li><li>Measuring an irregular area as one large rectangle instead of summing smaller sections.</li><li>Converting bag weight into bag volume without density.</li><li>Comparing supplier prices without confirming quote units, allowance, and delivery terms.</li></ul>
          <p>For related material estimates, see the <a href="/calculators/pea-gravel-calculator">Pea Gravel Calculator</a>, <a href="/calculators/sand-calculator">Sand Calculator</a>, <a href="/calculators/fill-dirt-calculator">Fill Dirt Calculator</a>, and <a href="/calculators/asphalt-calculator">Asphalt Calculator</a>.</p>

          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>{faqItems.map((faq) => <section className={styles.faqItem} key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></section>)}</div>
          <h2>Final Thoughts</h2>
          <p>Measure the area and depth, identify the exact stone product, then verify its bulk density and purchase units with the supplier. The calculator gives a transparent volume estimate and keeps the density assumption visible; it is a useful starting point, not a substitute for product data or project-specific design requirements.</p>
          <h2>Related calculators</h2>
          <div className={styles.relatedGrid}><a href="/calculators/pea-gravel-calculator">Pea Gravel Calculator</a><a href="/calculators/sand-calculator">Sand Calculator</a><a href="/calculators/fill-dirt-calculator">Fill Dirt Calculator</a><a href="/calculators/asphalt-calculator">Asphalt Calculator</a></div>
        </article>
      </main>
    </div>
  );
}
