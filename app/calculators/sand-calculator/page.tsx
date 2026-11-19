import type { Metadata } from "next";
import SandCalculatorClient from "./SandCalculatorClient";

export const metadata: Metadata = {
  title: "Sand Calculator | Estimate Cubic Yards, Tons & Cost",
  description:
    "Calculate sand volume, weight, US short tons, metric tonnes, and material cost for patios, landscaping, and construction jobs.",
  alternates: {
    canonical: "https://buildcalc.com/calculators/sand-calculator",
  },
  openGraph: {
    title: "Sand Calculator | Estimate Cubic Yards, Tons & Cost",
    description:
      "Calculate sand volume, weight, US short tons, metric tonnes, and material cost for patios, landscaping, and construction jobs.",
    url: "https://buildcalc.com/calculators/sand-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sand Calculator | Estimate Cubic Yards, Tons & Cost",
    description:
      "Calculate sand volume, weight, US short tons, metric tonnes, and material cost for patios, landscaping, and construction jobs.",
  },
};

export default function Page() {
  return <SandCalculatorClient />;
}
