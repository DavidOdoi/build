import type { Metadata } from "next";
import LinearFootCalculatorClient from "./LinearFootCalculatorClient";

const title = "Linear Foot Calculator – Length, Materials & Cost";
const description =
  "Calculate linear feet from inches, yards, meters, or material dimensions. Estimate trim, lumber, fencing, and other materials with cost and waste.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://buildcalc.com/calculators/linear-foot-calculator" },
  openGraph: {
    title,
    description,
    url: "https://buildcalc.com/calculators/linear-foot-calculator",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <LinearFootCalculatorClient />;
}
