import { Helmet } from "react-helmet-async";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import { PropertySearch } from "@/components/PropertySearch";

const SnartTillSalu = () => {
  return (
    <>
      <Helmet>
        <title>Snart till salu - Kommande fastigheter - Bostadsvyn</title>
        <meta
          name="description"
          content="Upptäck bostäder som snart kommer till försäljning. Var först med att se kommande objekt på marknaden."
        />
        <meta
          name="keywords"
          content="snart till salu, kommande försäljning, nya objekt, kommande bostäder"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <PropertySearch defaultTab="COMING_SOON" />
        </main>
        <LegalFooter />
      </div>
    </>
  );
};

export default SnartTillSalu;
