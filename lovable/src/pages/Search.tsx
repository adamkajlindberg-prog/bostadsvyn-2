import { Helmet } from "react-helmet-async";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import { PropertySearch } from "@/components/PropertySearch";

const Search = () => {
  return (
    <>
      <Helmet>
        <title>Sök fastigheter - Bostadsvyn</title>
        <meta
          name="description"
          content="Sök bland alla fastigheter till salu och uthyrning. Filtrera efter typ, pris, område och mycket mer. Hitta din drömbostad idag!"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <PropertySearch />
        </main>
        <LegalFooter />
      </div>
    </>
  );
};

export default Search;
