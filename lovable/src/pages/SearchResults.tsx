import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import { SearchResults } from "@/components/SearchResults";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "";
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  // Try to parse location data if passed as JSON
  useEffect(() => {
    const locationData = searchParams.get("locationData");
    if (locationData) {
      try {
        setSelectedLocation(JSON.parse(decodeURIComponent(locationData)));
      } catch (error) {
        console.error("Error parsing location data:", error);
      }
    }
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>Sökresultat för {location} - Bostadsvyn</title>
        <meta
          name="description"
          content={`Fastigheter till salu, kommande och slutpriser i ${location}. Utforska alla tillgängliga bostäder och prishistorik.`}
        />
        <meta
          name="keywords"
          content={`fastigheter ${location}, bostäder till salu ${location}, slutpriser ${location}, fastighetspriser`}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <SearchResults
            searchLocation={location}
            selectedLocation={selectedLocation}
          />
        </main>
        <LegalFooter />
      </div>
    </>
  );
};

export default SearchResultsPage;
