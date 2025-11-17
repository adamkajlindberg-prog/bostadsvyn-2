import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const adId = searchParams.get("ad_id");

      if (!sessionId || !adId) {
        toast({
          title: "Ogiltig länk",
          description: "Betalningsinformationen saknas.",
          variant: "destructive",
        });
        setVerifying(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke(
          "verify-ad-payment",
          {
            body: { sessionId, adId },
          },
        );

        if (error) throw error;

        setSuccess(true);
        toast({
          title: "Betalning genomförd!",
          description: "Din annons är nu publicerad och live.",
        });
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast({
          title: "Verifieringsfel",
          description:
            "Kunde inte verifiera betalningen. Kontakta support om problemet kvarstår.",
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, toast]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Verifierar betalning...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Vänligen vänta medan vi verifierar din betalning och publicerar
              annonsen.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Verifieringsfel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Vi kunde inte verifiera din betalning. Om du har betalat men inte
              fått din annons publicerad, vänligen kontakta vår support.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Till Dashboard
              </Button>
              <Button onClick={() => navigate("/support")}>
                Kontakta Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md border-success">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <CheckCircle2 className="h-6 w-6" />
            Betalning genomförd!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">Din annons är nu publicerad</p>
            <p className="text-muted-foreground">
              Tack för din betalning! Din annons är nu live och synlig för
              potentiella köpare.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm">Nästa steg:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Din annons syns nu på plattformen</li>
              <li>• Du kan se statistik i din dashboard</li>
              <li>• Du får notiser när köpare visar intresse</li>
              <li>• Svara snabbt på förfrågningar för bäst resultat</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="w-full"
            >
              Till Min Dashboard
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              Se Min Annons
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
