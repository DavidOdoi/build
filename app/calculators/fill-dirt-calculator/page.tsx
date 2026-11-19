import type { Metadata } from "next";
import FillDirtCalculatorClient from "./FillDirtCalculatorClient";

const title = "Fill Dirt Calculator – Cubic Yards, Tons & Cost";
const description =
  "Estimate how much fill dirt you need in cubic yards and tons. Enter dimensions, adjust density and compaction assumptions, and calculate material cost.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://buildcalc.com/calculators/fill-dirt-calculator" },
  openGraph: {
    title,
    description,
    url: "https://buildcalc.com/calculators/fill-dirt-calculator",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <FillDirtCalculatorClient />;
}
