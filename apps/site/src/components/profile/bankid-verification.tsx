"use client";

import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import { checkBankIDStatus } from "@/lib/actions/profile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BankIDVerificationProps {
  userId: string;
}

export function BankIDVerification({ userId }: BankIDVerificationProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    checkStatus();
  }, [userId]);

  const checkStatus = async () => {
    try {
      setCheckingStatus(true);
      const result = await checkBankIDStatus();
      if (result.success) {
        setIsVerified(result.isVerified);
      }
    } catch (error) {
      console.error("Error checking BankID status:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleVerification = async () => {
    setLoading(true);

    try {
      toast.info("BankID-verifiering", {
        description: "Öppnar BankID-inloggning...",
      });

      // Redirect to BankID OAuth flow
      // better-auth handles this via the genericOAuth provider
      const result = await authClient.signIn.social({
        provider: "idura",
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // After successful BankID login, check status again
      // The page will reload and show verified status
      await checkStatus();
    } catch (error) {
      console.error("BankID verification error:", error);
      toast.error("Verifieringen misslyckades", {
        description:
          error instanceof Error
            ? error.message
            : "Kunde inte verifiera med BankID. Försök igen.",
      });
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Kontrollerar verifieringsstatus...</p>
        </CardContent>
      </Card>
    );
  }

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
}

