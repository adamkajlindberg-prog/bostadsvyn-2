import type { Metadata } from "next";
import AboutUs from "@/components/about-us";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Om Bostadsvyn Sverige AB - Vår vision och värderingar",
  description:
    "Bostadsvyn Sverige AB grundades 2025 med visionen att utveckla en modern fastighetsplattform. Lär dig mer om våra värderingar, mål och vad som gör oss unika.",
  keywords: "om bostadsvyn, företagsinformation, vision, värderingar, fastighetsplattform",
  canonicalUrl: "https://bostadsvyn.se/om-oss",
});

export default function OmOssPage() {
  return <AboutUs />;
}
