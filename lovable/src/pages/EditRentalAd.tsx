import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { RentalForm } from "@/components/RentalForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const EditRentalAd = () => {
  const { adId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [adData, setAdData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && adId) {
      loadAdData();
    }
  }, [user, adId, loadAdData]);

  const loadAdData = async () => {
    try {
      const { data, error } = await supabase
        .from("ads")
        .select(`
          *,
          properties (
            *
          )
        `)
        .eq("id", adId)
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Fel",
          description: "Annonsen hittades inte",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setAdData(data);
    } catch (error) {
      console.error("Error loading ad:", error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda annonsdata",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    toast({
      title: "Uppdaterat!",
      description: "Din hyresannons har uppdaterats",
    });
    navigate(`/hantera-uthyrning/${adId}`);
  };

  const handleCancel = () => {
    navigate(`/hantera-uthyrning/${adId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!adData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content">
        <div className="container mx-auto py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Redigera hyresannons
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uppdatera din hyresannons med nya bilder, text eller villkor
            </p>
          </div>

          <RentalForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            initialData={adData}
            adId={adId}
          />
        </div>
      </main>
    </div>
  );
};

export default EditRentalAd;
