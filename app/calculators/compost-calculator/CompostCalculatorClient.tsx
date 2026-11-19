"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../material-calculator.module.css";
import { calculateCompost, defaultCompostInputs, validateCompostInputs, type CompostInputs } from "@/lib/compost";
import { formatMaterialNumber, lengthUnits } from "@/lib/material-units";

const description = "Estimate finished compost volume in cubic feet, cubic yards, and bags, with an optional purchasing allowance and material cost.";
const webApplicationData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildCalc Compost Calculator",
  url: "https://buildcalc.com/calculators/compost-calculator",
  description,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};
const breadcrumbData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://buildcalc.com/" },
    { "@type": "ListItem", position: 2, name: "Calculators", item: "https://buildcalc.com/calculators" },
    { "@type": "ListItem", position: 3, name: "Compost Calculator", item: "https://buildcalc.com/calculators/compost-calculator" },
  ],
};

export default function CompostCalculatorClient() {
  const [form, setForm] = useState<CompostInputs>(defaultCompostInputs);
  const error = useMemo(() => validateCompostInputs(form), [form]);
  const result = useMemo(() => error ? null : calculateCompost(form), [error, form]);
  const update = <K extends keyof CompostInputs>(field: K, value: CompostInputs[K]) =>
    setForm((current) => ({ ...current, [field]: value }));

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <header className={styles.topbar}>
        <Link href="/" className={styles.brandWrap} aria-label="BuildCalc home"><span className={styles.logo}>B</span><span className={styles.brand}>BuildCalc</span><span className={styles.dot}>.</span></Link>
        <Link href="/calculators" className={styles.headerLink}>All calculators</Link>
      </header>
      <main className={styles.main}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/calculators">Calculators</Link><span>/</span><span>Compost Calculator</span></nav>
        <section className={styles.hero}>
          <p className={styles.kicker}>Soil &amp; gardening</p>
          <h1>Compost Calculator: Calculate Cubic Yards, Bags &amp; Cost</h1>
          <p className={styles.intro}>Not sure how much compost to buy for your garden? Our free <strong>Compost Calculator</strong> helps you estimate the amount of finished compost required for planting beds, vegetable gardens, lawns, and landscaping projects.</p>
          <p>Enter your application area&apos;s dimensions and the compost depth you plan to apply. The calculator converts your measurements into cubic feet, cubic yards, and bag quantities.</p>
          <p>You can also add a purchasing allowance and estimate material costs using the prices quoted by your compost supplier.</p>
        </section>

        <section className={styles.calculatorCard} aria-label="Compost calculator">
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Application area shape</span><select className={styles.shapeSelect} value={form.shape} onChange={(event) => update("shape", event.target.value as CompostInputs["shape"])}><option value="rectangle">Rectangle</option><option value="circle">Circle</option></select></label>
            <label className={styles.field}><span>{form.shape === "circle" ? "Radius" : "Length"}</span><div className={styles.inputGroup}><input type="number" min="0" step="any" value={form.length} onChange={(event) => update("length", event.target.value)} /><select aria-label="Length unit" value={form.lengthUnit} onChange={(event) => update("lengthUnit", event.target.value as CompostInputs["lengthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
          </div>
          {form.shape === "rectangle" ? <div className={styles.formGrid}><label className={styles.field}><span>Width</span><div className={styles.inputGroup}><input aria-label="Width" type="number" min="0" step="any" value={form.width} onChange={(event) => update("width", event.target.value)} /><select aria-label="Width unit" value={form.widthUnit} onChange={(event) => update("widthUnit", event.target.value as CompostInputs["widthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label><p className={styles.note}>For a circular area, enter the radius. The calculator uses π × radius².</p></div> : null}
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Compost application depth</span><div className={styles.inputGroup}><input aria-label="Compost application depth" type="number" min="0" step="any" value={form.depth} onChange={(event) => update("depth", event.target.value)} /><select aria-label="Depth unit" value={form.depthUnit} onChange={(event) => update("depthUnit", event.target.value as CompostInputs["depthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
            <label className={styles.field}><span>Number of identical areas</span><div className={styles.inputGroup}><input type="number" min="1" step="1" value={form.areaCount} onChange={(event) => update("areaCount", event.target.value)} /><span className={styles.unitTag}>areas</span></div></label>
          </div>
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Purchasing allowance</span><div className={styles.inputGroup}><input aria-label="Purchasing allowance" type="number" min="0" step="any" value={form.allowance} onChange={(event) => update("allowance", event.target.value)} /><span className={styles.unitTag}>%</span></div><small className={styles.fieldHint}>Optional buffer added after the base volume is calculated.</small></label>
            <label className={styles.field}><span>Compost bag volume</span><div className={styles.inputGroup}><input aria-label="Compost bag volume" type="number" min="0" step="any" value={form.bagVolume} onChange={(event) => update("bagVolume", event.target.value)} /><span className={styles.unitTag}>ft³ / bag</span></div><small className={styles.fieldHint}>Enter the volume printed on the package.</small></label>
          </div>
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Supplier price (optional)</span><div className={styles.inputGroup}><input aria-label="Supplier price" type="number" min="0" step="any" placeholder="Enter supplier quote" value={form.price} onChange={(event) => update("price", event.target.value)} /><select aria-label="Price unit" value={form.priceUnit} onChange={(event) => update("priceUnit", event.target.value as CompostInputs["priceUnit"])}><option value="yd3">per cubic yard</option><option value="bag">per whole bag</option></select></div></label>
            <p className={styles.note}>Bag-based cost uses the whole number of bags required. Bulk cost uses the adjusted cubic-yard volume.</p>
          </div>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {result ? <div className={styles.resultPanel} aria-live="polite">
            <div className={styles.resultHeader}><span>Estimated finished compost to order</span><strong data-testid="compost-order-yard">{formatMaterialNumber(result.orderVolumeCubicYd, 3)} yd³</strong></div>
            <div className={styles.resultGrid}>
              <div className={styles.resultCard}><span>Combined area</span><strong>{formatMaterialNumber(result.areaSqFt)} ft²</strong><small>Across {form.areaCount} area{form.areaCount === "1" ? "" : "s"}</small></div>
              <div className={styles.resultCard}><span>Base volume</span><strong>{formatMaterialNumber(result.baseVolumeCubicFt)} ft³</strong><small>{formatMaterialNumber(result.baseVolumeCubicYd, 3)} yd³ before allowance</small></div>
              <div className={styles.resultCard}><span>Volume to order</span><strong>{formatMaterialNumber(result.orderVolumeCubicFt)} ft³</strong><small>{formatMaterialNumber(result.orderVolumeCubicM, 3)} m³ including allowance</small></div>
              <div className={styles.resultCard}><span>Purchasing allowance</span><strong>{formatMaterialNumber(result.allowanceVolumeCubicFt)} ft³ extra</strong><small>{form.allowance}% above base volume</small></div>
              <div className={styles.resultCard}><span>Whole bags</span><strong>{result.bagCount === null ? "Enter bag volume" : formatMaterialNumber(result.bagCount, 0)}</strong><small>At {form.bagVolume} ft³ per bag</small></div>
              <div className={styles.resultCard}><span>Estimated material cost</span><strong>{result.estimatedCost === null ? "Add a supplier quote" : `$${formatMaterialNumber(result.estimatedCost, 2)}`}</strong><small>{form.priceUnit === "bag" ? "Based on whole bags" : "Based on cubic yards"}; delivery and taxes excluded</small></div>
            </div>
            <p className={styles.note}>This estimates finished compost for the selected application depth. It does not estimate raw feedstock needed to produce compost.</p>
          </div> : null}
        </section>

        <article className={styles.contentSection}>
          <h2>How to Use Our Compost Calculator</h2>
          <p>First, determine the area where you intend to apply compost.</p>
          <p>For rectangular spaces, enter the length and width. For circular planting areas, choose the circular option and enter the radius.</p>
          <p>Next, specify the compost layer depth in inches or your preferred unit.</p>
          <p>If you&apos;re applying compost to several identical areas, enter the number of areas.</p>
          <p>You can then add an optional purchasing allowance and choose between bagged and bulk compost.</p>
          <p>The results will show the base quantity, adjusted order quantity, and estimated material cost.</p>
          <p>Remember that this tool calculates the volume of <strong>finished compost</strong> needed for application. It does not estimate how much compost you&apos;ll produce from raw food scraps or yard waste.</p>

          <h2>How Much Compost Do I Need?</h2>
          <p>Compost requirements depend mainly on the surface area and application depth.</p>
          <p>For example, a 100-square-foot garden covered with a two-inch layer of compost needs:</p>
          <p>100 × (2 ÷ 12) = <strong>16.67 cubic feet</strong></p>
          <p>That equals approximately <strong>0.62 cubic yards</strong> before any additional allowance.</p>
          <p>Here are several examples:</p>
          <div className={styles.tableWrap}><table><thead><tr><th>Garden area</th><th>Compost depth</th><th>Volume</th></tr></thead><tbody><tr><td>100 ft²</td><td>1 inch</td><td>8.33 ft³</td></tr><tr><td>100 ft²</td><td>2 inches</td><td>16.67 ft³</td></tr><tr><td>200 ft²</td><td>2 inches</td><td>33.33 ft³</td></tr><tr><td>200 ft²</td><td>3 inches</td><td>50 ft³</td></tr><tr><td>400 ft²</td><td>1 inch</td><td>33.33 ft³</td></tr></tbody></table></div>
          <p>These figures are geometric volume estimates, not universal recommendations for how much compost to apply.</p>
          <p>The appropriate application depth depends on whether compost is being incorporated into soil, applied as surface mulch, or used for another purpose.</p>

          <h2>Compost Calculator Formula</h2>
          <p>For rectangular areas, compost volume is:</p>
          <div className={styles.mathBox}><p>Volume = Length × Width × Depth</p></div>
          <p>When dimensions are measured in feet and depth in inches:</p>
          <div className={styles.mathBox}><p>Cubic Feet = Length (ft) × Width (ft) × Depth (in) ÷ 12</p><p>Cubic Yards = Cubic Feet ÷ 27</p></div>
          <p>For purchasing allowances:</p>
          <div className={styles.mathBox}><p>Order Volume = Base Volume × (1 + Allowance Percentage ÷ 100)</p></div>
          <p>For bagged compost:</p>
          <div className={styles.mathBox}><p>Bag Count = Order Volume ÷ Bag Volume</p></div>
          <p>Round bag counts upward to whole bags.</p>
          <h3>Example: Compost for a 20 × 10-Foot Garden</h3>
          <p>Suppose your garden measures 20 feet by 10 feet and you plan to apply a two-inch layer.</p>
          <p>The area is:</p><p>20 × 10 = <strong>200 square feet</strong></p>
          <p>The required compost volume is:</p><p>200 × (2 ÷ 12) = <strong>33.33 cubic feet</strong></p>
          <p>Convert to cubic yards:</p><p>33.3333 ÷ 27 = <strong>1.23 cubic yards</strong></p>
          <p>Add an optional 5% purchasing allowance:</p><p>33.3333 × 1.05 = <strong>35 cubic feet</strong></p>
          <p>That equals approximately <strong>1.30 cubic yards</strong>.</p>
          <p>If compost costs an illustrative $45 per cubic yard, the estimated material cost is:</p>
          <p>(35 ÷ 27) × $45 = <strong>$58.33</strong></p>
          <p>Delivery and supplier minimum-order charges are not included.</p>

          <h2>Compost Coverage: How Far Does One Cubic Yard Go?</h2>
          <p>One cubic yard contains 27 cubic feet of material.</p>
          <p>The amount of ground it covers depends on the depth of the layer.</p>
          <div className={styles.tableWrap}><table><thead><tr><th>Compost depth</th><th>Coverage from 1 cubic yard</th></tr></thead><tbody><tr><td>1 inch</td><td>324 ft²</td></tr><tr><td>2 inches</td><td>162 ft²</td></tr><tr><td>3 inches</td><td>108 ft²</td></tr><tr><td>4 inches</td><td>81 ft²</td></tr></tbody></table></div>
          <p>For example, one cubic yard can theoretically cover 162 square feet at a uniform depth of two inches.</p>
          <p>Real applications may need adjustments for uneven ground or differences in the finished material layer.</p>
          <p>When measuring large areas, divide irregular shapes into smaller rectangles or circles and add their calculated volumes.</p>

          <h2>How Much Compost Should You Add to Garden Soil?</h2>
          <p>Finished compost is commonly used to improve soil conditions by adding organic matter.</p>
          <p>According to the <a href="https://www.epa.gov/recycle/composting-home" target="_blank" rel="noreferrer">US Environmental Protection Agency&apos;s composting guidance</a>, finished compost can be incorporated into garden soil or applied as surface mulch.</p>
          <p>The EPA describes incorporating two to four inches of compost into the upper six to nine inches of soil as one general amendment approach. It also provides separate guidance for using compost as mulch.</p>
          <p>These are general examples, not a recommendation that every soil requires the same application rate.</p>
          <p>Soil type, existing organic matter, compost quality, intended plants, and nutrient conditions should influence the amount used.</p>
          <p>For specialized applications, seek guidance from your local cooperative extension service or soil test recommendations.</p>

          <h2>Why Use Compost in a Garden?</h2>
          <p>Compost is produced when organic materials decompose under managed conditions.</p>
          <p>Properly finished compost can contribute organic matter, improve certain soil physical properties, and support soil organisms.</p>
          <p>The <a href="https://www.epa.gov/sustainable-management-food/benefits-using-compost" target="_blank" rel="noreferrer">EPA&apos;s guide to the benefits of using compost</a> describes potential improvements in soil structure, water infiltration, and moisture retention.</p>
          <p>The precise benefits vary with the material and its application.</p>
          <p>Not all compost products have the same nutrient content, maturity, or intended use. Check supplier information before applying a product to food crops or sensitive plants.</p>

          <h2>How Many Bags of Compost Do I Need?</h2>
          <p>Compost is often available in bags labeled by cubic-foot volume.</p>
          <p>If your project requires 35 cubic feet after allowance, you would need:</p>
          <ul><li>35 bags of 1 cubic foot each</li><li>24 bags of 1.5 cubic feet each</li><li>18 bags of 2 cubic feet each</li></ul>
          <p>The calculator rounds upward because most suppliers don&apos;t sell fractions of a bag.</p>
          <p>For larger areas, ask local landscape suppliers about bulk deliveries.</p>
          <p>When comparing bagged and bulk prices, consider the total delivered quantity, available minimum order, product quality, and transportation cost.</p>

          <h2>Compost vs. Topsoil: What&apos;s the Difference?</h2>
          <p>Topsoil generally refers to the upper mineral-soil layer, containing varying proportions of sand, silt, clay, and organic matter.</p>
          <p>Finished compost is decomposed organic material used to improve growing conditions or as part of a suitable planting mix.</p>
          <p>Compost is not automatically a direct replacement for all the soil needed to fill a garden bed.</p>
          <p>For raised beds, the <a href="https://extension.umd.edu/resource/soil-fill-raised-beds" target="_blank" rel="noreferrer">University of Maryland Extension&apos;s soil-filling guide</a> explains that different planting situations may call for different combinations of soil, compost, and soilless growing media.</p>
          <p>If your project involves filling a garden structure rather than adding a compost layer, our <Link href="/calculators/raised-bed-soil-calculator">Raised Bed Soil Calculator</Link> may be more appropriate.</p>

          <h2>How Much Does Compost Cost?</h2>
          <p>Compost prices vary by quality, supplier, packaging, and location.</p>
          <p>Bagged compost is often convenient for small jobs, while bulk compost can be easier for larger areas.</p>
          <p>When comparing supplier quotations, check whether the price covers:</p>
          <ul><li>Compost material</li><li>Delivery</li><li>Minimum order quantities</li><li>Handling or loading</li><li>Applicable taxes</li></ul>
          <p>The Compost Calculator estimates material cost using your entered prices.</p>
          <p>If you&apos;re purchasing bags, cost should use the <strong>whole number of bags required</strong>, not a fractional bag quantity.</p>

          <h2>Common Compost Calculation Mistakes</h2>
          <p>One common mistake is confusing application depth with the depth of soil into which compost will be incorporated.</p>
          <p>For example, a two-inch compost layer mixed into existing soil does not mean the garden requires a two-inch layer plus the entire depth of the existing soil.</p>
          <p>Another error is mixing inches and feet in the volume formula.</p>
          <p>Remember that 12 inches make one foot, and 27 cubic feet make one cubic yard.</p>
          <p>Also, avoid confusing compost volume with compost weight. Different compost products can have different bulk densities.</p>
          <p>Finally, using more compost than necessary is not automatically better. Choose an appropriate rate for the intended use.</p>

          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            <section className={styles.faqItem}><h3>How much compost do I need for 100 square feet?</h3><p>At a two-inch application depth, 100 square feet requires approximately 16.67 cubic feet or 0.62 cubic yards before purchasing allowance.</p></section>
            <section className={styles.faqItem}><h3>How many bags of compost are in a cubic yard?</h3><p>One cubic yard equals 27 cubic feet. That&apos;s 27 one-cubic-foot bags, 18 bags of 1.5 cubic feet, or 14 two-cubic-foot bags when rounded upward.</p></section>
            <section className={styles.faqItem}><h3>How thick should a compost layer be?</h3><p>The appropriate depth depends on whether you&apos;re incorporating compost into soil, top-dressing, or using it as mulch. Follow product guidance and relevant extension recommendations rather than applying one depth to every project.</p></section>
          </div>

          <h2>Final Thoughts</h2>
          <p>Calculating compost requirements before purchasing helps you plan quantities, compare bulk and bagged products, and reduce unnecessary material waste.</p>
          <p>Use our Compost Calculator to estimate cubic feet, cubic yards, bags, and material costs based on your measurements.</p>
          <p>For the best results, choose finished compost suitable for your project and confirm the application depth before ordering.</p>
          <p>The EPA&apos;s compost guidance supports the practical distinction between compost as a soil amendment and compost as mulch.</p>

          <h2>Related calculators</h2>
          <div className={styles.relatedGrid}><Link href="/calculators/garden-bed-dirt-calculator">Garden Bed Dirt Calculator</Link><Link href="/calculators/raised-bed-soil-calculator">Raised Bed Soil Calculator</Link></div>
        </article>
      </main>
    </div>
  );
}
