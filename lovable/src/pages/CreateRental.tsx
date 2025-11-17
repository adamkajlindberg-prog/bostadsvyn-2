import { Navigate, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { RentalForm } from "@/components/RentalForm";
import SEOOptimization from "@/components/seo/SEOOptimization";
import { useAuth } from "@/hooks/useAuth";

const CreateRental = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar...</p>
          </div>
        </div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const handleSuccess = () => {
    navigate("/hyresbostader");
  };
  const handleCancel = () => {
    navigate("/hyresbostader");
  };
  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Skapa hyresannons - Bostadsvyn"
        description="Skapa och publicera din hyresannons. Enkelt formulär med AI-verifiering för säkra och professionella hyresannonser."
        keywords="skapa hyresannons, hyra ut lägenhet, andrahandskontrakt, förstahandskontrakt, hyresuthyrning, Stockholm"
        canonicalUrl="https://bostadsvyn.se/skapa-hyresannons"
      />
      <Navigation />
      <main id="main-content">
        <div className="container mx-auto py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Skapa hyresannons
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Följ vårt enkla steg-för-steg formulär för att skapa en
              professionell hyresannons!
              {/* Add notice for companies */}
              <span className="block mt-2 text-sm">
                Tillgängligt för både privatpersoner och företag.
              </span>
            </p>
          </div>

          <RentalForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </main>
    </div>
  );
};
export default CreateRental;
