import type { Metadata } from "next";
import BrickCalculatorClient from "./BrickCalculatorClient";

export const metadata: Metadata = {
  title: "Brick Calculator – Bricks Needed & Wall Cost",
  description:
    "Free brick calculator to estimate bricks needed for a wall. Enter dimensions, subtract openings, select brick size, and calculate waste and material cost.",
  alternates: {
    canonical: "https://buildcalc.com/calculators/brick-calculator",
  },
  openGraph: {
    title: "Brick Calculator – Bricks Needed & Wall Cost",
    description:
      "Free brick calculator to estimate bricks needed for a wall. Enter dimensions, subtract openings, select brick size, and calculate waste and material cost.",
    url: "https://buildcalc.com/calculators/brick-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brick Calculator – Bricks Needed & Wall Cost",
    description:
      "Free brick calculator to estimate bricks needed for a wall. Enter dimensions, subtract openings, select brick size, and calculate waste and material cost.",
  },
};

export default function Page() {
  return <BrickCalculatorClient />;
}
