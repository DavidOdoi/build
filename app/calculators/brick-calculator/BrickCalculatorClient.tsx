'use client';

import { useMemo, useState } from "react";
import styles from "./page.module.css";
import { calculateBrick, defaultBrickInputs, formatNumber, type BrickInputs, validateBrickInputs } from "@/lib/brick";

const faqItems = [
  {
    question: "How many bricks do I need per square foot?",
    answer:
      "A standard modular estimate using the default documented rate is about 6.75 bricks per square foot. Custom brick sizes can vary, so the calculator recalculates coverage based on actual face dimensions and mortar joints when you switch to custom brick mode.",
  },
  {
    question: "How many bricks do I need for a 10-foot wall?",
    answer:
      "For a 10-foot-long wall at 8 feet tall, the gross wall area is 80 square feet. With no openings and a 10% allowance, the default modular estimate is about 540 bricks before waste, or 594 bricks to order.",
  },
  {
    question: "Should I buy extra bricks for breakage?",
    answer:
      "Yes. A waste allowance is recommended because cuts, chips, damaged units, and varying mortar joints all reduce usable brick. The default 10% allowance is a practical starting point, and you can increase it for difficult layouts or tight color matching.",
  },
];

const unitOptions = [
  { value: "ft", label: "ft" },
  { value: "m", label: "m" },
  { value: "yd", label: "yd" },
  { value: "in", label: "in" },
  { value: "cm", label: "cm" },
];

const brickPresetOptions = [
  { value: "us-modular", label: "US modular" },
  { value: "custom", label: "Custom brick" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildCalc Brick Calculator",
  url: "https://buildcalc.com/calculators/brick-calculator",
  description:
    "Free brick calculator to estimate bricks needed for a wall, account for openings, and calculate waste and material cost.",
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
    { "@type": "ListItem", position: 3, name: "Brick Calculator", item: "https://buildcalc.com/calculators/brick-calculator" },
  ],
};

export default function BrickCalculatorClient() {
  const [form, setForm] = useState<BrickInputs>(defaultBrickInputs());
  const [showAdvanced, setShowAdvanced] = useState(false);

  const validationError = useMemo(() => validateBrickInputs(form), [form]);
  const result = useMemo(() => {
    if (validationError) return null;
    return calculateBrick(form);
  }, [form, validationError]);

  const updateField = <K extends keyof BrickInputs>(field: K, value: BrickInputs[K]) => {
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
          <span>Brick Calculator</span>
        </nav>

        <section className={styles.hero}>
          <p className={styles.kicker}>Masonry & construction</p>
          <h1>Brick Calculator</h1>
          <p className={styles.intro}>
            Estimate how many bricks you need for a wall, subtract openings, apply waste, and compare your material cost before ordering.
          </p>
        </section>

        <section className={styles.calculatorCard}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Wall length</span>
              <div className={styles.inputGroup}>
                <input aria-label="Wall length" type="number" min="0" step="any" value={form.length} onChange={(e) => updateField("length", e.target.value)} />
                <select aria-label="Wall length unit" value={form.lengthUnit} onChange={(e) => updateField("lengthUnit", e.target.value as BrickInputs["lengthUnit"])}>
                  {unitOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </label>

            <label className={styles.field}>
              <span>Wall height</span>
              <div className={styles.inputGroup}>
                <input aria-label="Wall height" type="number" min="0" step="any" value={form.height} onChange={(e) => updateField("height", e.target.value)} />
                <select aria-label="Wall height unit" value={form.heightUnit} onChange={(e) => updateField("heightUnit", e.target.value as BrickInputs["heightUnit"])}>
                  {unitOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Brick type</span>
              <div className={styles.inputGroup}>
                <select aria-label="Brick type" value={form.brickPreset} onChange={(e) => updateField("brickPreset", e.target.value as BrickInputs["brickPreset"])}>
                  {brickPresetOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <span className={styles.unitTag}>{form.brickPreset === "us-modular" ? "6.75/ft²" : "Custom"}</span>
              </div>
            </label>

            <label className={styles.field}>
              <span>Waste allowance</span>
              <div className={styles.inputGroup}>
                <input aria-label="Waste allowance" type="number" min="0" step="any" value={form.waste} onChange={(e) => updateField("waste", e.target.value)} />
                <span className={styles.unitTag}>%</span>
              </div>
            </label>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Layers / wythes</span>
              <div className={styles.inputGroup}>
                <input aria-label="Layers" type="number" min="1" step="any" value={form.layers} onChange={(e) => updateField("layers", e.target.value)} />
                <span className={styles.unitTag}>layers</span>
              </div>
            </label>

            <label className={styles.field}>
              <span>Price per brick</span>
              <div className={styles.inputGroup}>
                <input aria-label="Price per brick" type="number" min="0" step="any" value={form.price} onChange={(e) => updateField("price", e.target.value)} />
                <span className={styles.unitTag}>USD</span>
              </div>
            </label>
          </div>

          <button type="button" className={styles.advancedToggle} onClick={() => setShowAdvanced((state) => !state)}>
            {showAdvanced ? "Hide advanced inputs" : "Show advanced inputs"}
          </button>

          {showAdvanced ? (
            <div className={styles.advancedSection}>
              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Brick length</span>
                  <div className={styles.inputGroup}>
                    <input aria-label="Brick length" type="number" min="0" step="any" value={form.brickLength} onChange={(e) => updateField("brickLength", e.target.value)} />
                    <span className={styles.unitTag}>in</span>
                  </div>
                </label>

                <label className={styles.field}>
                  <span>Brick height</span>
                  <div className={styles.inputGroup}>
                    <input aria-label="Brick height" type="number" min="0" step="any" value={form.brickHeight} onChange={(e) => updateField("brickHeight", e.target.value)} />
                    <span className={styles.unitTag}>in</span>
                  </div>
                </label>
              </div>

              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Mortar joint</span>
                  <div className={styles.inputGroup}>
                    <input aria-label="Mortar joint" type="number" min="0" step="any" value={form.mortarJoint} onChange={(e) => updateField("mortarJoint", e.target.value)} />
                    <span className={styles.unitTag}>in</span>
                  </div>
                </label>

                <label className={styles.field}>
                  <span>Opening unit</span>
                  <div className={styles.inputGroup}>
                    <select aria-label="Opening unit" value={form.openingUnit} onChange={(e) => updateField("openingUnit", e.target.value as BrickInputs["openingUnit"])}>
                      {unitOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <span className={styles.unitTag}>for openings</span>
                  </div>
                </label>
              </div>

              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Windows</span>
                  <div className={styles.inputGroup}>
                    <input aria-label="Windows count" type="number" min="0" step="any" value={form.windowsCount} onChange={(e) => updateField("windowsCount", e.target.value)} />
                    <span className={styles.unitTag}>count</span>
                  </div>
                </label>

                <label className={styles.field}>
                  <span>Window size</span>
                  <div className={styles.inputGroup}>
                    <input aria-label="Window width" type="number" min="0" step="any" value={form.windowWidth} onChange={(e) => updateField("windowWidth", e.target.value)} />
                    <input aria-label="Window height" type="number" min="0" step="any" value={form.windowHeight} onChange={(e) => updateField("windowHeight", e.target.value)} />
                  </div>
                </label>
              </div>

              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Doors</span>
                  <div className={styles.inputGroup}>
                    <input aria-label="Doors count" type="number" min="0" step="any" value={form.doorsCount} onChange={(e) => updateField("doorsCount", e.target.value)} />
                    <span className={styles.unitTag}>count</span>
                  </div>
                </label>

                <label className={styles.field}>
                  <span>Door size</span>
                  <div className={styles.inputGroup}>
                    <input aria-label="Door width" type="number" min="0" step="any" value={form.doorWidth} onChange={(e) => updateField("doorWidth", e.target.value)} />
                    <input aria-label="Door height" type="number" min="0" step="any" value={form.doorHeight} onChange={(e) => updateField("doorHeight", e.target.value)} />
                  </div>
                </label>
              </div>
            </div>
          ) : null}

          {validationError ? <p className={styles.error} role="alert">{validationError}</p> : null}

          {result ? (
            <div className={styles.resultPanel}>
              <div className={styles.resultHeader}>
                <span>Bricks to order</span>
                <strong data-testid="ordered-bricks">{formatNumber(result.orderBricks, 0)} bricks</strong>
              </div>

              <div className={styles.resultGrid}>
                <div className={styles.resultCard}>
                  <span>Net wall area</span>
                  <strong>{formatNumber(result.netAreaSqFt, 2)} ft²</strong>
                  <small>Gross {formatNumber(result.grossAreaSqFt, 2)} ft²</small>
                </div>
                <div className={styles.resultCard}>
                  <span>Before waste</span>
                  <strong>{formatNumber(result.baseBricks, 2)} bricks</strong>
                  <small>{formatNumber(result.bricksPerSquareFoot, 2)} bricks/ft²</small>
                </div>
                <div className={styles.resultCard}>
                  <span>Waste added</span>
                  <strong>{formatNumber(result.wasteBricks, 2)} bricks</strong>
                  <small>{formatNumber(result.mortarJointIn, 3)} in mortar</small>
                </div>
                <div className={styles.resultCard}>
                  <span>Estimated brick material cost</span>
                  <strong>${formatNumber(result.estimatedBrickCost, 2)}</strong>
                  <small>{formatNumber(result.moduleLengthIn, 3)} × {formatNumber(result.moduleHeightIn, 3)} in</small>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className={styles.contentSection}>
          <h2>How to use the Brick Calculator</h2>
          <p>
            Start with the full wall dimensions, then subtract any windows or doors that will not be covered by brick. The calculator uses the wall length, wall height, and your selected brick format to estimate the number of units needed, then adds a waste allowance to cover cuts, chips, and imperfect pieces. For most residential walls, a 10% allowance is a practical planning baseline, but more complex masonry layouts may require more.
          </p>
          <p>
            The difference between wall dimensions and brick dimensions matters. A 20-foot wall at 8 feet tall has a gross area of 160 square feet, but a 3-by-7-foot door removes 21 square feet from that total. Once net area is known, the calculator converts that value into bricks using the selected estimating rate and the chosen layer count. This is why the calculator asks for both wall size and brick size: the same wall can require a different brick count depending on unit size, mortar joint, and how many wythes are being built.
          </p>

          <h2>How many bricks do I need?</h2>
          <p>
            The brick quantity estimate starts with wall area and ends with brick coverage. A default modular method uses a documented estimating rate of 6.75 bricks per square foot, which matches the rate used in many masonry takeoffs for standard wall work. If you switch to custom brick mode, the calculator uses the actual face length, face height, and mortar joint you enter to calculate coverage by formula instead of relying on a generic rule of thumb.
          </p>

          <div className={styles.mathBox}>
            <p>Gross area = Wall length × Wall height</p>
            <p>Net area = Gross area − Opening area</p>
            <p>Base bricks = Net area × Bricks per ft² × Layers</p>
            <p>Order bricks = Ceiling(Base bricks × (1 + waste / 100))</p>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Wall size</th>
                <th>Openings</th>
                <th>Bricks per ft²</th>
                <th>Base bricks</th>
                <th>Order quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>20 ft × 8 ft</td>
                <td>None</td>
                <td>6.75</td>
                <td>1,080</td>
                <td>1,188</td>
              </tr>
              <tr>
                <td>20 ft × 8 ft</td>
                <td>3 ft × 7 ft opening</td>
                <td>6.75</td>
                <td>938.25</td>
                <td>1,033</td>
              </tr>
            </tbody>
          </table>

          <h2>Brick Calculator Formula</h2>
          <p>
            For rectangular wall estimates, the formula is simple: determine gross area, subtract opening area, and multiply by the brick coverage rate for the selected masonry format. In the software, the default modular preset uses a documented rate of 6.75 bricks per square foot so the estimate aligns with established field estimating practices. If you switch to custom brick mode, the formula changes to reflect actual face dimensions plus mortar joint thickness.
          </p>
          <p>
            The mortar joint is important because the effective unit size is not just the brick itself. A 7⅝-inch brick with a ⅜-inch mortar joint covers roughly 8 inches in length and 2⅝ inches in height, which changes the actual number of units needed per square foot. Omitting the joint from the estimate undercounts the material and creates a shortage on site. For example, using the documented default rate, a 20-foot by 8-foot wall with no openings and a 10% allowance needs 1,188 bricks to order.
          </p>

          <h2>How many bricks are in a square foot?</h2>
          <p>
            The answer depends on brick size, mortar joint, and bond pattern. A standard modular unit that covers about 21 square inches of face area with a ⅜-inch mortar bed yields roughly 6.86 bricks per square foot using the actual face dimensions formula. The default BuildCalc preset uses a documented estimating rate of 6.75 bricks per square foot to stay aligned with common field estimating tables rather than mixing methods. This is the same reason the calculator clearly distinguishes the default modular preset from custom brick input: different brick dimensions and joints produce different coverage rates.
          </p>
          <p>
            For project planning, this is more than a technical note. It means one brick style can be more efficient than another, and it also explains why a wall can need more or fewer units than a simple square-foot estimate suggests. The <a href="https://www.gobrick.com/resources/technical-notes" target="_blank" rel="noreferrer">Brick Industry Association Technical Notes</a> and the <a href="https://www.masoncontractors.org/" target="_blank" rel="noreferrer">Masonry Contractors Association of America</a> are useful references when checking unit dimensions, mortar assumptions, and product-specific layout guidance.
          </p>

          <h2>Common brick sizes in the United States</h2>
          <p>
            The most common brick formats in US masonry include modular, standard, and larger face brick units. Designers and suppliers often refer to nominal dimensions even when the actual brick size differs slightly after accounting for mortar joints. For example, an “8-inch modular” unit does not always mean the actual brick itself is 8 inches wide; it often reflects a nominal sizing system that includes the mortar joint and the intended bond. This is why the calculator includes both a default modular preset and a custom brick mode: the project team should match the selected unit to the actual brick being used before buying material.
          </p>
          <p>
            The Brick Industry Association is the best starting point for understanding typical modular dimensions and how mortar joints affect visible coverage. That reference matters because a small difference in unit height or joint thickness changes the total number of bricks needed for a wall and may affect the palette or coursing pattern as well.
          </p>

          <h2>How to estimate brick wall cost</h2>
          <p>
            Brick wall cost should be estimated in stages. Start with the number of bricks to order, then multiply by the price per brick to calculate estimated brick material cost. Do not treat that figure as the full installed cost because it excludes mortar, delivery, cutting, reinforcement, scaffolding, and labor. Waste is also a real cost item, and it is included here through the allowance percentage so you can plan for breakage, cuts, and site handling losses.
          </p>
          <p>
            The calculator labels the result as estimated brick material cost specifically, which keeps the output honest and avoids combining material cost with labor or installation charges. If your project requires arches, returns, or decorative bond patterns, those can materially affect the final brick count and should be verified before ordering a full pallet or truckload.
          </p>

          <h2>Common mistakes when estimating bricks</h2>
          <ul>
            <li>Forgetting to subtract door and window openings from the wall area.</li>
            <li>Using the wrong unit size or mortar thickness when the wall is designed with a different brick module.</li>
            <li>Underestimating waste for cuts, corners, and breakage on a complex wall face.</li>
            <li>Assuming all brick styles have the same coverage rate without checking the actual face dimensions.</li>
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

          <h2>Final thoughts</h2>
          <p>
            A brick estimate is only as good as the measurements and assumptions behind it. Always verify the project wall dimensions, opening sizes, selected brick format, and mortar thickness before ordering. The calculator is a planning tool, not a substitute for supplier verification or a detailed takeoff for highly detailed masonry work. If the wall includes corners, arches, soldier courses, or special color matching, confirm your order with the brick supplier before placing the final purchase.
          </p>

          <h2>Related calculators</h2>
          <div className={styles.relatedGrid}>
            <a href="/calculators/sand-calculator">Sand Calculator</a>
            <a href="/calculators/asphalt-calculator">Asphalt Calculator</a>
            <a href="/calculators">All Calculators</a>
            <a href="/categories">Categories</a>
          </div>
        </section>
      </main>
    </div>
  );
}
