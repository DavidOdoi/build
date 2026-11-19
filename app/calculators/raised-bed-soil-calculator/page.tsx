import type { Metadata } from "next";
import RaisedBedSoilCalculatorClient from "./RaisedBedSoilCalculatorClient";

const title = "Raised Bed Soil Calculator – Volume, Mix & Bags";
const description =
  "Calculate the soil volume, cubic yards, bags, and optional ingredient mix for one or more raised garden beds.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://buildcalc.com/calculators/raised-bed-soil-calculator" },
  openGraph: {
    title,
    description,
    url: "https://buildcalc.com/calculators/raised-bed-soil-calculator",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <RaisedBedSoilCalculatorClient />;
}
