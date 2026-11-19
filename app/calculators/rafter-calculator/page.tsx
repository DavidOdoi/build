import type { Metadata } from "next";
import RafterCalculatorClient from "./RafterCalculatorClient";

const title = "Rafter Calculator – Roof Length, Pitch & Rise";
const description =
  "Free rafter calculator to estimate common rafter length, roof pitch, rise, and overhang using roof span or run. Includes formulas and examples.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://buildcalc.com/calculators/rafter-calculator" },
  openGraph: {
    title,
    description,
    url: "https://buildcalc.com/calculators/rafter-calculator",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <RafterCalculatorClient />;
}
