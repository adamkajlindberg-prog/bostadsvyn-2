import { AlertTriangle, CheckCircle, Loader2, Shield } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BankIDVerificationProps {
  userId: string;
  isVerified: boolean;
  onVerificationComplete?: () => void;
}

const BankIDVerification: React.FC<BankIDVerificationProps> = ({
  userId,
  isVerified,
  onVerificationComplete,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    setLoading(true);

    try {
      // In production, this would integrate with BankID API
      // For now, we'll simulate the verification process

      toast({
        title: "BankID-verifiering",
        description: "Öppnar BankID-appen...",
      });

      // Simulate BankID verification
      // In production: Call edge function that initiates BankID auth
      const { data, error } = await supabase.functions.invoke("verify-bankid", {
        body: { userId },
      });

      if (error) throw error;

      toast({
        title: "Verifierad!",
        description: "Din identitet har verifierats med BankID.",
      });

      if (onVerificationComplete) {
        onVerificationComplete();
      }
    } catch (error: any) {
      console.error("BankID verification error:", error);
      toast({
        title: "Verifieringen misslyckades",
        description:
          error.message || "Kunde inte verifiera med BankID. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            Verifierad med BankID
          </CardTitle>
          <CardDescription>
            Din identitet har verifierats och kontot är skyddat
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Verifiera med BankID
        </CardTitle>
        <CardDescription>
          Verifiera din identitet för att använda alla funktioner på plattformen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>BankID krävs</AlertTitle>
          <AlertDescription>
            För att skydda mot bedrägerier och säkerställa äkta användare kräver
            vi BankID-verifiering för både hyresvärdar och hyresgäster.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h4 className="font-medium">Fördelar med verifiering:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Skydd mot falska konton och bedrägerier</li>
            <li>Ökad trovärdighet i dina annonser</li>
            <li>Tillgång till premiumfunktioner</li>
            <li>Snabbare kontakt med verifierade användare</li>
          </ul>
        </div>

        <Button
          onClick={handleVerification}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Verifierar...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Verifiera med BankID
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Genom att verifiera godkänner du att vi lagrar ditt personnummer
          krypterat enligt GDPR.
        </p>
      </CardContent>
    </Card>
  );
};

export default BankIDVerification;
