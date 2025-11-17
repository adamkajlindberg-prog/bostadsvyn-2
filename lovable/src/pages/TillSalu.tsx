import { Helmet } from "react-helmet-async";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import { PropertySearch } from "@/components/PropertySearch";

const TillSalu = () => {
  return (
    <>
      <Helmet>
        <title>Bostäder till salu - Bostadsvyn</title>
        <meta
          name="description"
          content="Sök bland tusentals bostäder till salu. Hitta din drömbostad - villor, lägenheter, radhus och bostadsrätter i hela Sverige."
        />
        <meta
          name="keywords"
          content="bostäder till salu, köpa bostad, villa, lägenhet, radhus, bostadsrätt, fastigheter"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <PropertySearch defaultTab="FOR_SALE" />
        </main>
        <LegalFooter />
      </div>
    </>
  );
};

export default TillSalu;
