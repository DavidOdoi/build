import type { Metadata } from "next";
import StudCalculatorClient from "./StudCalculatorClient";

const title = "Stud Calculator – Wall Stud Count & Framing Cost";
const description =
  "Estimate wall studs, spacing, lumber quantity, and material cost. Enter wall length, stud spacing, corners, openings, and waste allowance.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://buildcalc.com/calculators/stud-calculator" },
  openGraph: {
    title,
    description,
    url: "https://buildcalc.com/calculators/stud-calculator",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <StudCalculatorClient />;
}
