import SkipToContent from "@/components/accessibility/SkipToContent";
import CookieBanner from "@/components/CookieBanner";
import DevTools, { useDevTools } from "@/components/dev/DevTools";
import FeatureSection from "@/components/FeatureSection";
import FlowingAdsGrid from "@/components/FlowingAds";
import HeroSection from "@/components/HeroSection";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import LazyLoadWrapper from "@/components/performance/LazyLoadWrapper";
import SearchSection from "@/components/SearchSection";
import SEOOptimization, {
  generateOrganizationStructuredData,
} from "@/components/seo/SEOOptimization";

const Index = () => {
  const devTools = useDevTools();

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Bostadsvyn - Sveriges modernaste fastighetsplattform"
        description="Hitta din drömbostad med AI-drivna verktyg, avancerad sökning och expertråd. Sveriges mest innovativa fastighetsplattform för köpare, säljare och mäklare."
        keywords="fastigheter, bostäder, köpa bostad, sälja bostad, mäklare, lägenheter, villor, Stockholm, Göteborg, Malmö, AI fastigheter"
        structuredData={generateOrganizationStructuredData()}
        canonicalUrl="https://bostadsvyn.se/"
      />
      <SkipToContent />
      <Navigation />
      <main id="main-content" aria-label="Huvudinnehåll">
        <HeroSection />

        <LazyLoadWrapper minHeight={300}>
          <SearchSection />
        </LazyLoadWrapper>

        <LazyLoadWrapper minHeight={400}>
          <FeatureSection />
        </LazyLoadWrapper>

        <LazyLoadWrapper minHeight={600}>
          <FlowingAdsGrid />
        </LazyLoadWrapper>
      </main>

      <LazyLoadWrapper minHeight={200}>
        <LegalFooter />
      </LazyLoadWrapper>

      <CookieBanner />

      {/* Dev Tools (only in development) */}
      <DevTools isVisible={devTools.isVisible} onToggle={devTools.toggle} />
    </div>
  );
};

export default Index;
