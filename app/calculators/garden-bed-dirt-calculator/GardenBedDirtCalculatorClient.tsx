"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../material-calculator.module.css";
import { calculateGardenBedDirt, defaultGardenBedDirtInputs, validateGardenBedDirtInputs, type GardenBedDirtInputs } from "@/lib/garden-bed-dirt";
import { formatMaterialNumber, lengthUnits } from "@/lib/material-units";

const description = "Estimate garden bed soil volume in cubic feet, cubic yards, and bags, with an optional bulk material cost.";
const webApplicationData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildCalc Garden Bed Dirt Calculator",
  url: "https://buildcalc.com/calculators/garden-bed-dirt-calculator",
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
    { "@type": "ListItem", position: 3, name: "Garden Bed Dirt Calculator", item: "https://buildcalc.com/calculators/garden-bed-dirt-calculator" },
  ],
};

export default function GardenBedDirtCalculatorClient() {
  const [form, setForm] = useState<GardenBedDirtInputs>(defaultGardenBedDirtInputs);
  const error = useMemo(() => validateGardenBedDirtInputs(form), [form]);
  const result = useMemo(() => error ? null : calculateGardenBedDirt(form), [error, form]);
  const update = <K extends keyof GardenBedDirtInputs>(field: K, value: GardenBedDirtInputs[K]) =>
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
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/calculators">Calculators</Link><span>/</span><span>Garden Bed Dirt Calculator</span></nav>
        <section className={styles.hero}>
          <p className={styles.kicker}>Soil &amp; gardening</p>
          <h1>Garden Bed Dirt Calculator: How Much Soil Do You Need?</h1>
          <p className={styles.intro}>Adding soil to a garden bed? Our free <strong>Garden Bed Dirt Calculator</strong> helps you estimate how many cubic feet, cubic yards, or bags of soil you&apos;ll need.</p>
          <p>Whether you&apos;re refreshing an existing vegetable bed, filling a flower garden, or adding soil to a landscaped area, calculating the right volume before shopping can help you avoid unnecessary trips and leftover material.</p>
          <p>Enter your bed&apos;s length, width, and the depth of soil you want to add in the calculator above. You&apos;ll see the estimated volume, bag quantity, and material cost.</p>
        </section>

        <section className={styles.calculatorCard} aria-label="Garden bed dirt calculator">
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Bed shape</span><select className={styles.shapeSelect} value={form.shape} onChange={(event) => update("shape", event.target.value as GardenBedDirtInputs["shape"])}><option value="rectangle">Rectangle</option><option value="circle">Circle</option></select></label>
            <label className={styles.field}><span>{form.shape === "circle" ? "Radius" : "Length"}</span><div className={styles.inputGroup}><input type="number" min="0" step="any" value={form.length} onChange={(event) => update("length", event.target.value)} /><select aria-label="Length unit" value={form.lengthUnit} onChange={(event) => update("lengthUnit", event.target.value as GardenBedDirtInputs["lengthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
          </div>
          {form.shape === "rectangle" ? <div className={styles.formGrid}><label className={styles.field}><span>Width</span><div className={styles.inputGroup}><input aria-label="Width" type="number" min="0" step="any" value={form.width} onChange={(event) => update("width", event.target.value)} /><select aria-label="Width unit" value={form.widthUnit} onChange={(event) => update("widthUnit", event.target.value as GardenBedDirtInputs["widthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label><p className={styles.note}>For a circular bed, enter its radius. The calculator uses π × radius².</p></div> : null}
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Additional soil depth</span><div className={styles.inputGroup}><input aria-label="Additional soil depth" type="number" min="0" step="any" value={form.depth} onChange={(event) => update("depth", event.target.value)} /><select aria-label="Depth unit" value={form.depthUnit} onChange={(event) => update("depthUnit", event.target.value as GardenBedDirtInputs["depthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div><small className={styles.fieldHint}>Enter the depth of new soil to add, not necessarily the full bed depth.</small></label>
            <label className={styles.field}><span>Number of identical beds</span><div className={styles.inputGroup}><input type="number" min="1" step="1" value={form.bedCount} onChange={(event) => update("bedCount", event.target.value)} /><span className={styles.unitTag}>beds</span></div></label>
          </div>
          <details className={styles.details}>
            <summary>Optional allowance, bags &amp; bulk pricing</summary>
            <div className={styles.detailsContent}>
              <div className={styles.formGrid}>
                <label className={styles.field}><span>Purchasing allowance</span><div className={styles.inputGroup}><input aria-label="Purchasing allowance" type="number" min="0" step="any" value={form.allowance} onChange={(event) => update("allowance", event.target.value)} /><span className={styles.unitTag}>%</span></div><small className={styles.fieldHint}>A planning buffer; it does not predict soil settling.</small></label>
                <label className={styles.field}><span>Bag volume</span><div className={styles.inputGroup}><input aria-label="Bag volume" type="number" min="0" step="any" placeholder="Leave blank to skip" value={form.bagVolume} onChange={(event) => update("bagVolume", event.target.value)} /><span className={styles.unitTag}>ft³ / bag</span></div><small className={styles.fieldHint}>Use the volume printed on the package, not its weight.</small></label>
              </div>
              <div className={styles.formGrid}>
                <label className={styles.field}><span>Bulk soil price (optional)</span><div className={styles.inputGroup}><input aria-label="Bulk soil price per cubic yard" type="number" min="0" step="any" placeholder="Enter supplier quote" value={form.bulkPricePerYard} onChange={(event) => update("bulkPricePerYard", event.target.value)} /><span className={styles.unitTag}>$/yd³</span></div></label>
              </div>
            </div>
          </details>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {result ? <div className={styles.resultPanel} aria-live="polite">
            <div className={styles.resultHeader}><span>Estimated soil to order</span><strong data-testid="garden-bed-order-yard">{formatMaterialNumber(result.orderVolumeCubicYd, 3)} yd³</strong></div>
            <div className={styles.resultGrid}>
              <div className={styles.resultCard}><span>Combined area</span><strong>{formatMaterialNumber(result.areaSqFt)} ft²</strong><small>Across {form.bedCount} bed{form.bedCount === "1" ? "" : "s"}</small></div>
              <div className={styles.resultCard}><span>Base volume</span><strong>{formatMaterialNumber(result.baseVolumeCubicFt)} ft³</strong><small>{formatMaterialNumber(result.baseVolumeCubicYd, 3)} yd³ before allowance</small></div>
              <div className={styles.resultCard}><span>Volume to order</span><strong>{formatMaterialNumber(result.orderVolumeCubicFt)} ft³</strong><small>{formatMaterialNumber(result.orderVolumeCubicM, 3)} m³ including allowance</small></div>
              <div className={styles.resultCard}><span>Purchasing allowance</span><strong>{formatMaterialNumber(result.allowanceVolumeCubicFt)} ft³ extra</strong><small>{form.allowance}% above base volume</small></div>
              {result.bagCount !== null ? <div className={styles.resultCard}><span>Whole bags</span><strong>{formatMaterialNumber(result.bagCount, 0)}</strong><small>At {form.bagVolume} ft³ per bag</small></div> : null}
              <div className={styles.resultCard}><span>Bulk material cost</span><strong>{result.estimatedBulkCost === null ? "Add a supplier quote" : `$${formatMaterialNumber(result.estimatedBulkCost, 2)}`}</strong><small>Based on cubic yards; delivery and taxes excluded</small></div>
            </div>
          </div> : null}
        </section>

        <article className={styles.contentSection}>
          <h2>How to Use the Garden Bed Dirt Calculator</h2>
          <p>Start by measuring the area where you&apos;ll add soil.</p>
          <p>For a rectangular garden bed, enter the length and width. For a circular bed, select the circular option and enter its radius.</p>
          <p>Next, measure the <strong>additional soil depth</strong>, not necessarily the entire depth of the garden bed. If your existing bed needs only three more inches of soil, enter three inches.</p>
          <p>If you have several identical beds, enter the number of beds to calculate their combined requirements.</p>
          <p>You can also specify a waste allowance, choose a bag size, or enter a supplier&apos;s bulk soil price.</p>
          <p>The calculator converts your measurements into the quantities commonly used by US garden centers and landscape suppliers.</p>

          <h2>How Much Dirt Do I Need for My Garden Bed?</h2>
          <p>The amount of soil you need depends on two measurements: the surface area and the thickness of the new layer.</p>
          <p>A large garden bed with a shallow top-up may require less soil than a smaller bed being filled much more deeply.</p>
          <p>The following table shows how much soil is needed for several rectangular beds before any additional allowance.</p>
          <div className={styles.tableWrap}><table><thead><tr><th>Garden bed size</th><th>Added soil depth</th><th>Cubic feet</th><th>Cubic yards</th></tr></thead><tbody><tr><td>4 × 4 ft</td><td>3 inches</td><td>4</td><td>0.15</td></tr><tr><td>4 × 8 ft</td><td>6 inches</td><td>16</td><td>0.59</td></tr><tr><td>6 × 10 ft</td><td>4 inches</td><td>20</td><td>0.74</td></tr><tr><td>10 × 10 ft</td><td>6 inches</td><td>50</td><td>1.85</td></tr></tbody></table></div>
          <p>These values assume level, rectangular areas. Irregular surfaces and uneven fill depths may require additional measurements.</p>

          <h2>Garden Bed Soil Calculator Formula</h2>
          <p>For a rectangular garden bed, calculate volume using:</p>
          <div className={styles.mathBox}><p>Soil Volume = Length × Width × Depth</p></div>
          <p>All three dimensions must use the same measurement unit.</p>
          <p>When length and width are in feet and depth is in inches:</p>
          <div className={styles.mathBox}><p>Cubic Feet = Length (ft) × Width (ft) × Depth (in) ÷ 12</p><p>Cubic Yards = Cubic Feet ÷ 27</p></div>
          <h3>Example: Adding Soil to a 12 × 6-Foot Garden Bed</h3>
          <p>Suppose your garden bed measures 12 feet long and 6 feet wide. You want to add four inches of soil.</p>
          <p>First, calculate the surface area:</p><p>12 × 6 = <strong>72 square feet</strong></p>
          <p>Next, calculate the volume:</p><p>72 × (4 ÷ 12) = <strong>24 cubic feet</strong></p>
          <p>Convert to cubic yards:</p><p>24 ÷ 27 = <strong>0.89 cubic yards</strong></p>
          <p>If you add a 10% purchasing allowance:</p><p>24 × 1.10 = <strong>26.4 cubic feet</strong></p>
          <p>That equals approximately <strong>0.98 cubic yards</strong>.</p>
          <p>If your supplier charges an illustrative $40 per cubic yard, the estimated soil material cost is $39.11 before delivery or supplier rounding.</p>

          <h2>How Many Bags of Garden Soil Do I Need?</h2>
          <p>Bagged garden soil is commonly labeled by volume, such as 1, 1.5, or 2 cubic feet.</p>
          <p>To calculate the number of bags:</p>
          <div className={styles.mathBox}><p>Number of Bags = Total Soil Volume ÷ Bag Volume</p></div>
          <p>Round the result up to the next whole bag.</p>
          <p>Using our previous example, 26.4 cubic feet of soil requires:</p>
          <ul><li>27 bags of 1 cubic foot each</li><li>18 bags of 1.5 cubic feet each</li><li>14 bags of 2 cubic feet each</li></ul>
          <p>Always check the volume printed on the package. A product&apos;s weight in pounds cannot be converted into cubic feet accurately without knowing its bulk density.</p>
          <p>For larger garden projects, bulk soil may be more convenient than purchasing dozens of individual bags. Compare the complete delivered price rather than the material price alone.</p>

          <h2>Garden Soil vs. Fill Dirt: What&apos;s the Difference?</h2>
          <p>Garden soil and construction fill dirt may look similar, but they serve different purposes.</p>
          <p>Fill dirt is primarily used to raise ground levels, fill holes, or support grading projects. Its suitability for growing plants depends on its composition and condition.</p>
          <p>Garden soil should support plant roots, retain appropriate moisture, and allow adequate drainage and aeration.</p>
          <p>The <a href="https://extension.umd.edu/resource/soil-fill-raised-beds" target="_blank" rel="noreferrer">University of Maryland Extension&apos;s guide to filling raised beds</a> explains why existing soil conditions, drainage, and organic matter matter when preparing growing spaces.</p>
          <p>Before buying bulk soil, ask the supplier about its composition and source. For vegetable gardens, consider soil testing when contamination or nutrient conditions are uncertain.</p>

          <h2>Should You Add Compost to Garden Soil?</h2>
          <p>Finished compost can improve many soils by adding organic matter and supporting soil structure.</p>
          <p>However, compost and garden soil are not interchangeable materials. Compost is commonly used as an amendment or as part of a growing mix rather than serving as the entire soil volume in every garden.</p>
          <p>The <a href="https://www.epa.gov/sustainable-management-food/benefits-using-compost" target="_blank" rel="noreferrer">US Environmental Protection Agency explains the benefits of using compost</a>, including its contributions to soil organic matter, moisture retention, and biological activity.</p>
          <p>Choose the amount of compost based on your soil condition, intended plants, and local extension guidance.</p>
          <p>Our <Link href="/calculators/compost-calculator">Compost Calculator</Link> can help estimate a selected compost application depth separately.</p>

          <h2>How Much Does Garden Bed Soil Cost?</h2>
          <p>Garden soil costs depend on the type of material, purchase quantity, location, and supplier.</p>
          <p>Bagged soil may be convenient for small beds, while bulk deliveries can be easier for larger projects.</p>
          <p>When comparing prices, consider:</p>
          <ul><li>The total required soil volume</li><li>Price per bag or cubic yard</li><li>Minimum purchase quantities</li><li>Delivery fees</li><li>Soil quality and intended use</li></ul>
          <p>The Garden Bed Dirt Calculator uses the price you enter, so it does not depend on an outdated national price estimate.</p>
          <p>Remember that the result represents estimated material cost, not the total cost of preparing your garden.</p>

          <h2>Common Garden Bed Soil Calculation Mistakes</h2>
          <p>One common mistake is using the garden bed&apos;s full height rather than the depth of new soil being added.</p>
          <p>Another is mixing inches and feet without converting units. For example, entering a depth of six inches as six feet would greatly overestimate the quantity.</p>
          <p>Also, remember that one cubic yard equals 27 cubic feet, not nine.</p>
          <p>Finally, don&apos;t assume that a larger waste allowance solves every problem. Actual soil requirements can change because of uneven ground, settling, and differences between delivered and installed material.</p>

          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            <section className={styles.faqItem}><h3>How much soil do I need for a 4 × 8 garden bed?</h3><p>At six inches of added depth, a 4 × 8-foot bed needs 16 cubic feet, or approximately 0.59 cubic yards, before any additional allowance.</p></section>
            <section className={styles.faqItem}><h3>How many bags of soil make a cubic yard?</h3><p>One cubic yard contains 27 cubic feet. That equals 27 one-cubic-foot bags, 18 bags of 1.5 cubic feet, or 14 two-cubic-foot bags when rounded upward.</p></section>
            <section className={styles.faqItem}><h3>Can I use fill dirt in a garden bed?</h3><p>Fill dirt may be unsuitable as the main planting medium unless its composition, drainage, and quality are appropriate. Soil intended for growing plants is usually the better starting point.</p></section>
          </div>

          <h2>Final Thoughts</h2>
          <p>The most reliable way to estimate garden soil is to measure the actual area and the depth of soil you need to add.</p>
          <p>Use our Garden Bed Dirt Calculator to convert those measurements into cubic feet, cubic yards, bags, and estimated material costs. Check your supplier&apos;s soil specifications and available purchase sizes before placing an order.</p>

          <h2>Related calculators</h2>
          <div className={styles.relatedGrid}><Link href="/calculators/raised-bed-soil-calculator">Raised Bed Soil Calculator</Link><Link href="/calculators/compost-calculator">Compost Calculator</Link><Link href="/calculators/fill-dirt-calculator">Fill Dirt Calculator</Link></div>
        </article>
      </main>
    </div>
  );
}
