"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../material-calculator.module.css";
import { calculateStuds, defaultStudInputs, validateStudInputs, type StudInputs } from "@/lib/stud";
import { formatMaterialNumber, lengthUnits } from "@/lib/material-units";

const description = "Estimate basic wall stud counts using length and on-center spacing, then add user-specified framing, waste, and optional material cost.";
const webApplicationData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildCalc Stud Calculator",
  url: "https://buildcalc.com/calculators/stud-calculator",
  description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};
const breadcrumbData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://buildcalc.com/" },
    { "@type": "ListItem", position: 2, name: "Calculators", item: "https://buildcalc.com/calculators" },
    { "@type": "ListItem", position: 3, name: "Stud Calculator", item: "https://buildcalc.com/calculators/stud-calculator" },
  ],
};

export default function StudCalculatorClient() {
  const [form, setForm] = useState<StudInputs>(defaultStudInputs);
  const error = useMemo(() => validateStudInputs(form), [form]);
  const result = useMemo(() => error ? null : calculateStuds(form), [error, form]);
  const update = <K extends keyof StudInputs>(field: K, value: StudInputs[K]) =>
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
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/calculators">Calculators</Link><span>/</span><span>Stud Calculator</span></nav>
        <section className={styles.hero}>
          <p className={styles.kicker}>Wall framing estimate</p>
          <h1>Stud Calculator: How Many Studs Do You Need for a Wall?</h1>
          <p className={styles.intro}>Building an interior partition or planning a wood-framed wall? Our free <strong>Stud Calculator</strong> helps estimate how many vertical studs you need based on wall length and spacing.</p>
          <p>Enter your wall dimensions, choose a spacing such as 16 or 24 inches on center, and calculate the initial stud count. You can also include an allowance for additional framing around corners and openings.</p>
          <p>This calculator is designed for preliminary material estimating. It does not determine whether a proposed wall is structurally adequate.</p>
        </section>

        <section className={styles.calculatorCard} aria-label="Stud calculator">
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Wall length</span><div className={styles.inputGroup}><input aria-label="Wall length" type="number" min="0" step="any" value={form.wallLength} onChange={(event) => update("wallLength", event.target.value)} /><select aria-label="Wall length unit" value={form.wallLengthUnit} onChange={(event) => update("wallLengthUnit", event.target.value as StudInputs["wallLengthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
            <label className={styles.field}><span>Stud spacing</span><select className={styles.shapeSelect} value={form.spacingMode} onChange={(event) => update("spacingMode", event.target.value as StudInputs["spacingMode"])}><option value="16">16 inches on center</option><option value="24">24 inches on center</option><option value="custom">Custom spacing</option></select></label>
          </div>
          {form.spacingMode === "custom" ? <div className={styles.formGrid}><label className={styles.field}><span>Custom stud spacing</span><div className={styles.inputGroup}><input aria-label="Custom stud spacing" type="number" min="0" step="any" value={form.customSpacingInches} onChange={(event) => update("customSpacingInches", event.target.value)} /><span className={styles.unitTag}>inches OC</span></div></label><p className={styles.note}>On-center spacing is measured from the center of one stud to the center of the next.</p></div> : null}
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Wall height (context only)</span><div className={styles.inputGroup}><input aria-label="Wall height" type="number" min="0" step="any" value={form.wallHeight} onChange={(event) => update("wallHeight", event.target.value)} /><select aria-label="Wall height unit" value={form.wallHeightUnit} onChange={(event) => update("wallHeightUnit", event.target.value as StudInputs["wallHeightUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div><small className={styles.fieldHint}>Shown for project context; it does not change this simplified count.</small></label>
            <label className={styles.field}><span>Identical uninterrupted wall segments</span><div className={styles.inputGroup}><input aria-label="Number of wall segments" type="number" min="1" step="1" value={form.segmentCount} onChange={(event) => update("segmentCount", event.target.value)} /><span className={styles.unitTag}>segments</span></div></label>
          </div>
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Additional studs from project drawings</span><div className={styles.inputGroup}><input aria-label="Additional framing studs" type="number" min="0" step="1" value={form.additionalStuds} onChange={(event) => update("additionalStuds", event.target.value)} /><span className={styles.unitTag}>studs</span></div><small className={styles.fieldHint}>Enter separately estimated corner, opening, or intersection framing. No arbitrary extras are assumed.</small></label>
            <label className={styles.field}><span>Purchasing allowance</span><div className={styles.inputGroup}><input aria-label="Waste allowance" type="number" min="0" step="any" value={form.wastePercent} onChange={(event) => update("wastePercent", event.target.value)} /><span className={styles.unitTag}>%</span></div></label>
          </div>
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Supplier price per stud (optional)</span><div className={styles.inputGroup}><input aria-label="Price per stud" type="number" min="0" step="any" placeholder="Enter supplier quote" value={form.pricePerStud} onChange={(event) => update("pricePerStud", event.target.value)} /><span className={styles.unitTag}>$/stud</span></div></label>
            <p className={styles.note}>This is a material count, not a framing schedule or structural design.</p>
          </div>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {result ? <div className={styles.resultPanel} aria-live="polite">
            <div className={styles.resultHeader}><span>Estimated studs to purchase</span><strong data-testid="stud-purchase-count">{formatMaterialNumber(result.purchaseCount, 0)}</strong></div>
            <div className={styles.resultGrid}>
              <div className={styles.resultCard}><span>Basic stud count</span><strong>{formatMaterialNumber(result.baseStudCount, 0)}</strong><small>At {result.spacingInches} in. on center, across {form.segmentCount} segment{form.segmentCount === "1" ? "" : "s"}</small></div>
              <div className={styles.resultCard}><span>Additional framing</span><strong>{formatMaterialNumber(result.additionalStuds, 0)}</strong><small>Entered from your drawings or framing schedule</small></div>
              <div className={styles.resultCard}><span>Total before waste</span><strong>{formatMaterialNumber(result.totalBeforeWaste, 0)}</strong><small>Basic count plus specified extra studs</small></div>
              <div className={styles.resultCard}><span>Waste quantity</span><strong>{formatMaterialNumber(result.wasteQuantity, 0)}</strong><small>{form.wastePercent}% allowance, rounded up to whole studs</small></div>
              <div className={styles.resultCard}><span>Wall height context</span><strong>{formatMaterialNumber(result.wallHeightFeet, 2)} ft</strong><small>Does not affect the simplified stud count</small></div>
              <div className={styles.resultCard}><span>Stud-only material cost</span><strong>{result.estimatedCost === null ? "Add a supplier quote" : `$${formatMaterialNumber(result.estimatedCost, 2)}`}</strong><small>Based on purchased stud count; plates, headers, delivery, and labor excluded</small></div>
            </div>
            <p className={styles.note}>The basic estimate assumes a straight uninterrupted wall with a stud at each end. It does not establish structural adequacy or count unentered framing details.</p>
          </div> : null}
        </section>

        <article className={styles.contentSection}>
          <h2>How to Use the Stud Calculator</h2>
          <p>Start by entering the wall length. You can use feet, inches, or metric measurements.</p>
          <p>Next, choose the stud spacing. The spacing is measured <strong>on center</strong>, which means from the center of one stud to the center of the next.</p>
          <p>For a simple uninterrupted wall, our calculator assumes a stud at each end and places intermediate studs so that the spacing does not exceed the selected distance.</p>
          <p>Choose 16 inches or 24 inches on center, or enter a custom spacing.</p>
          <p>If your project contains doors, windows, special corners, or intersecting walls, add the known extra framing members separately.</p>
          <p>Finally, enter an optional waste allowance and your supplier&apos;s price per stud.</p>
          <p>The calculator will show the basic stud count, additional framing allowance, total estimated studs, and material cost.</p>

          <h2>Stud Calculator Formula</h2>
          <p>For a straightforward wall with one stud at each end:</p>
          <div className={styles.mathBox}><p>Stud Count = Ceiling(Wall Length ÷ Stud Spacing) + 1</p></div>
          <p>Both measurements must use the same units.</p>
          <p>For a wall length entered in feet and spacing entered in inches:</p>
          <div className={styles.mathBox}><p>Stud Count = Ceiling((Wall Length × 12) ÷ Spacing) + 1</p></div>
          <p>This approach ensures the calculated center-to-center gaps don&apos;t exceed the selected spacing.</p>
          <p>It assumes an uninterrupted, straight wall with regular framing. It doesn&apos;t automatically include all the additional members used around doors, windows, and complex wall intersections.</p>

          <h2>Example: Studs for a 20-Foot Wall</h2>
          <p>Suppose you&apos;re constructing a 20-foot-long partition wall.</p>
          <p>You choose 16-inch on-center spacing.</p>
          <p>Convert the wall length into inches:</p>
          <p>20 × 12 = <strong>240 inches</strong></p>
          <p>Divide by the stud spacing:</p>
          <p>240 ÷ 16 = <strong>15 spaces</strong></p>
          <p>Add one end stud:</p>
          <p>15 + 1 = <strong>16 studs</strong></p>
          <p>The initial estimate is therefore <strong>16 studs</strong>.</p>
          <p>If you add a 10% purchasing allowance:</p>
          <p>16 × 1.10 = 17.6</p>
          <p>Round upward to <strong>18 studs</strong>.</p>
          <p>At an illustrative $5 per stud, the estimated stud-only material cost would be $90.</p>
          <p>Additional studs may be required for corners, openings, and other framing details.</p>

          <h2>Stud Count by Wall Length</h2>
          <p>The following table estimates studs for simple, uninterrupted walls. Each wall has a stud at both ends.</p>
          <div className={styles.tableWrap}><table><thead><tr><th>Wall length</th><th>16 in. on center</th><th>24 in. on center</th></tr></thead><tbody><tr><td>8 ft</td><td>7</td><td>5</td></tr><tr><td>10 ft</td><td>9</td><td>6</td></tr><tr><td>12 ft</td><td>10</td><td>7</td></tr><tr><td>16 ft</td><td>13</td><td>9</td></tr><tr><td>20 ft</td><td>16</td><td>11</td></tr></tbody></table></div>
          <p>The quantities shown exclude waste, additional framing members, and openings.</p>

          <h2>What Does 16 Inches on Center Mean?</h2>
          <p>When studs are spaced 16 inches on center, the measurement is taken from the centerline of one stud to the centerline of the next.</p>
          <p>It is not the clear distance between the wooden members.</p>
          <p>The <a href="https://awc.org/resources/wood-products/wall/lumber-studs/" target="_blank" rel="noreferrer">American Wood Council&apos;s guide to lumber studs</a> describes studs as vertical framing members and explains that 16-inch spacing is common in exterior walls.</p>
          <p>Other spacing arrangements may be permitted under particular structural and sheathing conditions.</p>
          <p>For an actual building project, stud spacing must comply with the applicable design and building code—not simply whichever option produces the lowest material count.</p>

          <h2>Should You Use 16-Inch or 24-Inch Stud Spacing?</h2>
          <p>Both spacing patterns appear in wood-framed construction, but they are not universally interchangeable.</p>
          <p>Spacing affects the number of studs, attachment points for interior finishes, insulation cavities, and the structural design of the wall.</p>
          <p>At 16 inches on center, a 20-foot uninterrupted wall needs approximately 16 studs under the calculator&apos;s simplified counting method.</p>
          <p>At 24 inches on center, the same wall needs approximately 11.</p>
          <p>Although 24-inch spacing uses fewer studs, whether it&apos;s appropriate depends on the wall&apos;s height, loading, lumber size and grade, sheathing, and governing code requirements.</p>
          <p>The <a href="https://awc.org/codes-and-standards/wood-frame-construction-manual/" target="_blank" rel="noreferrer">American Wood Council&apos;s Wood Frame Construction resources</a> provide a more appropriate basis for structural framing decisions.</p>

          <h2>How Many Extra Studs Are Needed Around Doors and Windows?</h2>
          <p>Doors and windows interrupt the regular wall-framing layout.</p>
          <p>Openings may require additional members such as king studs, jack or trimmer studs, cripple studs, and headers.</p>
          <p>Their arrangement depends on the opening size, whether the wall carries loads, and the framing design.</p>
          <p>A simple perimeter-length calculator cannot reliably determine every extra member.</p>
          <p>For that reason, BuildCalc lets you enter a separately estimated count of additional studs. This count should come from the project drawings or an appropriate framing schedule.</p>
          <p>Do not assume every door or window needs the same number of extra members.</p>

          <h2>Stud Length and Lumber Size</h2>
          <p>The number of studs and the length of each stud are different calculations.</p>
          <p>For example, a wall with a nominal eight-foot height doesn&apos;t necessarily use eight-foot studs cut to exactly that length.</p>
          <p>Bottom plates, top plates, floor conditions, and framing details affect the required cut length.</p>
          <p>Likewise, the choice between nominal 2×4 and 2×6 lumber depends on the project&apos;s intended construction.</p>
          <p>This calculator estimates stud quantities and basic material cost. It does not replace a framing schedule or approved plans.</p>

          <h2>Common Stud Estimation Mistakes</h2>
          <p>One common mistake is confusing 16 inches on center with 16 inches of open space between studs.</p>
          <p>Another is forgetting the end studs in a wall segment.</p>
          <p>Some users also calculate the wall&apos;s total square footage when the basic stud-count formula only requires its length and the spacing.</p>
          <p>However, wall height remains relevant when selecting material lengths and checking the framing design.</p>
          <p>Finally, don&apos;t treat a waste allowance as a substitute for counting additional framing around doors, windows, or corners.</p>

          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            <section className={styles.faqItem}><h3>How many studs are needed for a 10-foot wall?</h3><p>Using the calculator&apos;s simplified method, a 10-foot wall requires nine studs at 16-inch spacing, including one stud at each end.</p></section>
            <section className={styles.faqItem}><h3>How many studs are needed for a 20-foot wall?</h3><p>An uninterrupted 20-foot wall needs 16 studs at 16 inches on center, before additional framing and waste.</p></section>
            <section className={styles.faqItem}><h3>Does stud spacing affect structural safety?</h3><p>Yes. Stud spacing is one part of structural wall design. Appropriate spacing depends on loads, wall geometry, lumber properties, sheathing, and applicable building requirements.</p></section>
          </div>

          <h2>Final Thoughts</h2>
          <p>A Stud Calculator is a useful way to estimate material quantities before buying framing lumber.</p>
          <p>Measure the wall length, enter the planned spacing, account for additional framing from your drawings, and add a reasonable purchasing allowance.</p>
          <p>For load-bearing walls and regulated construction, follow approved plans and relevant building codes rather than relying on a simple material estimate.</p>
          <p>The structural distinctions follow the American Wood Council&apos;s explanations of studs, spacing, wall construction, and framing conditions.</p>

          <h2>Related calculators</h2>
          <div className={styles.relatedGrid}><Link href="/calculators/rafter-calculator">Rafter Calculator</Link><Link href="/calculators/linear-foot-calculator">Linear Foot Calculator</Link></div>
        </article>
      </main>
    </div>
  );
}
