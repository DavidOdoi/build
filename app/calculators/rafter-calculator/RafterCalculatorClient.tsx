"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../material-calculator.module.css";
import { calculateRafter, defaultRafterInputs, validateRafterInputs, type RafterInputs } from "@/lib/rafter";
import { formatMaterialNumber, lengthUnits } from "@/lib/material-units";

const description = "Estimate roof run, rise, common rafter-line length, roof angle, and horizontal overhang geometry. This tool does not size structural rafters.";
const webApplicationData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildCalc Rafter Calculator",
  url: "https://buildcalc.com/calculators/rafter-calculator",
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
    { "@type": "ListItem", position: 3, name: "Rafter Calculator", item: "https://buildcalc.com/calculators/rafter-calculator" },
  ],
};

export default function RafterCalculatorClient() {
  const [form, setForm] = useState<RafterInputs>(defaultRafterInputs);
  const error = useMemo(() => validateRafterInputs(form), [form]);
  const result = useMemo(() => error ? null : calculateRafter(form), [error, form]);
  const update = <K extends keyof RafterInputs>(field: K, value: RafterInputs[K]) =>
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
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/calculators">Calculators</Link><span>/</span><span>Rafter Calculator</span></nav>
        <section className={styles.hero}>
          <p className={styles.kicker}>Roof geometry</p>
          <h1>Rafter Calculator: Calculate Roof Rafter Length, Pitch &amp; Rise</h1>
          <p className={styles.intro}>Planning a roof framing project? Our free <strong>Rafter Calculator</strong> helps you estimate common rafter length from a roof&apos;s horizontal run and pitch.</p>
          <p>You can calculate the sloped distance from the wall line toward the ridge, estimate the effect of a roof overhang, and convert roof pitch into an angle.</p>
          <p>Whether you&apos;re measuring a small shed roof, preparing a material estimate, or checking your roof geometry, this calculator provides a practical starting point.</p>
          <p className={styles.note}><strong>Important:</strong> The results describe roof geometry. They do not establish whether a rafter size, spacing, connection, or roof structure is safe.</p>
        </section>

        <section className={styles.calculatorCard} aria-label="Rafter calculator">
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Input reference</span><select className={styles.shapeSelect} value={form.dimensionMode} onChange={(event) => update("dimensionMode", event.target.value as RafterInputs["dimensionMode"])}><option value="run">One side&apos;s horizontal run</option><option value="span">Full symmetrical gable span</option></select></label>
            <label className={styles.field}><span>{form.dimensionMode === "span" ? "Roof span" : "Horizontal run"}</span><div className={styles.inputGroup}><input aria-label={form.dimensionMode === "span" ? "Roof span" : "Horizontal run"} type="number" min="0" step="any" value={form.horizontalLength} onChange={(event) => update("horizontalLength", event.target.value)} /><select aria-label="Run or span unit" value={form.lengthUnit} onChange={(event) => update("lengthUnit", event.target.value as RafterInputs["lengthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div><small className={styles.fieldHint}>{form.dimensionMode === "span" ? "The span is divided into two equal horizontal runs." : "Enter one side's horizontal distance to the ridge reference."}</small></label>
          </div>
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Pitch rise per 12 inches of run</span><div className={styles.inputGroup}><input aria-label="Pitch rise per 12 inches" type="number" min="0" step="any" value={form.pitchRise} onChange={(event) => update("pitchRise", event.target.value)} /><span className={styles.unitTag}>:12</span></div><small className={styles.fieldHint}>For a 6:12 roof, enter 6. This is pitch, not degrees.</small></label>
            <label className={styles.field}><span>Horizontal eave overhang (optional)</span><div className={styles.inputGroup}><input aria-label="Horizontal eave overhang" type="number" min="0" step="any" placeholder="0" value={form.horizontalOverhang} onChange={(event) => update("horizontalOverhang", event.target.value)} /><select aria-label="Overhang unit" value={form.overhangUnit} onChange={(event) => update("overhangUnit", event.target.value as RafterInputs["overhangUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
          </div>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {result ? <div className={styles.resultPanel} aria-live="polite">
            <div className={styles.resultHeader}><span>Theoretical sloped length including overhang</span><strong data-testid="rafter-total-length">{formatMaterialNumber(result.totalSlopedLengthFeet, 3)} ft</strong></div>
            <div className={styles.resultGrid}>
              <div className={styles.resultCard}><span>Horizontal run</span><strong>{formatMaterialNumber(result.runFeet, 3)} ft</strong><small>{formatMaterialNumber(result.runFeet * 0.3048, 3)} m</small></div>
              <div className={styles.resultCard}><span>Roof rise</span><strong>{formatMaterialNumber(result.riseFeet, 3)} ft</strong><small>{formatMaterialNumber(result.riseFeet * 0.3048, 3)} m at {form.pitchRise}:12 pitch</small></div>
              <div className={styles.resultCard}><span>Rafter-line length before overhang</span><strong>{formatMaterialNumber(result.rafterLineFeet, 3)} ft</strong><small>{formatMaterialNumber(result.rafterLineFeet * 0.3048, 3)} m · geometry only</small></div>
              <div className={styles.resultCard}><span>Roof angle</span><strong>{formatMaterialNumber(result.roofAngleDegrees, 3)}°</strong><small>Above horizontal</small></div>
              <div className={styles.resultCard}><span>Horizontal overhang</span><strong>{formatMaterialNumber(result.horizontalOverhangFeet, 3)} ft</strong><small>Measured projection</small></div>
              <div className={styles.resultCard}><span>Sloped overhang contribution</span><strong>{formatMaterialNumber(result.slopedOverhangFeet, 3)} ft</strong><small>Added to the basic rafter line</small></div>
            </div>
            <p className={styles.note}>These are theoretical roof-line dimensions, not final lumber cut lengths, structural spans, or rafter-size recommendations. Ridge deductions, bearing details, cuts, and framing specifications are not included.</p>
          </div> : null}
        </section>

        <article className={styles.contentSection}>
          <h2>How to Use the Rafter Calculator</h2>
          <p>Start by entering your roof&apos;s horizontal run. This is the horizontal distance between the outside wall reference point and the roof&apos;s centerline or ridge reference point.</p>
          <p>If you know the full span of a symmetrical gable roof instead, enter the span and select the option to divide it into two equal runs.</p>
          <p>Next, enter the roof pitch. A 6:12 pitch means the roof rises six inches vertically for every 12 inches of horizontal travel.</p>
          <p>You can also add a horizontal eave overhang if you want to calculate the theoretical sloped length extending beyond the wall.</p>
          <p>The calculator will display the rise, roof angle, basic rafter-line length, and extended length when an overhang is entered.</p>

          <h2>Rafter Length Calculator Formula</h2>
          <p>A common roof rafter forms the sloping side of a right triangle.</p>
          <p>The horizontal side is the run, and the vertical side is the rise.</p>
          <p>Using the Pythagorean theorem:</p>
          <div className={styles.mathBox}><p>Rafter Length = √(Run² + Rise²)</p></div>
          <p>When roof pitch is expressed as inches of rise per 12 inches of horizontal run:</p>
          <div className={styles.mathBox}><p>Rise = Run × (Pitch ÷ 12)</p></div>
          <p>For a 6:12 roof:</p>
          <p>Rise = Run × 0.5</p>
          <p>You can also calculate the roof angle:</p>
          <div className={styles.mathBox}><p>Roof Angle = arctan(Pitch ÷ 12)</p></div>
          <p>For a 6:12 roof, the angle is approximately 26.57 degrees.</p>
          <p>The geometric length does not automatically account for ridge-board thickness, birdsmouth cuts, bearing details, or field cutting allowances.</p>

          <h2>Rafter Length Calculation Example</h2>
          <p>Suppose a symmetrical gable roof spans 24 feet between its wall reference lines.</p>
          <p>The roof pitch is 6:12.</p>
          <p>First, calculate one side&apos;s horizontal run:</p>
          <p>24 ÷ 2 = <strong>12 feet</strong></p>
          <p>Calculate the rise:</p>
          <p>12 × (6 ÷ 12) = <strong>6 feet</strong></p>
          <p>Now calculate the sloped length:</p>
          <p>√(12² + 6²) = √180</p>
          <p><strong>Rafter-line length = 13.42 feet</strong></p>
          <p>That is approximately 13 feet 5 inches when rounded to the nearest inch.</p>
          <p>This is the theoretical distance along the sloped roof line from the wall reference to the ridge centerline. It is not a final cut length.</p>

          <h2>How Roof Pitch Affects Rafter Length</h2>
          <p>For the same horizontal run, a steeper roof has a longer rafter line.</p>
          <p>Consider a roof with a 12-foot horizontal run.</p>
          <div className={styles.tableWrap}><table><thead><tr><th>Roof pitch</th><th>Approximate rafter-line length</th></tr></thead><tbody><tr><td>3:12</td><td>12.37 ft</td></tr><tr><td>4:12</td><td>12.65 ft</td></tr><tr><td>6:12</td><td>13.42 ft</td></tr><tr><td>8:12</td><td>14.42 ft</td></tr><tr><td>12:12</td><td>16.97 ft</td></tr></tbody></table></div>
          <p>These are geometric measurements before ridge deductions, overhangs, and other construction adjustments.</p>

          <h2>How to Calculate a Rafter Overhang</h2>
          <p>A roof overhang is often described using its horizontal projection beyond the exterior wall.</p>
          <p>If the horizontal overhang is two feet and the roof pitch is 6:12, the additional sloped length is:</p>
          <p>√(2² + 1²) = <strong>2.24 feet</strong></p>
          <p>Adding that to the 13.42-foot rafter line from the previous example gives approximately <strong>15.65 feet</strong>.</p>
          <p>This represents the theoretical continuous sloped length from the ridge reference to the overhang endpoint.</p>
          <p>Actual rafter tail details, fascia alignment, ridge connections, and bearing cuts must be handled separately.</p>

          <h2>Rafter Length vs. Rafter Span</h2>
          <p>A common mistake is assuming that the calculated sloped rafter length equals its structural span.</p>
          <p>They aren&apos;t necessarily the same measurement.</p>
          <p>The <a href="https://awc.org/resources/wood-products/roof/lumber-rafters/" target="_blank" rel="noreferrer">American Wood Council&apos;s rafter guidance</a> describes rafters as inclined structural members supporting roof loads.</p>
          <p>Structural span measurements and allowable sizes depend on support conditions, lumber grade and species, loading, spacing, and applicable building codes.</p>
          <p>The American Wood Council also publishes <a href="https://awc.org/publications/" target="_blank" rel="noreferrer">span tables for joists and rafters</a>, which provide a more appropriate starting point for structural design requirements.</p>
          <p>Our calculator doesn&apos;t determine structural capacity.</p>

          <h2>Ridge Boards and Rafter Connections</h2>
          <p>The ridge is the upper junction where opposing roof slopes meet.</p>
          <p>In some roof systems, a ridge board acts as a connection and nailing surface, while a structural ridge beam carries loads through a different support arrangement.</p>
          <p>These should not be treated as interchangeable.</p>
          <p>The <a href="https://awc.org/resources/wood-products/roof/lumber-ridge-boards/" target="_blank" rel="noreferrer">American Wood Council&apos;s explanation of ridge boards</a> distinguishes their role in traditional wood roof framing.</p>
          <p>Actual cutting layouts depend on the ridge member, framing arrangement, building plans, and connection details.</p>
          <p>Use the calculator for preliminary geometric estimation, not for specifying structural connections.</p>

          <h2>Common Rafter Calculation Mistakes</h2>
          <p>One mistake is entering the full roof span when the tool expects one side&apos;s run. This can produce a much longer result than intended.</p>
          <p>Another is confusing pitch with degrees. A 6:12 roof does not have a six-degree slope.</p>
          <p>Overhangs can also cause errors when their dimensions are measured along the roof instead of horizontally.</p>
          <p>Finally, ordering lumber using only the geometric length can result in pieces that are too short for the required cuts and details.</p>
          <p>Check your project drawings and construction requirements before purchasing.</p>

          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            <section className={styles.faqItem}><h3>How long is a rafter for a 24-foot span and 6:12 pitch?</h3><p>For a symmetrical gable roof with a 12-foot run, the theoretical rafter-line length is approximately 13.42 feet before ridge adjustments or overhang.</p></section>
            <section className={styles.faqItem}><h3>What is the angle of a 6:12 roof?</h3><p>A 6:12 roof pitch corresponds to an angle of approximately 26.57 degrees above horizontal.</p></section>
            <section className={styles.faqItem}><h3>Does the Rafter Calculator determine the correct lumber size?</h3><p>No. It calculates roof geometry. Lumber size and allowable span require structural design information, including loads, supports, spacing, grade, species, and local code requirements.</p></section>
          </div>

          <h2>Final Thoughts</h2>
          <p>Our Rafter Calculator is useful for estimating roof geometry, comparing pitches, and understanding how overhangs affect length.</p>
          <p>Before construction, check the actual roof plans, ridge details, cutting requirements, and structural specifications. A geometric estimate should never replace an approved roof framing design.</p>
          <p>This article draws a necessary distinction between roof geometry and structural capacity, consistent with the American Wood Council&apos;s framing guidance.</p>

          <h2>Related calculators</h2>
          <div className={styles.relatedGrid}><Link href="/calculators/stud-calculator">Stud Calculator</Link><Link href="/calculators/linear-foot-calculator">Linear Foot Calculator</Link></div>
        </article>
      </main>
    </div>
  );
}
