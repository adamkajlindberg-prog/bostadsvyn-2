import { AlertTriangle, FileText, Info } from "lucide-react";
import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";
import ContainerWrapper from "@/components/common/container-wrapper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function DAC7CompliancePage() {
  if (!(await isServerAuthenticated())) {
    redirect("/login");
  }

  return (
    <ContainerWrapper className="py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" aria-hidden="true" />
            <h1 className="text-4xl font-bold text-foreground">
              DAC 7 Skatteregistrering
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Information som krävs för rapportering till Skatteverket enligt EU:s
            DAC 7-direktiv
          </p>
        </div>

        <Alert className="mb-8">
          <Info className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Varför behöver vi denna information?</AlertTitle>
          <AlertDescription>
            Enligt EU:s direktiv 2021/514 (DAC 7) måste digitala plattformar som
            förmedlar uthyrning rapportera viss information till Skatteverket.
            Detta gäller för hyresvärdar vars årliga hyresintäkter överstiger
            vissa gränsvärden. Informationen behandlas konfidentiellt och lagras
            säkert enligt GDPR.
          </AlertDescription>
        </Alert>

        <Alert variant="default" className="bg-muted">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Under utveckling</AlertTitle>
          <AlertDescription>
            DAC 7-funktionaliteten är för närvarande under utveckling. Denna
            funktion kommer snart att vara tillgänglig för att hjälpa dig
            registrera och rapportera din hyresinformation enligt DAC
            7-direktivet.
          </AlertDescription>
        </Alert>
      </div>
    </ContainerWrapper>
  );
}
