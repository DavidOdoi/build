"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../material-calculator.module.css";
import { calculateLinearFeet, defaultLinearFootInputs, validateLinearFootInputs, type AreaUnit, type LinearFootInputs, type LinearLengthLine } from "@/lib/linear-foot";
import { formatMaterialNumber, lengthUnits, type LengthUnit } from "@/lib/material-units";

const description = "Total multiple lengths, calculate rectangular room perimeter, or convert area using material width. Add waste, optional cost, and a stock-length lower-bound estimate.";
const webApplicationData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildCalc Linear Foot Calculator",
  url: "https://buildcalc.com/calculators/linear-foot-calculator",
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
    { "@type": "ListItem", position: 3, name: "Linear Foot Calculator", item: "https://buildcalc.com/calculators/linear-foot-calculator" },
  ],
};
const areaUnits: { value: AreaUnit; label: string }[] = [
  { value: "ft2", label: "ft²" },
  { value: "in2", label: "in²" },
  { value: "yd2", label: "yd²" },
  { value: "m2", label: "m²" },
  { value: "cm2", label: "cm²" },
];

export default function LinearFootCalculatorClient() {
  const [form, setForm] = useState<LinearFootInputs>(defaultLinearFootInputs);
  const error = useMemo(() => validateLinearFootInputs(form), [form]);
  const result = useMemo(() => error ? null : calculateLinearFeet(form), [error, form]);
  const update = <K extends keyof LinearFootInputs>(field: K, value: LinearFootInputs[K]) =>
    setForm((current) => ({ ...current, [field]: value }));
  const updateLine = <K extends keyof LinearLengthLine>(index: number, field: K, value: LinearLengthLine[K]) =>
    setForm((current) => ({
      ...current,
      lengthLines: current.lengthLines.map((line, lineIndex) =>
        lineIndex === index ? { ...line, [field]: value } : line,
      ),
    }));

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <header className={styles.topbar}>
        <Link href="/" className={styles.brandWrap} aria-label="BuildCalc home"><span className={styles.logo}>B</span><span className={styles.brand}>BuildCalc</span><span className={styles.dot}>.</span></Link>
        <Link href="/calculators" className={styles.headerLink}>All calculators</Link>
      </header>
      <main className={styles.main}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/calculators">Calculators</Link><span>/</span><span>Linear Foot Calculator</span></nav>
        <section className={styles.hero}>
          <p className={styles.kicker}>Length &amp; materials</p>
          <h1>Linear Foot Calculator: Calculate Length and Material Cost</h1>
          <p className={styles.intro}>Need to calculate linear feet for a home improvement or construction project? Our free <strong>Linear Foot Calculator</strong> makes it easy to convert measurements, add multiple lengths, and estimate material quantities.</p>
          <p>Linear feet are commonly used when measuring baseboards, trim, fencing, piping, lumber, and other materials sold by length.</p>
          <p>Enter your dimensions in feet, inches, yards, or meters to calculate the total linear footage. You can also add a waste allowance and supplier price to estimate how much material to purchase.</p>
        </section>

        <section className={styles.calculatorCard} aria-label="Linear foot calculator">
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Calculation mode</span><select className={styles.shapeSelect} value={form.mode} onChange={(event) => update("mode", event.target.value as LinearFootInputs["mode"])}><option value="lengths">Add measured lengths</option><option value="perimeter">Room perimeter</option><option value="area">Area to linear feet</option></select></label>
            <p className={styles.note}>{form.mode === "lengths" ? "Add one or more measured lengths. Each line can use its own unit and quantity." : form.mode === "perimeter" ? "Calculate a rectangular room perimeter, then subtract measured openings." : "Area converts to length only when you provide the material width."}</p>
          </div>

          {form.mode === "lengths" ? <div role="group" aria-label="Measured lengths">
            {form.lengthLines.map((line, index) => <div className={styles.formGrid} key={index}>
              <label className={styles.field}><span>Length {index + 1}</span><div className={styles.inputGroup}><input aria-label={`Length ${index + 1}`} type="number" min="0" step="any" value={line.length} onChange={(event) => updateLine(index, "length", event.target.value)} /><select aria-label={`Length ${index + 1} unit`} value={line.unit} onChange={(event) => updateLine(index, "unit", event.target.value as LengthUnit)}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
              <div><label className={styles.field}><span>Quantity of identical pieces</span><div className={styles.inputGroup}><input aria-label={`Quantity for length ${index + 1}`} type="number" min="1" step="1" value={line.quantity} onChange={(event) => updateLine(index, "quantity", event.target.value)} /><span className={styles.unitTag}>pieces</span></div></label><button className={styles.shapeSelect} type="button" aria-label={`Remove length ${index + 1}`} disabled={form.lengthLines.length <= 1} onClick={() => setForm((current) => ({ ...current, lengthLines: current.lengthLines.filter((_, lineIndex) => lineIndex !== index) }))}>Remove this length</button></div>
            </div>)}
            <button className={styles.shapeSelect} type="button" onClick={() => setForm((current) => ({ ...current, lengthLines: [...current.lengthLines, { length: "8", unit: "ft", quantity: "1" }] }))}>Add another length</button>
          </div> : null}

          {form.mode === "perimeter" ? <>
            <div className={styles.formGrid}>
              <label className={styles.field}><span>Room length</span><div className={styles.inputGroup}><input aria-label="Room length" type="number" min="0" step="any" value={form.roomLength} onChange={(event) => update("roomLength", event.target.value)} /><select aria-label="Room length unit" value={form.roomLengthUnit} onChange={(event) => update("roomLengthUnit", event.target.value as LinearFootInputs["roomLengthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
              <label className={styles.field}><span>Room width</span><div className={styles.inputGroup}><input aria-label="Room width" type="number" min="0" step="any" value={form.roomWidth} onChange={(event) => update("roomWidth", event.target.value)} /><select aria-label="Room width unit" value={form.roomWidthUnit} onChange={(event) => update("roomWidthUnit", event.target.value as LinearFootInputs["roomWidthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
            </div>
            <div className={styles.formGrid}>
              <label className={styles.field}><span>Total measured opening deductions</span><div className={styles.inputGroup}><input aria-label="Opening deductions" type="number" min="0" step="any" placeholder="0" value={form.deductions} onChange={(event) => update("deductions", event.target.value)} /><select aria-label="Opening deductions unit" value={form.deductionUnit} onChange={(event) => update("deductionUnit", event.target.value as LinearFootInputs["deductionUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div><small className={styles.fieldHint}>Add the measured lengths where material will not be installed.</small></label>
              <p className={styles.note}>The perimeter is 2 × (length + width). Deductions cannot exceed that perimeter.</p>
            </div>
          </> : null}

          {form.mode === "area" ? <div className={styles.formGrid}>
            <label className={styles.field}><span>Area</span><div className={styles.inputGroup}><input aria-label="Area" type="number" min="0" step="any" value={form.area} onChange={(event) => update("area", event.target.value)} /><select aria-label="Area unit" value={form.areaUnit} onChange={(event) => update("areaUnit", event.target.value as AreaUnit)}>{areaUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>
            <label className={styles.field}><span>Material width</span><div className={styles.inputGroup}><input aria-label="Material width" type="number" min="0" step="any" value={form.materialWidth} onChange={(event) => update("materialWidth", event.target.value)} /><select aria-label="Material width unit" value={form.materialWidthUnit} onChange={(event) => update("materialWidthUnit", event.target.value as LinearFootInputs["materialWidthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div><small className={styles.fieldHint}>Required to convert area into a linear length.</small></label>
          </div> : null}

          <details className={styles.details}>
            <summary>Optional waste, cost &amp; stock-length estimate</summary>
            <div className={styles.detailsContent}>
              <div className={styles.formGrid}>
                <label className={styles.field}><span>Waste allowance</span><div className={styles.inputGroup}><input aria-label="Waste allowance" type="number" min="0" step="any" value={form.wastePercent} onChange={(event) => update("wastePercent", event.target.value)} /><span className={styles.unitTag}>%</span></div></label>
                <label className={styles.field}><span>Price per linear foot (optional)</span><div className={styles.inputGroup}><input aria-label="Price per linear foot" type="number" min="0" step="any" placeholder="Enter supplier quote" value={form.pricePerFoot} onChange={(event) => update("pricePerFoot", event.target.value)} /><span className={styles.unitTag}>$/ft</span></div></label>
              </div>
              <div className={styles.formGrid}>
                <label className={styles.field}><span>Fixed stock length (optional)</span><div className={styles.inputGroup}><input aria-label="Fixed stock length" type="number" min="0" step="any" placeholder="Skip piece estimate" value={form.stockLength} onChange={(event) => update("stockLength", event.target.value)} /><select aria-label="Stock length unit" value={form.stockLengthUnit} onChange={(event) => update("stockLengthUnit", event.target.value as LinearFootInputs["stockLengthUnit"])}>{lengthUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div><small className={styles.fieldHint}>Piece count based on total footage is only a lower-bound estimate, not a cut-list solution.</small></label>
                <p className={styles.note}>Cost uses adjusted linear footage. Check actual package lengths, cuts, delivery, and taxes with your supplier.</p>
              </div>
            </div>
          </details>

          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {result ? <div className={styles.resultPanel} aria-live="polite">
            <div className={styles.resultHeader}><span>Estimated material length to order</span><strong data-testid="linear-order-feet">{formatMaterialNumber(result.orderLengthFeet, 3)} ft</strong></div>
            <div className={styles.resultGrid}>
              <div className={styles.resultCard}><span>Measured linear length</span><strong>{formatMaterialNumber(result.measuredLengthFeet, 3)} ft</strong><small>{formatMaterialNumber(result.measuredLengthFeet * 0.3048, 3)} m before allowance</small></div>
              {result.perimeterFeet !== null ? <div className={styles.resultCard}><span>Room perimeter</span><strong>{formatMaterialNumber(result.perimeterFeet, 3)} ft</strong><small>{formatMaterialNumber(result.deductionsFeet ?? 0, 3)} ft in measured deductions</small></div> : null}
              {result.areaSquareFeet !== null ? <div className={styles.resultCard}><span>Area and material width</span><strong>{formatMaterialNumber(result.areaSquareFeet, 3)} ft²</strong><small>{formatMaterialNumber(result.materialWidthFeet ?? 0, 3)} ft material width</small></div> : null}
              <div className={styles.resultCard}><span>Waste allowance</span><strong>{formatMaterialNumber(result.wasteLengthFeet, 3)} ft</strong><small>{form.wastePercent}% added to measured length</small></div>
              <div className={styles.resultCard}><span>Estimated material cost</span><strong>{result.estimatedCost === null ? "Add a supplier quote" : `$${formatMaterialNumber(result.estimatedCost, 2)}`}</strong><small>Based on adjusted linear footage</small></div>
              {result.stockPieceLowerBound !== null ? <div className={styles.resultCard}><span>Stock pieces (lower bound)</span><strong>{formatMaterialNumber(result.stockPieceLowerBound, 0)}</strong><small>At {form.stockLength} {form.stockLengthUnit} each; not a cut-layout guarantee</small></div> : null}
            </div>
            <p className={styles.note}>A stock-length count based only on total footage can underestimate pieces required when individual cuts cannot be combined efficiently.</p>
          </div> : null}
        </section>

        <article className={styles.contentSection}>
          <h2>What Is a Linear Foot?</h2>
          <p>A linear foot is simply a measurement of length equal to 12 inches.</p>
          <p>Unlike a square foot, which measures area, a linear foot measures distance in one direction.</p>
          <p>For example, a straight board measuring eight feet long has eight linear feet of length, regardless of whether it is two inches wide or twelve inches wide.</p>
          <p>A square foot measures a two-dimensional area. A cubic foot measures three-dimensional volume.</p>
          <p>These units answer different questions and should not be used interchangeably.</p>

          <h2>How to Use the Linear Foot Calculator</h2>
          <p>Start by choosing how you want to measure your project.</p>
          <p>For a single length, enter the measurement and select its unit.</p>
          <p>For several pieces of material, add each length separately or enter one length along with the number of identical pieces.</p>
          <p>If you&apos;re measuring a rectangular room for baseboards, use the perimeter option to calculate the length around all four walls.</p>
          <p>Where appropriate, subtract door openings or other areas that do not require trim.</p>
          <p>Finally, add an optional material allowance or enter the supplier&apos;s price per linear foot.</p>
          <p>The calculator displays the total measured length, adjusted material quantity, and estimated cost.</p>

          <h2>Linear Foot Calculator Formula</h2>
          <p>For a collection of individual lengths:</p>
          <div className={styles.mathBox}><p>Total Linear Feet = Sum of All Lengths in Feet</p></div>
          <p>For multiple identical pieces:</p>
          <div className={styles.mathBox}><p>Total Linear Feet = Length per Piece × Number of Pieces</p></div>
          <p>For the perimeter of a rectangular room:</p>
          <div className={styles.mathBox}><p>Perimeter = 2 × (Length + Width)</p></div>
          <p>To calculate material purchasing quantity:</p>
          <div className={styles.mathBox}><p>Order Length = Measured Length × (1 + Waste Percentage ÷ 100)</p></div>
          <p>If the supplier sells fixed-length pieces, the number of pieces needed depends on the individual cut lengths and how those cuts can be arranged.</p>
          <p>A simple division by stock length may underestimate purchases when cuts cannot be combined efficiently.</p>

          <h2>Example: Calculating Baseboards for a Room</h2>
          <p>Imagine a rectangular room measuring 15 feet long and 12 feet wide.</p>
          <p>Calculate the perimeter:</p>
          <p>2 × (15 + 12) = <strong>54 linear feet</strong></p>
          <p>Suppose a doorway occupies three feet of wall where no baseboard will be installed.</p>
          <p>54 − 3 = <strong>51 linear feet</strong></p>
          <p>If you include a 10% purchasing allowance:</p>
          <p>51 × 1.10 = <strong>56.1 linear feet</strong></p>
          <p>At an illustrative material price of $2.50 per linear foot:</p>
          <p>56.1 × $2.50 = <strong>$140.25</strong></p>
          <p>This represents a length-based material estimate before supplier stock-length rounding, delivery, labor, and taxes.</p>
          <p>If baseboards are only sold in fixed lengths, the actual purchase quantity may be different.</p>

          <h2>Linear Feet Conversion Table</h2>
          <p>You can convert several common units into linear feet using the following relationships.</p>
          <div className={styles.tableWrap}><table><thead><tr><th>Measurement</th><th>Equivalent linear feet</th></tr></thead><tbody><tr><td>1 inch</td><td>0.08333 ft</td></tr><tr><td>12 inches</td><td>1 ft</td></tr><tr><td>1 yard</td><td>3 ft</td></tr><tr><td>1 meter</td><td>3.28084 ft</td></tr><tr><td>10 meters</td><td>32.8084 ft</td></tr><tr><td>100 inches</td><td>8.3333 ft</td></tr></tbody></table></div>
          <p>To convert inches into feet, divide by 12.</p>
          <p>To convert yards into feet, multiply by three.</p>
          <p>To convert meters into feet, multiply by approximately 3.28084.</p>
          <p>The calculator performs these conversions automatically.</p>

          <h2>How to Calculate Linear Feet for Trim and Molding</h2>
          <p>Trim, crown molding, and baseboards are often measured by the length of the area they need to cover.</p>
          <p>Start by measuring each wall or edge, then add the lengths together.</p>
          <p>For a rectangular room, the perimeter provides a useful starting point.</p>
          <p>However, an actual installation may require adjustments for doors, alcoves, corners, built-ins, and other interruptions.</p>
          <p>The <a href="https://www.homedepot.com/catalog/pdfImages/89/89e93988-ddc7-46af-873c-9f4daacefa20.pdf" target="_blank" rel="noreferrer">Home Depot&apos;s crown molding installation guide</a> recommends measuring total linear footage and accounting for cutting waste.</p>
          <p>It also emphasizes selecting suitable material lengths to reduce unnecessary joints.</p>
          <p>That distinction matters: calculating the total length required doesn&apos;t automatically tell you the most efficient combination of boards to buy.</p>

          <h2>Linear Feet vs. Square Feet</h2>
          <p>One of the most common measurement mistakes is confusing linear feet with square feet.</p>
          <p>Linear feet measure distance, while square feet measure area.</p>
          <p>For example, a board that is 10 feet long and one foot wide covers 10 square feet.</p>
          <p>A board that is 10 feet long and six inches wide covers five square feet.</p>
          <p>Both boards have the same linear length but different areas.</p>
          <p>For a rectangular material with constant width:</p>
          <div className={styles.mathBox}><p>Square Feet = Linear Feet × Width in Feet</p></div>
          <p>If the width is in inches:</p>
          <div className={styles.mathBox}><p>Square Feet = Linear Feet × Width in Inches ÷ 12</p></div>
          <p>To convert a known area back into linear feet, you must also know the material width.</p>
          <div className={styles.mathBox}><p>Linear Feet = Square Feet ÷ Width in Feet</p></div>
          <p>Without the width, there is no unique conversion between square feet and linear feet.</p>

          <h2>How to Calculate Material Cost per Linear Foot</h2>
          <p>Some construction materials are priced by the linear foot.</p>
          <p>The basic cost formula is:</p>
          <div className={styles.mathBox}><p>Material Cost = Purchased Linear Feet × Price per Linear Foot</p></div>
          <p>If you need 80 linear feet of material at $3 per foot, the material estimate is:</p>
          <p>80 × $3 = <strong>$240</strong></p>
          <p>Remember that actual purchases can depend on stock lengths and packaging.</p>
          <p>For instance, suppliers may sell molding in individual 8-foot, 12-foot, or 16-foot pieces instead of arbitrary fractional lengths.</p>
          <p>Check whether the quoted price applies to exact footage, whole pieces, or a package.</p>
          <p>The <a href="https://www.homedepot.com/b/Moulding-Millwork-Moulding/N-5yc1vZara1" target="_blank" rel="noreferrer">Home Depot&apos;s molding catalog</a> illustrates the range of trim products and lengths that buyers may encounter.</p>

          <h2>Common Linear Foot Calculation Mistakes</h2>
          <p>A frequent mistake is calculating only one wall when the project requires measuring an entire room perimeter.</p>
          <p>Another is failing to subtract openings where the material will not be installed.</p>
          <p>People also confuse linear footage with square footage, particularly when estimating flooring or wall panels.</p>
          <p>Finally, purchasing allowances and stock-length requirements are not the same thing. A 10% allowance may be a reasonable planning estimate, but it cannot guarantee an efficient cutting layout.</p>
          <p>For projects involving several short and long pieces, a cut list and stock-length optimizer may be more accurate than a basic linear-foot estimate.</p>

          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            <section className={styles.faqItem}><h3>How many inches are in one linear foot?</h3><p>One linear foot equals 12 inches. Linear feet and ordinary feet measure the same unit of length.</p></section>
            <section className={styles.faqItem}><h3>How do I calculate linear feet for a room?</h3><p>Add the lengths of the walls or edges requiring material. For a rectangular room, start with 2 × (length + width), then account for any sections where material is not needed.</p></section>
            <section className={styles.faqItem}><h3>Can I convert square feet into linear feet?</h3><p>Yes, but only if you know the width of the material. Divide the area in square feet by the width in feet to calculate the required linear length.</p></section>
          </div>

          <h2>Final Thoughts</h2>
          <p>Linear feet are straightforward once you separate length from area and volume.</p>
          <p>Use our Linear Foot Calculator to total measurements, convert units, account for purchasing allowances, and estimate costs.</p>
          <p>For materials sold in fixed lengths, verify available sizes and cutting requirements before placing your order.</p>
          <p>The length-based purchasing discussion is supported by actual trim installation guidance and retailer listings that distinguish stock lengths from linear-foot prices.</p>

          <h2>Related calculators</h2>
          <div className={styles.relatedGrid}><Link href="/calculators/stud-calculator">Stud Calculator</Link><Link href="/calculators/rafter-calculator">Rafter Calculator</Link></div>
        </article>
      </main>
    </div>
  );
}
