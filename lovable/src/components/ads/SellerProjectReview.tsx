import {
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Edit2,
  FileText,
  Package,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SellerProjectReviewProps {
  ad: any;
  onApproved: () => void;
  onRejected: () => void;
}

export const SellerProjectReview: React.FC<SellerProjectReviewProps> = ({
  ad,
  onApproved,
  onRejected,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editingBillingAddress, setEditingBillingAddress] = useState(false);
  const [editedBillingAddress, setEditedBillingAddress] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(ad.ad_tier);

  const brokerData = ad.broker_form_data || {};
  const projectDetails = brokerData.projectDetails || {};
  const _property = ad.properties;

  const handleApprove = async () => {
    try {
      setLoading(true);

      // För nyproduktionsprojekt, starta betalningsprocess
      const { data, error } = await supabase.functions.invoke(
        "create-ad-payment",
        {
          body: {
            adId: ad.id,
            adTier: selectedPackage,
          },
        },
      );

      if (error) throw error;
      if (!data?.url) throw new Error("Ingen betalningslänk mottagen");

      // Öppna Stripe Checkout
      window.open(data.url, "_blank");

      toast({
        title: "Betalsida öppnad",
        description: "Slutför betalningen för att publicera projektet.",
      });
    } catch (error) {
      console.error("Error starting payment:", error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte starta betalningen. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPackageDetails = (tier: string) => {
    switch (tier) {
      case "premium":
        return {
          name: "Exklusivpaket",
          price: "8 999 kr",
          features: [
            "Premium placering i sökresultat",
            "Framhävd i projektlistningar",
            "Obegränsade bilder och videor",
            "AI-verktyg för marknadsföring",
            "3D-visningar och virtuella turer",
            "Prioriterad support",
            "Detaljerad statistik",
            "Social media marknadsföring",
          ],
        };
      case "plus":
        return {
          name: "Pluspaket",
          price: "4 999 kr",
          features: [
            "Förhöjd placering i sökresultat",
            "Upp till 30 bilder",
            "Video och 3D-visning",
            "Grundläggande statistik",
            "Projektsida med alla enheter",
          ],
        };
      default:
        return {
          name: "Grundpaket",
          price: "Gratis",
          features: [
            "Standard placering",
            "Upp till 10 bilder",
            "Projektsida",
            "Grundläggande exponering",
          ],
        };
    }
  };

  return (
    <Card className="border-primary/50">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Granska Nyproduktionsprojekt
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
          >
            Inväntar godkännande
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-8">
        {/* Project Information */}
        <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            Projektinformation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Projektnamn
              </span>
              <p className="text-base font-semibold text-foreground">
                {projectDetails.projectName}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Adress
              </span>
              <p className="text-base font-semibold text-foreground">
                {brokerData.propertyInfo?.address}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Antal enheter
              </span>
              <p className="text-base font-semibold text-foreground">
                {projectDetails.totalUnits} st
              </p>
            </div>
            {projectDetails.completionDate && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Färdigställande
                </span>
                <p className="text-base font-semibold text-foreground">
                  {new Date(projectDetails.completionDate).toLocaleDateString(
                    "sv-SE",
                  )}
                </p>
              </div>
            )}
            {projectDetails.builderCompany && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Byggföretag
                </span>
                <p className="text-base font-semibold text-foreground">
                  {projectDetails.builderCompany}
                </p>
              </div>
            )}
            {projectDetails.architectFirm && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Arkitektfirma
                </span>
                <p className="text-base font-semibold text-foreground">
                  {projectDetails.architectFirm}
                </p>
              </div>
            )}
          </div>

          {projectDetails.projectDescription && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-3">
                Projektbeskrivning
              </span>
              <p className="text-sm text-foreground leading-relaxed">
                {projectDetails.projectDescription}
              </p>
            </div>
          )}

          {projectDetails.projectWebsite && (
            <div className="mt-4">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                Projektwebbsida
              </span>
              <a
                href={projectDetails.projectWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline text-primary hover:text-primary/80"
              >
                {projectDetails.projectWebsite}
              </a>
            </div>
          )}
        </div>

        {/* Media Links */}
        {(projectDetails.videoUrl || projectDetails.threedTourUrl) && (
          <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
            <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-foreground">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              Media
            </h3>
            <div className="space-y-5">
              {projectDetails.videoUrl && (
                <>
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
                      Film
                    </span>
                    <p className="text-base font-semibold text-foreground">
                      Filmlänk har lagts till
                    </p>
                    <a
                      href={projectDetails.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline text-primary break-all hover:text-primary/80 transition-colors block mt-1"
                    >
                      {projectDetails.videoUrl}
                    </a>
                    {projectDetails.videoAsFirstImage && (
                      <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mt-2">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                        Används som förstabild
                      </p>
                    )}
                  </div>
                  {projectDetails.threedTourUrl && (
                    <Separator className="bg-border/50" />
                  )}
                </>
              )}

              {projectDetails.threedTourUrl && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
                    3D-visning
                  </span>
                  <p className="text-base font-semibold text-foreground">
                    3D-visningslänk har lagts till
                  </p>
                  <a
                    href={projectDetails.threedTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline text-primary break-all hover:text-primary/80 transition-colors block mt-1"
                  >
                    {projectDetails.threedTourUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Package Selection */}
        <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            Välj annonspaket
          </h3>

          <p className="text-sm text-muted-foreground mb-6">
            Mäklaren rekommenderar{" "}
            <strong>{getPackageDetails(ad.ad_tier).name}</strong>
            {brokerData.brokerRecommendation && (
              <span className="block mt-2 italic">
                &quot;{brokerData.brokerRecommendation}&quot;
              </span>
            )}
          </p>

          <Accordion
            type="single"
            collapsible
            defaultValue={ad.ad_tier}
            className="space-y-4"
          >
            {/* Premium Package */}
            <AccordionItem
              value="premium"
              className="border rounded-lg overflow-hidden"
            >
              <AccordionTrigger
                className="px-6 hover:no-underline hover:bg-muted/50 data-[state=open]:bg-primary/5"
                onClick={() => setSelectedPackage("premium")}
              >
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPackage === "premium"
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedPackage === "premium" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-lg">Exklusivpaket</p>
                      <p className="text-sm text-muted-foreground">8 999 kr</p>
                    </div>
                  </div>
                  {ad.ad_tier === "premium" && (
                    <Badge variant="default" className="mr-8">
                      Rekommenderad
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <ul className="space-y-2 text-sm">
                  {getPackageDetails("premium").features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Plus Package */}
            <AccordionItem
              value="plus"
              className="border rounded-lg overflow-hidden"
            >
              <AccordionTrigger
                className="px-6 hover:no-underline hover:bg-muted/50"
                onClick={() => setSelectedPackage("plus")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPackage === "plus"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedPackage === "plus" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-lg">Pluspaket</p>
                    <p className="text-sm text-muted-foreground">4 999 kr</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <ul className="space-y-2 text-sm">
                  {getPackageDetails("plus").features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Free Package */}
            <AccordionItem
              value="free"
              className="border rounded-lg overflow-hidden"
            >
              <AccordionTrigger
                className="px-6 hover:no-underline hover:bg-muted/50"
                onClick={() => setSelectedPackage("free")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPackage === "free"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedPackage === "free" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-lg">Grundpaket</p>
                    <p className="text-sm text-muted-foreground">Gratis</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <ul className="space-y-2 text-sm">
                  {getPackageDetails("free").features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Billing Information */}
        <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            Faktureringsinformation
          </h3>
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Betalare
              </span>
              <p className="text-base font-semibold text-foreground">
                {brokerData.paymentInfo?.payer === "seller"
                  ? "Ditt företag"
                  : "Mäklarkontoret"}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Faktureringsadress
                </span>
                {!editingBillingAddress && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingBillingAddress(true);
                      setEditedBillingAddress(
                        brokerData.paymentInfo?.billingAddress?.address || "",
                      );
                    }}
                    className="h-8 text-xs font-medium"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Ändra
                  </Button>
                )}
              </div>
              {editingBillingAddress ? (
                <div className="space-y-3">
                  <Input
                    value={editedBillingAddress}
                    onChange={(e) => setEditedBillingAddress(e.target.value)}
                    placeholder="Ange faktureringsadress"
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={async () => {
                        try {
                          const updatedBrokerData = {
                            ...brokerData,
                            paymentInfo: {
                              ...brokerData.paymentInfo,
                              billingAddress: {
                                ...brokerData.paymentInfo?.billingAddress,
                                address: editedBillingAddress,
                              },
                            },
                          };
                          const { error } = await supabase
                            .from("ads")
                            .update({ broker_form_data: updatedBrokerData })
                            .eq("id", ad.id);
                          if (error) throw error;
                          setEditingBillingAddress(false);
                          toast({
                            title: "Adress uppdaterad",
                            description: "Faktureringsadressen har sparats.",
                          });
                        } catch (error) {
                          console.error(
                            "Error updating billing address:",
                            error,
                          );
                          toast({
                            title: "Ett fel uppstod",
                            description:
                              "Kunde inte spara adressen. Försök igen.",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="h-9 text-xs font-medium"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Spara
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingBillingAddress(false);
                        setEditedBillingAddress("");
                      }}
                      className="h-9 text-xs font-medium"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Avbryt
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {brokerData.paymentInfo?.billingAddress?.address ||
                      "Ingen adress angiven"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Faktureringsadress fylldes i av mäklaren
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 h-12 text-base"
            size="lg"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            {loading ? "Bearbetar..." : "Godkänn och fortsätt till betalning"}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Efter godkännande kommer du att dirigeras till en säker betalsida för
          att slutföra köpet.
        </p>
      </CardContent>
    </Card>
  );
};
