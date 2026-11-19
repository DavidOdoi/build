import type { Metadata } from "next";
import CompostCalculatorClient from "./CompostCalculatorClient";

const title = "Compost Calculator – Cubic Yards, Bags & Cost";
const description =
  "Estimate finished compost volume in cubic feet, cubic yards, or bags for garden beds and landscaping, with optional allowance and material cost.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://buildcalc.com/calculators/compost-calculator" },
  openGraph: {
    title,
    description,
    url: "https://buildcalc.com/calculators/compost-calculator",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <CompostCalculatorClient />;
}
