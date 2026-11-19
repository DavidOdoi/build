"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../material-calculator.module.css";
import { calculateRaisedBedSoil, defaultRaisedBedSoilInputs, validateRaisedBedSoilInputs, type RaisedBedSoilInputs } from "@/lib/raised-bed-soil";
import { formatMaterialNumber, lengthUnits } from "@/lib/material-units";

const description = "Calculate raised garden bed soil volume, cubic yards, bag quantities, and optional ingredient mix estimates.";
const webApplicationData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildCalc Raised Bed Soil Calculator",
  url: "https://buildcalc.com/calculators/raised-bed-soil-calculator",
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
    { "@type": "ListItem", position: 3, name: "Raised Bed Soil Calculator", item: "https://buildcalc.com/calculators/raised-bed-soil-calculator" },
  ],
};

export default function RaisedBedSoilCalculatorClient() {
  const [form, setForm] = useState<RaisedBedSoilInputs>(defaultRaisedBedSoilInputs);
  const error = useMemo(() => validateRaisedBedSoilInputs(form), [form]);
  const result = useMemo(() => error ? null : calculateRaisedBedSoil(form), [error, form]);
  const update = <K extends keyof RaisedBedSoilInputs>(field: K, value: RaisedBedSoilInputs[K]) =>
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
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/calculators">Calculators</Link><span>/</span><span>Raised Bed Soil Calculator</span></nav>
        <section className={styles.hero}>
          <p className={styles.kicker}>Soil &amp; gardening</p>
          <h1>Raised Bed Soil Calculator: How Much Soil Do You Need?</h1>
          <p className={styles.intro}>Building a raised garden bed? Our free <strong>Raised Bed Soil Calculator</strong> helps you determine how much growing medium you&apos;ll need to fill it.</p>
          <p>Instead of guessing how many bags to buy, enter the bed&apos;s length, width, and planned fill depth. The calculator estimates total volume in cubic feet and cubic yards, converts that quantity into bags, and helps you plan an optional soil mix.</p>
          <p>You can also calculate the requirements for multiple raised beds and estimate material costs using your supplier&apos;s prices.</p>
        </section>

        <section className={styles.calculatorCard} aria-label="Raised bed soil calculator">
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Interior length</span><div className={styles.inputGroup}><input aria-label="Interior length" type="number" min="0" step="any" value={form.length} onChange={(event) => update("length", event.target.value)} /><select aria-label="Length unit" value={form.lengthUnit} onChange={(event) => update("lengthUnit", event.target.value as RaisedBedSoilInputs["lengthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
            <label className={styles.field}><span>Interior width</span><div className={styles.inputGroup}><input aria-label="Interior width" type="number" min="0" step="any" value={form.width} onChange={(event) => update("width", event.target.value)} /><select aria-label="Width unit" value={form.widthUnit} onChange={(event) => update("widthUnit", event.target.value as RaisedBedSoilInputs["widthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
          </div>
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Interior bed height</span><div className={styles.inputGroup}><input aria-label="Interior bed height" type="number" min="0" step="any" value={form.bedHeight} onChange={(event) => update("bedHeight", event.target.value)} /><select aria-label="Bed height unit" value={form.bedHeightUnit} onChange={(event) => update("bedHeightUnit", event.target.value as RaisedBedSoilInputs["bedHeightUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
            <label className={styles.field}><span>Planned fill depth</span><div className={styles.inputGroup}><input aria-label="Planned fill depth" type="number" min="0" step="any" value={form.depth} onChange={(event) => update("depth", event.target.value)} /><select aria-label="Fill depth unit" value={form.depthUnit} onChange={(event) => update("depthUnit", event.target.value as RaisedBedSoilInputs["depthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div><small className={styles.fieldHint}>Cannot exceed the interior height.</small></label>
          </div>
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Number of identical beds</span><div className={styles.inputGroup}><input type="number" min="1" step="1" value={form.bedCount} onChange={(event) => update("bedCount", event.target.value)} /><span className={styles.unitTag}>beds</span></div></label>
          </div>
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Purchasing allowance</span><div className={styles.inputGroup}><input aria-label="Purchasing allowance" type="number" min="0" step="any" value={form.allowance} onChange={(event) => update("allowance", event.target.value)} /><span className={styles.unitTag}>%</span></div></label>
            <label className={styles.field}><span>Bag volume</span><div className={styles.inputGroup}><input aria-label="Bag volume" type="number" min="0" step="any" value={form.bagVolume} onChange={(event) => update("bagVolume", event.target.value)} /><span className={styles.unitTag}>ft³ / bag</span></div><small className={styles.fieldHint}>Use each product&apos;s stated volume.</small></label>
          </div>
          <label className={styles.field}><span><input type="checkbox" checked={form.mixEnabled} onChange={(event) => update("mixEnabled", event.target.checked)} /> Calculate a custom soil mix</span></label>
          {form.mixEnabled ? <div className={styles.formGrid}>
            <label className={styles.field}><span>Growing soil portion</span><div className={styles.inputGroup}><input aria-label="Growing soil percentage" type="number" min="0" max="100" step="any" value={form.growingSoilPercent} onChange={(event) => update("growingSoilPercent", event.target.value)} /><span className={styles.unitTag}>%</span></div><small className={styles.fieldHint}>Optional price per whole bag: <span className={styles.inputGroup}><input aria-label="Growing soil price per bag" type="number" min="0" step="any" placeholder="Supplier price" value={form.growingSoilPricePerBag} onChange={(event) => update("growingSoilPricePerBag", event.target.value)} /><span className={styles.unitTag}>$/bag</span></span></small></label>
            <label className={styles.field}><span>Compost portion</span><div className={styles.inputGroup}><input aria-label="Compost percentage" type="number" min="0" max="100" step="any" value={form.compostPercent} onChange={(event) => update("compostPercent", event.target.value)} /><span className={styles.unitTag}>%</span></div><small className={styles.fieldHint}>Optional price per whole bag: <span className={styles.inputGroup}><input aria-label="Compost price per bag" type="number" min="0" step="any" placeholder="Supplier price" value={form.compostPricePerBag} onChange={(event) => update("compostPricePerBag", event.target.value)} /><span className={styles.unitTag}>$/bag</span></span></small></label>
          </div> : <div className={styles.formGrid}>
            <label className={styles.field}><span>Growing soil price per bag (optional)</span><div className={styles.inputGroup}><input aria-label="Growing soil price per bag" type="number" min="0" step="any" placeholder="Enter supplier quote" value={form.growingSoilPricePerBag} onChange={(event) => update("growingSoilPricePerBag", event.target.value)} /><span className={styles.unitTag}>$/bag</span></div></label>
            <p className={styles.note}>For a mix, enter ingredient percentages that total 100%. Bag costs are calculated using whole bags.</p>
          </div>}
          {form.mixEnabled ? <p className={styles.note}>Ingredient percentages must total 100%. Bag quantities are rounded up separately for each ingredient.</p> : null}
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {result ? <div className={styles.resultPanel} aria-live="polite">
            <div className={styles.resultHeader}><span>Estimated growing medium to order</span><strong data-testid="raised-bed-order-yard">{formatMaterialNumber(result.orderVolumeCubicYd, 3)} yd³</strong></div>
            <div className={styles.resultGrid}>
              <div className={styles.resultCard}><span>Combined bed area</span><strong>{formatMaterialNumber(result.totalAreaSqFt)} ft²</strong><small>{form.bedCount} bed{form.bedCount === "1" ? "" : "s"}</small></div>
              <div className={styles.resultCard}><span>Base volume</span><strong>{formatMaterialNumber(result.baseVolumeCubicFt)} ft³</strong><small>{formatMaterialNumber(result.baseVolumeCubicYd, 3)} yd³ before allowance</small></div>
              <div className={styles.resultCard}><span>Adjusted volume</span><strong>{formatMaterialNumber(result.orderVolumeCubicFt)} ft³</strong><small>{formatMaterialNumber(result.orderVolumeCubicM, 3)} m³ including allowance</small></div>
              {form.mixEnabled ? <>
                <div className={styles.resultCard}><span>Growing soil</span><strong>{formatMaterialNumber(result.growingSoilVolumeCubicFt ?? 0)} ft³</strong><small>{result.growingSoilBagCount === null ? "Enter bag volume for count" : `${formatMaterialNumber(result.growingSoilBagCount, 0)} whole bags at ${form.bagVolume} ft³ each`}</small></div>
                <div className={styles.resultCard}><span>Compost</span><strong>{formatMaterialNumber(result.compostVolumeCubicFt ?? 0)} ft³</strong><small>{result.compostBagCount === null ? "Enter bag volume for count" : `${formatMaterialNumber(result.compostBagCount, 0)} whole bags at ${form.bagVolume} ft³ each`}</small></div>
              </> : <div className={styles.resultCard}><span>Whole bags</span><strong>{result.totalBagCount === null ? "Enter bag volume" : formatMaterialNumber(result.totalBagCount, 0)}</strong><small>At {form.bagVolume} ft³ per bag</small></div>}
              <div className={styles.resultCard}><span>Estimated material cost</span><strong>{result.estimatedCost === null ? "Add bag prices" : `$${formatMaterialNumber(result.estimatedCost, 2)}`}</strong><small>Uses whole bags; delivery and taxes excluded</small></div>
            </div>
            <p className={styles.note}>An allowance is a purchasing buffer, not a prediction of settling. The actual combined volume can change when materials are blended.</p>
          </div> : null}
        </section>

        <article className={styles.contentSection}>
          <h2>How Much Soil Do I Need for a Raised Bed?</h2>
          <p>The amount depends on the interior dimensions of your raised bed and how deep you plan to fill it.</p>
          <p>For a rectangular raised bed, multiply length by width by fill depth.</p>
          <p>For example, an eight-foot-long, four-foot-wide bed filled to a depth of one foot requires:</p>
          <p>8 × 4 × 1 = <strong>32 cubic feet</strong></p>
          <p>That is approximately 1.19 cubic yards.</p>
          <p>If you fill the same bed to a depth of 18 inches, the required volume increases to 48 cubic feet.</p>
          <p>Here are examples for common rectangular raised beds.</p>
          <div className={styles.tableWrap}><table><thead><tr><th>Bed size</th><th>Fill depth</th><th>Soil required</th></tr></thead><tbody><tr><td>4 × 4 ft</td><td>12 inches</td><td>16 ft³</td></tr><tr><td>4 × 8 ft</td><td>12 inches</td><td>32 ft³</td></tr><tr><td>4 × 8 ft</td><td>18 inches</td><td>48 ft³</td></tr><tr><td>4 × 8 ft</td><td>24 inches</td><td>64 ft³</td></tr><tr><td>4 × 10 ft</td><td>18 inches</td><td>60 ft³</td></tr></tbody></table></div>
          <p>All figures are before any purchasing allowance.</p>
          <p>Be sure to measure the actual inside dimensions. Thick wooden sides or internal structures can reduce the available soil volume.</p>

          <h2>How to Use Our Raised Bed Soil Calculator</h2>
          <p>Start with the raised bed&apos;s interior length and width.</p>
          <p>Enter its total height, then specify the depth to which you intend to add soil. These values may differ if you&apos;re only partially filling the bed.</p>
          <p>If you&apos;re creating several identical beds, enter their number.</p>
          <p>Next, choose whether you want to calculate total growing medium or break it down into separate ingredients.</p>
          <p>For a custom soil mix, enter the percentage allocated to each component. The percentages must total 100%.</p>
          <p>The calculator can then show the required volume of each ingredient, along with the number of bags to purchase.</p>
          <p>If you know the supplier&apos;s prices, enter them to estimate the material cost.</p>

          <h2>Raised Bed Soil Calculator Formula</h2>
          <p>The volume of a rectangular raised bed is calculated as:</p>
          <div className={styles.mathBox}><p>Soil Volume = Length × Width × Fill Depth</p></div>
          <p>Use the same measurement units for each dimension.</p>
          <p>For dimensions entered in feet and inches:</p>
          <div className={styles.mathBox}><p>Cubic Feet = Length (ft) × Width (ft) × Fill Depth (in) ÷ 12</p><p>Cubic Yards = Cubic Feet ÷ 27</p></div>
          <p>For multiple identical raised beds:</p>
          <div className={styles.mathBox}><p>Total Volume = One Bed&apos;s Volume × Number of Beds</p></div>
          <h3>Example: Filling an 8 × 4-Foot Raised Bed</h3>
          <p>Suppose your raised bed measures eight feet long and four feet wide, with an intended soil depth of 18 inches.</p>
          <p>First, convert 18 inches into feet:</p><p>18 ÷ 12 = 1.5 feet</p>
          <p>Calculate the bed volume:</p><p>8 × 4 × 1.5 = <strong>48 cubic feet</strong></p>
          <p>Convert to cubic yards:</p><p>48 ÷ 27 = <strong>1.78 cubic yards</strong></p>
          <p>If you add a 10% purchasing allowance:</p><p>48 × 1.10 = <strong>52.8 cubic feet</strong></p>
          <p>That equals approximately <strong>1.96 cubic yards</strong>.</p>
          <p>The allowance is optional. It provides a simple purchasing buffer, not a guarantee against soil settling or volume changes.</p>

          <h2>How Many Bags of Soil Do I Need?</h2>
          <p>Bagged growing media are usually sold with their volume printed on the packaging.</p>
          <p>To calculate the number of bags:</p>
          <div className={styles.mathBox}><p>Bags Required = Total Volume ÷ Volume per Bag</p></div>
          <p>Always round upward to a whole bag.</p>
          <p>For the previous example, with 52.8 cubic feet to purchase:</p>
          <ul><li>1-cubic-foot bags: 53 bags</li><li>1.5-cubic-foot bags: 36 bags</li><li>2-cubic-foot bags: 27 bags</li></ul>
          <p>For several large raised beds, a bulk growing-medium delivery may be more practical than purchasing individual bags.</p>
          <p>Compare material quality, purchase quantity, and delivery charges before deciding.</p>

          <h2>What Is the Best Soil Mix for Raised Garden Beds?</h2>
          <p>A suitable raised-bed growing medium should support plant roots while allowing water movement and adequate aeration.</p>
          <p>There isn&apos;t one ideal recipe for every raised bed.</p>
          <p>A bed constructed directly over healthy garden soil may need different materials from a container-style bed placed over pavement.</p>
          <p>The <a href="https://extension.umd.edu/resource/soil-fill-raised-beds" target="_blank" rel="noreferrer">University of Maryland Extension&apos;s soil-filling guide</a> describes different approaches based on the existing soil, drainage, and whether the bed is placed over a hard surface.</p>
          <p>For example, its guidance discusses combining compost with soil or soilless growing media under different site conditions.</p>
          <p>Compost contributes organic matter, while other growing-medium ingredients provide the physical properties needed for root growth.</p>
          <p>You can use our calculator&apos;s custom mix feature to estimate the quantities for a recipe you&apos;ve selected.</p>
          <h3>Example Soil-Mix Calculation</h3>
          <p>Suppose your order volume is 52.8 cubic feet and you want to estimate an illustrative mix of:</p>
          <ul><li>60% growing soil</li><li>40% compost</li></ul>
          <p>The required volumes would be:</p>
          <p><strong>Growing soil:</strong> 52.8 × 0.60 = 31.68 cubic feet</p>
          <p><strong>Compost:</strong> 52.8 × 0.40 = 21.12 cubic feet</p>
          <p>With two-cubic-foot bags, that would mean purchasing 16 bags of growing soil and 11 bags of compost.</p>
          <p>This is a purchasing example, not a universal recommendation that every raised bed should contain 40% compost. Confirm an appropriate mix for your plants and site conditions.</p>
          <p>The actual combined volume can also change when different materials are blended.</p>

          <h2>How Deep Should a Raised Garden Bed Be?</h2>
          <p>Suitable depth depends on what you&apos;re growing and whether roots can grow into the soil beneath the raised bed.</p>
          <p>A raised bed placed directly over healthy garden soil may allow roots to extend beyond the surrounding frame.</p>
          <p>A raised bed constructed over concrete or another impermeable surface does not provide the same access to deeper soil.</p>
          <p>The <a href="https://extension.umd.edu/resource/growing-vegetables-raised-beds" target="_blank" rel="noreferrer">University of Maryland Extension&apos;s guide to growing vegetables in raised beds</a> discusses these differences and provides crop-related depth considerations.</p>
          <p>When planning your bed, consider the crop, drainage, underlying surface, and available growing-medium depth.</p>
          <p>Do not choose a fill depth based solely on the height of the wooden frame.</p>

          <h2>How Much Does Raised Bed Soil Cost?</h2>
          <p>Costs depend on the amount of growing medium required, the chosen ingredients, and whether you purchase bags or bulk material.</p>
          <p>For a custom soil mix, calculate the cost of each ingredient separately.</p>
          <p>For example, if you purchase 16 bags of one ingredient at $8 per bag and 11 bags of another at $6 per bag:</p>
          <p>(16 × $8) + (11 × $6) = <strong>$194</strong></p>
          <p>This illustrative cost excludes delivery, bed construction, tools, and labor.</p>
          <p>Use actual supplier quotations for a realistic estimate.</p>

          <h2>Common Raised Bed Soil Mistakes</h2>
          <p>One mistake is measuring the outside dimensions instead of the interior volume.</p>
          <p>Another is confusing total frame height with the intended fill depth.</p>
          <p>Users also sometimes overlook the number of identical beds or forget to convert inches into feet.</p>
          <p>When planning soil mixes, check that the component percentages total 100%. Avoid assuming one recipe is appropriate for every crop or site.</p>
          <p>Finally, check whether bags are sold by volume or weight. The calculator&apos;s bag-count calculations require a known bag volume.</p>

          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            <section className={styles.faqItem}><h3>How much soil do I need for an 8 × 4 raised bed?</h3><p>An 8 × 4-foot raised bed requires 32 cubic feet at a 12-inch fill depth or 48 cubic feet at an 18-inch fill depth, before any allowance.</p></section>
            <section className={styles.faqItem}><h3>How many bags of soil fill a raised garden bed?</h3><p>Divide the required cubic feet by each bag&apos;s stated cubic-foot volume and round upward. For example, 48 cubic feet requires 24 two-cubic-foot bags without an extra allowance.</p></section>
            <section className={styles.faqItem}><h3>Can I use regular garden soil in a raised bed?</h3><p>Garden soil may be suitable as part of a raised-bed mix, depending on its quality, drainage, and the underlying surface. Review the soil conditions before selecting a growing medium.</p></section>
          </div>

          <h2>Final Thoughts</h2>
          <p>Accurate measurements make filling a raised garden bed easier and help avoid unnecessary purchases.</p>
          <p>Use the Raised Bed Soil Calculator to determine total volume, compare bag sizes, estimate mix ingredients, and plan material costs.</p>
          <p>Before ordering, confirm that your chosen growing medium suits the location and plants you intend to grow.</p>
          <p>The soil-mix guidance here follows the distinctions in the University of Maryland Extension&apos;s raised-bed resources.</p>

          <h2>Related calculators</h2>
          <div className={styles.relatedGrid}><Link href="/calculators/garden-bed-dirt-calculator">Garden Bed Dirt Calculator</Link><Link href="/calculators/compost-calculator">Compost Calculator</Link></div>
        </article>
      </main>
    </div>
  );
}
