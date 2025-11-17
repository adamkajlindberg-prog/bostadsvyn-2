import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import PropertyMap from "@/components/PropertyMap";
import { supabase } from "@/integrations/supabase/client";

const Map = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error loading properties for map:", error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Sverige Fastighetskarta | Utforska fastigheter och slutpriser
        </title>
        <meta
          name="description"
          content="Interaktiv karta över Sverige med aktuella fastigheter till salu och uthyrning samt slutpriser från de senaste 15 åren. Utforska områden och prishistorik."
        />
        <meta
          name="keywords"
          content="fastighetskarta, slutpriser, Sverige, köpa bostad, sälja bostad"
        />
        <link rel="canonical" href={`${window.location.origin}/map`} />

        {/* OpenGraph */}
        <meta
          property="og:title"
          content="Sverige Fastighetskarta | Utforska fastigheter och slutpriser"
        />
        <meta
          property="og:description"
          content="Interaktiv karta över Sverige med aktuella fastigheter och prishistorik"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/map`} />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Sverige Fastighetskarta",
            description:
              "Interaktiv karta över Sverige med aktuella fastigheter till salu och uthyrning samt slutpriser från de senaste 15 åren",
            url: `${window.location.origin}/map`,
            mainEntity: {
              "@type": "Map",
              name: "Sverige Fastighetskarta",
              description: "Karta över fastigheter och slutpriser i Sverige",
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-nordic bg-clip-text text-transparent">
              Sverige Fastighetskarta
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Utforska aktuella fastigheter till salu och uthyrning samt
              slutpriser från de senaste 15 åren på en interaktiv karta över
              hela Sverige
            </p>
          </div>

          {isLoading ? (
            <div className="h-[600px] rounded-xl border bg-card flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="h-[600px] rounded-xl overflow-hidden">
              <PropertyMap properties={properties} />
            </div>
          )}
        </main>
        <LegalFooter />
      </div>
    </>
  );
};

export default Map;
