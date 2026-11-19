import type { Metadata } from "next";
import GardenBedDirtCalculatorClient from "./GardenBedDirtCalculatorClient";

const title = "Garden Bed Dirt Calculator – Soil Volume & Cost";
const description =
  "Estimate garden bed soil in cubic feet, cubic yards, and bags. Calculate added soil volume for rectangular or circular beds and optional material cost.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://buildcalc.com/calculators/garden-bed-dirt-calculator" },
  openGraph: {
    title,
    description,
    url: "https://buildcalc.com/calculators/garden-bed-dirt-calculator",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <GardenBedDirtCalculatorClient />;
}
