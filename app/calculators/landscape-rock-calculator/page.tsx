import type { Metadata } from "next";
import LandscapeRockCalculatorClient from "./LandscapeRockCalculatorClient";

const title = "Landscape Rock Calculator – Tons, Yards & Cost";
const description =
  "Calculate how much landscape rock you need in cubic yards or tons. Estimate coverage, material weight, and cost for decorative stone projects.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://buildcalc.com/calculators/landscape-rock-calculator" },
  openGraph: {
    title,
    description,
    url: "https://buildcalc.com/calculators/landscape-rock-calculator",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <LandscapeRockCalculatorClient />;
}
