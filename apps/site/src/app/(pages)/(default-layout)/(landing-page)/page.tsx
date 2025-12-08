import type { Metadata } from "next";
import LandingContent from "@/components/landing";
import StructuredData from "@/components/common/structured-data";
import {
  generateOrganizationStructuredData,
  generatePageMetadata,
  generateWebsiteStructuredData,
} from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Bostadsvyn - Sveriges modernaste fastighetsplattform",
  description:
    "Hitta din drömbostad med AI-drivna verktyg, avancerad sökning och expertråd. Sveriges mest innovativa fastighetsplattform för köpare, säljare och mäklare.",
  canonicalUrl: "https://bostadsvyn.se/",
});

const HomePage = () => {
  return (
    <>
      <StructuredData
        data={[
          generateOrganizationStructuredData(),
          generateWebsiteStructuredData(),
        ]}
      />
      <LandingContent />
    </>
  );
};

export default HomePage;
