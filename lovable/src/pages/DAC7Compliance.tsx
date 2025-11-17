import { AlertTriangle, CheckCircle, FileText, Info } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RentalIncomeForm from "@/components/dac7/RentalIncomeForm";
import RentalIncomeList from "@/components/dac7/RentalIncomeList";
import ReportGenerator from "@/components/dac7/ReportGenerator";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import SEOOptimization from "@/components/seo/SEOOptimization";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const DAC7Compliance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRoles } = useAuth();
  const isBroker = userRoles.includes("broker");
  const [loading, setLoading] = useState(false);
  const [hasExistingInfo, setHasExistingInfo] = useState(false);
  const [landlordInfoId, setLandlordInfoId] = useState<string | null>(null);
  const [rentalIncomes, setRentalIncomes] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    legalName: "",
    businessName: "",
    organizationNumber: "",
    personalNumber: "",
    streetAddress: "",
    postalCode: "",
    city: "",
    country: "SE",
    tin: "",
    vatNumber: "",
    entityType: "individual",
    email: "",
    phone: "",
    consentGiven: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Brokers should not have access to DAC7 reporting
    if (isBroker) {
      navigate("/mäklarportal");
      return;
    }

    checkExistingInfo();
  }, [user, isBroker, checkExistingInfo, navigate]);

  const checkExistingInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("dac7_landlord_info")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (data && !error) {
        setHasExistingInfo(true);
        setLandlordInfoId(data.id);
        setFormData({
          legalName: data.legal_name || "",
          businessName: data.business_name || "",
          organizationNumber: data.organization_number || "",
          personalNumber: "", // Never pre-fill sensitive data
          streetAddress: data.street_address || "",
          postalCode: data.postal_code || "",
          city: data.city || "",
          country: data.country || "SE",
          tin: data.tin || "",
          vatNumber: data.vat_number || "",
          entityType: data.entity_type || "individual",
          email: data.email || "",
          phone: data.phone || "",
          consentGiven: data.consent_given || false,
        });

        // Load rental incomes
        await loadRentalIncomes(data.id);
      }
    } catch (error) {
      console.error("Error checking existing DAC7 info:", error);
    }
  };

  const loadRentalIncomes = async (landlordId: string) => {
    try {
      const { data, error } = await supabase
        .from("dac7_rental_income")
        .select("*")
        .eq("landlord_info_id", landlordId)
        .order("reporting_period_start", { ascending: false });

      if (data && !error) {
        setRentalIncomes(data);
      }
    } catch (error) {
      console.error("Error loading rental incomes:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.consentGiven) {
      toast({
        title: "Samtycke krävs",
        description: "Du måste ge ditt samtycke för att fortsätta.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const dataToSubmit = {
        user_id: user?.id,
        legal_name: formData.legalName,
        business_name: formData.businessName || null,
        organization_number: formData.organizationNumber || null,
        personal_number: formData.personalNumber || null,
        street_address: formData.streetAddress,
        postal_code: formData.postalCode,
        city: formData.city,
        country: formData.country,
        tin: formData.tin || null,
        vat_number: formData.vatNumber || null,
        entity_type: formData.entityType,
        email: formData.email,
        phone: formData.phone || null,
        consent_given: formData.consentGiven,
        consent_date: new Date().toISOString(),
      };

      if (hasExistingInfo) {
        const { error } = await supabase
          .from("dac7_landlord_info")
          .update(dataToSubmit)
          .eq("user_id", user?.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("dac7_landlord_info")
          .insert([dataToSubmit])
          .select()
          .single();
        if (error) throw error;
        if (data) {
          setLandlordInfoId(data.id);
          setHasExistingInfo(true);
        }
      }

      toast({
        title: "Sparat!",
        description: "Din DAC 7-information har sparats.",
      });

      if (landlordInfoId) {
        await loadRentalIncomes(landlordInfoId);
      }
    } catch (error) {
      console.error("Error saving DAC7 info:", error);
      toast({
        title: "Fel",
        description: "Kunde inte spara din information. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="DAC 7 Skatteregistrering - Bostadsvyn"
        description="Registrera din information för DAC 7-rapportering enligt EU:s direktiv för uthyrningsplattformar."
        keywords="DAC 7, skatteregistrering, uthyrning, Skatteverket, rapportering"
        canonicalUrl="https://bostadsvyn.se/dac7-compliance"
        noIndex={true}
      />
      <Navigation />
      <main
        id="main-content"
        className="container mx-auto px-4 py-12 max-w-4xl"
      >
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

        {/* Information Alert */}
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

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Typ av uthyrare</CardTitle>
              <CardDescription>
                Välj om du hyr ut som privatperson eller företag
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="entityType">Jag hyr ut som</Label>
                <Select
                  value={formData.entityType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, entityType: value })
                  }
                >
                  <SelectTrigger id="entityType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Privatperson</SelectItem>
                    <SelectItem value="company">
                      Företag (AB, HB, etc.)
                    </SelectItem>
                    <SelectItem value="partnership">Handelsbolag</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personuppgifter / Företagsuppgifter</CardTitle>
              <CardDescription>
                Fyll i dina uppgifter som de står i officiella dokument
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="legalName">
                  {formData.entityType === "individual"
                    ? "Fullständigt namn"
                    : "Företagsnamn"}{" "}
                  *
                </Label>
                <Input
                  id="legalName"
                  value={formData.legalName}
                  onChange={(e) =>
                    setFormData({ ...formData, legalName: e.target.value })
                  }
                  required
                  placeholder="För- och efternamn eller företagsnamn"
                />
              </div>

              {formData.entityType !== "individual" && (
                <>
                  <div>
                    <Label htmlFor="organizationNumber">
                      Organisationsnummer *
                    </Label>
                    <Input
                      id="organizationNumber"
                      value={formData.organizationNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organizationNumber: e.target.value,
                        })
                      }
                      required={formData.entityType !== "individual"}
                      placeholder="XXXXXX-XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vatNumber">
                      VAT-nummer (om tillämpligt)
                    </Label>
                    <Input
                      id="vatNumber"
                      value={formData.vatNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, vatNumber: e.target.value })
                      }
                      placeholder="SEXXXXXXXXXXXX01"
                    />
                  </div>
                </>
              )}

              {formData.entityType === "individual" && (
                <div>
                  <Label htmlFor="personalNumber">Personnummer *</Label>
                  <Input
                    id="personalNumber"
                    type="password"
                    value={formData.personalNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalNumber: e.target.value,
                      })
                    }
                    required={formData.entityType === "individual"}
                    placeholder="ÅÅÅÅMMDD-XXXX"
                    autoComplete="off"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Lagras krypterat enligt GDPR
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="tin">Tax Identification Number (TIN)</Label>
                <Input
                  id="tin"
                  value={formData.tin}
                  onChange={(e) =>
                    setFormData({ ...formData, tin: e.target.value })
                  }
                  placeholder="Ditt skatte-ID"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Samma som personnummer för svenska medborgare
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Adressuppgifter</CardTitle>
              <CardDescription>
                Din folkbokföringsadress eller företagets säte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="streetAddress">Gatuadress *</Label>
                <Input
                  id="streetAddress"
                  value={formData.streetAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, streetAddress: e.target.value })
                  }
                  required
                  placeholder="Gatunamn och nummer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postnummer *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    required
                    placeholder="XXX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ort *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                    placeholder="Stad"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Land</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData({ ...formData, country: value })
                  }
                >
                  <SelectTrigger id="country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SE">Sverige</SelectItem>
                    <SelectItem value="NO">Norge</SelectItem>
                    <SelectItem value="DK">Danmark</SelectItem>
                    <SelectItem value="FI">Finland</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Kontaktuppgifter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">E-postadress *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  placeholder="din@email.se"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefonnummer</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+46 XX XXX XX XX"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle
                  className="h-5 w-5 text-amber-600"
                  aria-hidden="true"
                />
                Samtycke och bekräftelse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={formData.consentGiven}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      consentGiven: checked as boolean,
                    })
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="consent"
                    className="text-sm font-medium leading-relaxed cursor-pointer"
                  >
                    Jag bekräftar att informationen ovan är korrekt och ger mitt
                    samtycke till att Bostadsvyn lagrar och rapporterar denna
                    information till Skatteverket enligt DAC 7-direktivet (EU
                    2021/514). Jag förstår att detta är ett lagkrav för
                    plattformar som förmedlar uthyrning och att informationen
                    behandlas enligt GDPR.
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {loading
                ? "Sparar..."
                : hasExistingInfo
                  ? "Uppdatera information"
                  : "Spara information"}
            </Button>
          </div>

          {formData.consentGiven && (
            <Alert className="mt-6 bg-green-50 dark:bg-green-950 border-green-200">
              <CheckCircle
                className="h-4 w-4 text-green-600"
                aria-hidden="true"
              />
              <AlertTitle>Tack för ditt samtycke</AlertTitle>
              <AlertDescription>
                Din information kommer att behandlas konfidentiellt och endast
                användas för DAC 7-rapportering till Skatteverket.
              </AlertDescription>
            </Alert>
          )}
        </form>

        {/* Rental Income Management */}
        {landlordInfoId && (
          <div className="mt-12 space-y-6">
            <RentalIncomeForm
              landlordInfoId={landlordInfoId}
              onSuccess={() =>
                landlordInfoId && loadRentalIncomes(landlordInfoId)
              }
            />
            <RentalIncomeList incomes={rentalIncomes} />

            {/* Report Generator */}
            {rentalIncomes.length > 0 && <ReportGenerator />}
          </div>
        )}
      </main>
      <LegalFooter />
    </div>
  );
};

export default DAC7Compliance;
