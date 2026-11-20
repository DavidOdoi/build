import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AsphaltCalculatorClient from "./AsphaltCalculatorClient";
import styles from "./page.module.css";

const path = "/calculators/asphalt-calculator";
const url = `https://buildcalc.com${path}`;
const title = "Asphalt Calculator: Estimate Tonnage & Material Cost";
const description =
  "Use this asphalt calculator to estimate US short tons and material cost from your paving area, compacted thickness, mix density, and order allowance.";
const measurementImage = {
  url: "/asphalt-calculator-measurements.png",
  width: 1200,
  height: 630,
  alt: "Asphalt calculator diagram showing how to measure paving length, width, and compacted asphalt thickness above the base.",
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url, type: "website", images: [measurementImage] },
  twitter: { card: "summary_large_image", title, description, images: [measurementImage] },
};

const breadcrumbs = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://buildcalc.com/" },
    { "@type": "ListItem", position: 2, name: "Calculators", item: "https://buildcalc.com/calculators" },
    { "@type": "ListItem", position: 3, name: "Asphalt Calculator", item: url },
  ],
};

const application = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Asphalt Calculator",
  url,
  description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
};

const questions = [
  {
    question: "Can I calculate a driveway that tapers toward the road?",
    answer: "If it changes width evenly, average the two end widths and multiply by the length, then enter that number under Known area. For an irregular flare, sketch and measure it separately and add its area. If the flare also changes thickness, estimate its tonnage separately.",
  },
  {
    question: "Can I use this calculator for cold patch or recycled asphalt?",
    answer: "Use the product’s own coverage or bulk density and follow its installation instructions. The sample density is for illustrating a hot-mix calculation. For bagged patch, the label’s coverage at your intended depth is usually the most useful starting point.",
  },
  {
    question: "What if the supplier quotes metric tonnes or price per truckload?",
    answer: "Ask for a quote in US dollars per US short ton or calculate cost separately using the supplier’s units. One US short ton is about 0.907 metric tonnes. For a truckload quote, confirm the payload and minimum charge before comparing it with a per-ton quote.",
  },
  {
    question: "Can the calculator tell me how thick my driveway should be?",
    answer: "Use the compacted thickness in your job specification or confirm it with your paving contractor. Traffic, drainage, subgrade and base preparation affect the right pavement section. The calculator estimates material for the thickness you enter.",
  },
];

export default function AsphaltCalculatorPage() {
  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(application) }} />
      <header className={styles.topbar}>
        <Link href="/" className={styles.brandWrap} aria-label="BuildCalc home">
          <span className={styles.logo} aria-hidden="true">B</span>
          <span className={styles.brand}>BuildCalc<span className={styles.dot} aria-hidden="true">.</span></span>
        </Link>
        <Link href="/calculators" className={styles.headerLink}>All calculators</Link>
      </header>

      <main className={styles.main}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/calculators">Calculators</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Asphalt Calculator</span>
        </nav>

        <div className={styles.contentWrapper}>
          <header className={styles.hero}>
            <h1>Asphalt Calculator</h1>
            <p className={styles.intro}>
              Use the asphalt calculator to estimate how many US short tons to order for a driveway, parking area, or patch. Enter your supplier’s price to estimate material cost.
            </p>
          </header>

          <AsphaltCalculatorClient />

          <article className={styles.contentSection} aria-labelledby="guide">
            <h2 id="guide">Asphalt measurement and ordering guide</h2>
            <nav className={styles.jumpLinks} aria-label="On this page">
              <a href="#measure">Measure the area</a>
              <a href="#formula">Tonnage formula</a>
              <a href="#example">Worked example</a>
              <a href="#order">Place an order</a>
              <a href="#faq">FAQ</a>
            </nav>

            <section aria-labelledby="measure">
              <h3 id="measure">How to measure a driveway or patch</h3>
              <p>
                Measure the footprint of the asphalt you plan to place. On a rectangular driveway, measure the paved length and width and enter both in the calculator. If a plan already gives the area, switch to <strong>Known area</strong> and copy that number with its unit. Leave out planting islands, drains, and sections of existing pavement that will stay in place. Measure each patch separately when the repairs are spread out, then add their areas if they will all receive the same thickness.
              </p>
              <figure className={styles.measurementFigure}>
                <Image src={measurementImage.url} width={measurementImage.width} height={measurementImage.height} alt={measurementImage.alt} unoptimized />
                <figcaption>Measure across the paved surface for area. Measure vertically through the finished asphalt layer for compacted thickness.</figcaption>
              </figure>
              <p>
                For an L-shaped parking area, sketch it as two rectangles that meet without overlapping and add their areas. A 20 × 10 ft lane plus a separate 10 × 8 ft pad gives 280 ft². If the lane calls for 3 inches of asphalt and the pad calls for 4 inches, calculate the tonnage for each section and add the results. Using one average depth across areas of different sizes can misstate the order.
              </p>
              <p>
                Use the specified thickness of the <strong>finished, compacted asphalt layer</strong>. A depth measured at the edge of an excavation may include the aggregate base or other layers. For an overlay, use the thickness of the asphalt being added. For a base course and a surface course made from different mixes, estimate and price each mix separately. If you are ordering aggregate base as well, get its own depth, density, and quote.
              </p>
              <p>
                If you measure from a sketch instead of a survey, write the dimensions beside each section and mark where the asphalt stops. Check whether aprons, turnarounds, and the strip in front of a garage are included in the stated area. For a curved edge, take several width measurements along the length and divide the shape into shorter sections. This gives you a takeoff you can compare with the contractor’s scope before ordering.
              </p>
            </section>

            <section aria-labelledby="formula">
              <h3 id="formula">Asphalt calculator formula for US short tons</h3>
              <p>
                Convert the measurements to feet first so area, thickness, and density use compatible units. Multiplying area by compacted thickness gives the volume in cubic feet. Multiply by the compacted mix density to get pounds, then divide by 2,000 to get US short tons. The allowance increases the estimated order weight after the base estimate is calculated. The same area with twice the thickness requires twice the base tonnage if the mix density stays the same.
              </p>
              <ol className={styles.mathBox}>
                <li><strong>Area (ft²)</strong> = length (ft) × width (ft)</li>
                <li><strong>Volume (ft³)</strong> = area (ft²) × compacted thickness (in) ÷ 12</li>
                <li><strong>Base US short tons</strong> = volume (ft³) × density (lb/ft³) ÷ 2,000</li>
                <li><strong>Order US short tons</strong> = base US short tons × (1 + allowance ÷ 100)</li>
                <li><strong>Material cost</strong> = unrounded order US short tons × quoted price per US short ton</li>
              </ol>
              <p>
                The form accepts metric dimensions and converts them before calculating. Density is entered in pounds per cubic foot, so confirm that unit when you ask for the mix density. US short tons are the pricing unit used here. For reference, the <a href="https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors">NIST guide to unit conversion factors</a> documents US and metric units. If your quote says only “ton,” confirm which unit the supplier means.
              </p>
              <p>
                To check a quote in reverse, divide 2,000 lb by the mix density and then by the compacted thickness in feet. At the example density of 145 lb/ft³, one US short ton covers about <strong>55 ft² at 3 inches thick</strong> before any allowance. That coverage drops as the layer gets thicker. If another estimate uses a different coverage figure, compare its thickness and density with yours first.
              </p>
            </section>

            <section aria-labelledby="example">
              <h3 id="example">Worked example: a 20 × 10 ft asphalt driveway</h3>
              <p>
                This example uses a 200 ft² driveway, 3 inches of compacted asphalt, and an illustrative mix density of 145 lb/ft³. The 5% allowance and $120 per US short ton quote are example inputs. Select <a href="#calculator">Load worked example in the calculator</a> to reproduce the estimate. You can then change the thickness or price and see which results move.
              </p>
              <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Worked example table">
                <table>
                  <caption>Example asphalt takeoff for a 200-square-foot driveway</caption>
                  <thead><tr><th scope="col">Step</th><th scope="col">Calculation</th><th scope="col">Result</th></tr></thead>
                  <tbody>
                    <tr><th scope="row">Compacted volume</th><td>200 × (3 ÷ 12)</td><td>50 ft³</td></tr>
                    <tr><th scope="row">Base weight</th><td>50 × 145 ÷ 2,000</td><td>3.625 short tons</td></tr>
                    <tr><th scope="row">Order with 5% allowance</th><td>3.625 × 1.05</td><td>3.80625 short tons</td></tr>
                    <tr><th scope="row">Estimated material cost</th><td>3.80625 × $120</td><td>$456.75</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                The calculator displays the order weight as 3.81 US short tons and prices the underlying 3.80625 US short tons. Keep the full estimate when comparing quotes. If your supplier sells in half-ton increments, a 3.80625-ton order would round up to 4 short tons. At the same example rate, that would cost $480 before fees. The supplier’s actual sales increment is a separate purchasing decision.
              </p>
              <p>
                A quick sensitivity check helps before you call for a quote. At 2 inches of compacted thickness, the same footprint, density, and allowance give about <strong>2.54 US short tons</strong>. At 4 inches, they give about <strong>5.08 US short tons</strong>. These figures show the effect of thickness. Choose the project thickness from the plans or contractor’s specification.
              </p>
            </section>

            <section aria-labelledby="order">
              <h3 id="order">What to confirm before ordering asphalt</h3>
              <p>
                Ask for the mix name and compacted density the supplier recommends using for the takeoff. The calculator’s 145 lb/ft³ sample is an illustration. At 140 lb/ft³, the example order drops to about 3.68 US short tons. At 150 lb/ft³, it rises to about 3.94. That difference can matter when an order is near the next sales increment. If you only have a loose bulk density, ask for the value appropriate to the compacted volume used here.
              </p>
              <p>
                Use an allowance you can explain. A clean rectangular area measured from reliable plans may call for a different buffer than several small patches with broken edges. First account for measurable features such as driveway flares or varying depths. Then discuss any remaining uncertainty with your supplier or contractor. The sample 5% illustrates how a buffer changes the order. Because the base estimate already uses compacted thickness and density, the buffer is a separate ordering assumption.
              </p>
              <p>
                Ask whether the quote is for pickup or delivery, whether it has a minimum order or load increment, and whether delivery, taxes, or surcharges are included. Compare quotes on the delivered quantity and the same mix. Material cost on this page covers only the tonnage multiplied by your entered price. Base preparation, labor, equipment, and compaction are separate components of a paving quote. For broader technical guidance on asphalt mixes and paving, see the <a href="https://www.asphaltinstitute.org/">Asphalt Institute</a>.
              </p>
              <p>
                Keep a copy of the area, thickness, density, and allowance you used beside the supplier quote. If the paving limits or mix change, update the affected section and recalculate before confirming the order. For a multi-load job, compare the delivery tickets with the ordered quantity and note any changes to the actual paved area. That gives you a practical record for estimating a similar project later.
              </p>
            </section>

            <section aria-labelledby="faq">
              <h3 id="faq">Frequently asked questions</h3>
              <div className={styles.faqList}>
                {questions.map(({ question, answer }) => (
                  <details className={styles.faqItem} key={question}>
                    <summary>{question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section aria-labelledby="related">
              <h3 id="related">Related calculators</h3>
              <ul className={styles.relatedList}>
                <li><Link href="/calculators/fill-dirt-calculator">Fill Dirt Calculator</Link> for estimating fill to reach a finished grade.</li>
                <li><Link href="/calculators/sand-calculator">Sand Calculator</Link> for a separate sand or bedding takeoff.</li>
              </ul>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
