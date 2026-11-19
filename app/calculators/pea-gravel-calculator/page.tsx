import type { Metadata } from "next";
import PeaGravelCalculatorClient from "./PeaGravelCalculatorClient";

const title = "Pea Gravel Calculator – Tons, Yards & Cost";
const description =
  "Use our free pea gravel calculator to estimate cubic yards, tons, coverage, and material cost for walkways, patios, and landscaping projects.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://buildcalc.com/calculators/pea-gravel-calculator" },
  openGraph: {
    title,
    description,
    url: "https://buildcalc.com/calculators/pea-gravel-calculator",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <PeaGravelCalculatorClient />;
}
