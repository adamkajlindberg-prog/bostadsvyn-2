import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  Edit,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface PendingProject {
  id: string;
  title: string;
  property_id: string;
  created_at: string;
  moderation_status: string;
  address?: string;
  project_id?: string;
}

const NyproduktionProjectForm = () => {
  const { user } = useAuth();
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<PendingProject | null>(
    null,
  );
  const [formStep, setFormStep] = useState(1);

  // Form state
  const [projectDetails, setProjectDetails] = useState({
    projectName: "",
    projectDescription: "",
    totalUnits: 0,
    completionDate: "",
    videoUrl: "",
    videoAsFirstImage: false,
    threedTourUrl: "",
    builderCompany: "",
    architectFirm: "",
    projectWebsite: "",
  });

  const [recommendedPackages, setRecommendedPackages] = useState({
    free: false,
    plus: false,
    premium: true,
  });

  const [brokerRecommendation, setBrokerRecommendation] = useState("");

  const handlePackageSelect = (packageName: "free" | "plus" | "premium") => {
    setRecommendedPackages({
      free: packageName === "free",
      plus: packageName === "plus",
      premium: packageName === "premium",
    });
  };

  const [sellerInfo, setSellerInfo] = useState({
    type: "company",
    name: "",
    email: "",
    phone: "",
    orgNumber: "",
    contactPerson: "",
    notes: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    payer: "seller",
  });

  const [publishInfo, setPublishInfo] = useState({
    timing: "on_completion",
    specificDate: "",
    specificTime: "12:00",
  });

  const [propertyAddress, setPropertyAddress] = useState("");

  useEffect(() => {
    if (user) {
      fetchPendingProjects();
    }
  }, [user, fetchPendingProjects]);

  const fetchPendingProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_nyproduktion", true)
        .is("nyproduktion_project_id", null)
        .in("moderation_status", ["pending", "draft"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Add example project for demonstration
      const exampleProject: PendingProject = {
        id: "example-project-1",
        title: "Solhem Nyproduktion",
        property_id: "example-property-1",
        created_at: new Date().toISOString(),
        moderation_status: "pending",
        address: "Solhemsgatan 15, 118 27 Stockholm",
        project_id: "PRJ-2025-001",
      };

      // Map properties to PendingProject format
      const mappedProjects: PendingProject[] = (data || []).map((prop) => ({
        id: prop.id,
        title: prop.title || "",
        property_id: prop.id,
        created_at: prop.created_at,
        moderation_status: prop.moderation_status,
        address: `${prop.address_street}, ${prop.address_city}`,
        project_id: undefined,
      }));

      setPendingProjects([exampleProject, ...mappedProjects]);
    } catch (error) {
      console.error("Error fetching pending projects:", error);
      toast.error("Kunde inte hämta väntande projekt");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProject = async () => {
    if (!selectedProject) return;

    if (!propertyAddress.trim()) {
      toast.error("Vänligen fyll i projektets adress");
      return;
    }

    if (!projectDetails.projectName || !projectDetails.totalUnits) {
      toast.error("Vänligen fyll i projektnamn och antal enheter");
      return;
    }

    if (!sellerInfo.name || !sellerInfo.email || !sellerInfo.phone) {
      toast.error("Vänligen fyll i all säljinformation");
      return;
    }

    if (
      publishInfo.timing === "specific_date" &&
      (!publishInfo.specificDate || !publishInfo.specificTime)
    ) {
      toast.error("Vänligen välj både datum och tid för publicering");
      return;
    }

    try {
      const billingAddress =
        paymentInfo.payer === "seller"
          ? {
              address: propertyAddress,
              name: sellerInfo.name,
              orgNumber: sellerInfo.orgNumber,
            }
          : {
              name: user?.email || "Mäklarkontor",
              address: "Hämtas från kontouppgifter",
            };

      const brokerFormData = {
        projectDetails,
        recommendedPackages,
        propertyInfo: {
          address: propertyAddress,
          seller: sellerInfo,
        },
        paymentInfo: {
          payer: paymentInfo.payer,
          billingAddress: billingAddress,
        },
        publishInfo,
        brokerRecommendation,
      };

      // Create ad entry for the project
      const { data: adData, error: adError } = await supabase
        .from("ads")
        .insert({
          property_id: selectedProject.property_id,
          user_id: user?.id,
          title: projectDetails.projectName,
          description: projectDetails.projectDescription,
          ad_tier: recommendedPackages.premium
            ? "premium"
            : recommendedPackages.plus
              ? "plus"
              : "free",
          moderation_status: "pending_seller_approval",
          broker_form_data: brokerFormData,
        })
        .select()
        .single();

      if (adError) throw adError;

      // Update property with project info
      const { error: propError } = await supabase
        .from("properties")
        .update({
          nyproduktion_total_units: projectDetails.totalUnits,
          moderation_status: "pending_seller_approval",
        })
        .eq("id", selectedProject.property_id);

      if (propError) throw propError;

      toast.success("Projektet har skickats till säljaren för godkännande!");
      resetForm();
      fetchPendingProjects();
    } catch (error) {
      console.error("Error completing project:", error);
      toast.error("Kunde inte färdigställa projektet");
    }
  };

  const resetForm = () => {
    setSelectedProject(null);
    setFormStep(1);
    setPropertyAddress("");
    setProjectDetails({
      projectName: "",
      projectDescription: "",
      totalUnits: 0,
      completionDate: "",
      videoUrl: "",
      videoAsFirstImage: false,
      threedTourUrl: "",
      builderCompany: "",
      architectFirm: "",
      projectWebsite: "",
    });
    setRecommendedPackages({
      free: false,
      plus: false,
      premium: true,
    });
    setBrokerRecommendation("");
    setSellerInfo({
      type: "company",
      name: "",
      email: "",
      phone: "",
      orgNumber: "",
      contactPerson: "",
      notes: "",
    });
    setPaymentInfo({
      payer: "seller",
    });
    setPublishInfo({
      timing: "on_completion",
      specificDate: "",
      specificTime: "12:00",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Laddar väntande projekt...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="border-warning bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h3 className="font-medium text-warning">
                Väntande Nyproduktionsprojekt
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Dessa projekt har lagts till via mäklarsystemet och behöver
                information innan de kan publiceras.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Projects List */}
      {pendingProjects.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Inga väntande projekt</h3>
            <p className="text-muted-foreground">
              Alla dina Nyproduktionsprojekt är färdigställda och publicerade.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingProjects.map((project) => (
            <Card key={project.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Väntande
                      </Badge>
                    </div>
                    {project.project_id && (
                      <p className="text-xs font-mono text-muted-foreground mb-2">
                        ProjektID: {project.project_id}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mb-3">
                      Skapad:{" "}
                      {new Date(project.created_at).toLocaleDateString(
                        "sv-SE",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedProject(project);
                      if (project.address) {
                        setPropertyAddress(project.address);
                      }
                    }}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Fyll i projektuppgifter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Multi-step Form */}
      {selectedProject && (
        <Card>
          <CardHeader>
            <CardTitle>
              Färdigställ Nyproduktionsprojekt - {selectedProject.title}
            </CardTitle>
            {selectedProject.project_id && (
              <div className="text-xs font-mono text-muted-foreground mt-1">
                ProjektID: {selectedProject.project_id}
              </div>
            )}
            <CardDescription>
              Steg {formStep} av 5:{" "}
              {formStep === 1
                ? "Projektinformation"
                : formStep === 2
                  ? "Rekommenderade paket"
                  : formStep === 3
                    ? "Säljinformation"
                    : formStep === 4
                      ? "Betalning & Publicering"
                      : "Granska & Skicka"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Project Information */}
            {formStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyAddress">Projektets adress *</Label>
                  <Input
                    id="propertyAddress"
                    placeholder="Gatuadress, postnummer, ort"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className={selectedProject?.address ? "bg-muted" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectName">Projektnamn *</Label>
                  <Input
                    id="projectName"
                    placeholder="T.ex. Solhem Nyproduktion"
                    value={projectDetails.projectName}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        projectName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Projektbeskrivning</Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="Beskriv projektet..."
                    rows={5}
                    value={projectDetails.projectDescription}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        projectDescription: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalUnits">Totalt antal enheter *</Label>
                    <Input
                      id="totalUnits"
                      type="number"
                      min="1"
                      placeholder="T.ex. 45"
                      value={projectDetails.totalUnits || ""}
                      onChange={(e) =>
                        setProjectDetails({
                          ...projectDetails,
                          totalUnits: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="completionDate">
                      Beräknat färdigställande
                    </Label>
                    <Input
                      id="completionDate"
                      type="date"
                      value={projectDetails.completionDate}
                      onChange={(e) =>
                        setProjectDetails({
                          ...projectDetails,
                          completionDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="builderCompany">Byggföretag</Label>
                  <Input
                    id="builderCompany"
                    placeholder="Namn på byggföretag"
                    value={projectDetails.builderCompany}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        builderCompany: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="architectFirm">Arkitektfirma</Label>
                  <Input
                    id="architectFirm"
                    placeholder="Namn på arkitektfirma"
                    value={projectDetails.architectFirm}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        architectFirm: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectWebsite">Projektets webbsida</Label>
                  <Input
                    id="projectWebsite"
                    type="url"
                    placeholder="https://exempel.se"
                    value={projectDetails.projectWebsite}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        projectWebsite: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">
                    Filmlänk (YouTube, Vimeo, etc.)
                  </Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={projectDetails.videoUrl}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        videoUrl: e.target.value,
                      })
                    }
                  />
                  {projectDetails.videoUrl && (
                    <div className="flex items-center gap-2 pt-2">
                      <Checkbox
                        id="videoAsFirstImage"
                        checked={projectDetails.videoAsFirstImage}
                        onCheckedChange={(checked) =>
                          setProjectDetails({
                            ...projectDetails,
                            videoAsFirstImage: checked as boolean,
                          })
                        }
                      />
                      <Label
                        htmlFor="videoAsFirstImage"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Använd film som förstabild
                      </Label>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threedTourUrl">3D-visningslänk</Label>
                  <Input
                    id="threedTourUrl"
                    type="url"
                    placeholder="https://..."
                    value={projectDetails.threedTourUrl}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        threedTourUrl: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* Step 2: Recommended Packages - Same as PendingAds */}
            {formStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">
                      Rekommenderade annonspaket
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Välj vilket paket du vill rekommendera till säljaren för
                      projektet.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Package options same as PendingAds */}
                    <div
                      className="border rounded-lg p-4 space-y-3 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => handlePackageSelect("premium")}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="package-premium"
                          checked={recommendedPackages.premium}
                          onCheckedChange={() => handlePackageSelect("premium")}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="package-premium"
                            className="font-medium cursor-pointer text-lg"
                          >
                            Exklusivpaket - 8 999 kr
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Rekommenderat för Nyproduktionsprojekt
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokerRecommendation">
                    Din rekommendation till säljaren (valfritt)
                  </Label>
                  <Textarea
                    id="brokerRecommendation"
                    placeholder="Skriv varför du rekommenderar detta paket..."
                    rows={4}
                    value={brokerRecommendation}
                    onChange={(e) => setBrokerRecommendation(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Seller Information */}
            {formStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Företagsnamn *</Label>
                  <Input
                    id="companyName"
                    placeholder="AB Företaget"
                    value={sellerInfo.name}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orgNumber">Organisationsnummer *</Label>
                  <Input
                    id="orgNumber"
                    placeholder="556677-8899"
                    value={sellerInfo.orgNumber}
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        orgNumber: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Kontaktperson *</Label>
                  <Input
                    id="contactPerson"
                    placeholder="För- och efternamn"
                    value={sellerInfo.contactPerson}
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        contactPerson: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellerEmail">E-postadress *</Label>
                  <Input
                    id="sellerEmail"
                    type="email"
                    placeholder="exempel@email.com"
                    value={sellerInfo.email}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellerPhone">Telefonnummer *</Label>
                  <Input
                    id="sellerPhone"
                    type="tel"
                    placeholder="070-123 45 67"
                    value={sellerInfo.phone}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">
                    Ytterligare information (valfritt)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Särskilda önskemål eller information..."
                    rows={3}
                    value={sellerInfo.notes}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, notes: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Step 4: Payment & Publishing - Same structure as PendingAds */}
            {formStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base">Vem betalar för annonsen?</Label>
                  <RadioGroup
                    value={paymentInfo.payer}
                    onValueChange={(value) => setPaymentInfo({ payer: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seller" id="payer-seller" />
                      <Label
                        htmlFor="payer-seller"
                        className="font-normal cursor-pointer"
                      >
                        Säljaren betalar
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="broker" id="payer-broker" />
                      <Label
                        htmlFor="payer-broker"
                        className="font-normal cursor-pointer"
                      >
                        Mäklarkontoret betalar
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-base">
                    När ska projektet publiceras?
                  </Label>
                  <RadioGroup
                    value={publishInfo.timing}
                    onValueChange={(value) =>
                      setPublishInfo({ ...publishInfo, timing: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="on_completion"
                        id="timing-completion"
                      />
                      <Label
                        htmlFor="timing-completion"
                        className="font-normal cursor-pointer"
                      >
                        Direkt efter godkännande och betalning
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="specific_date"
                        id="timing-specific"
                      />
                      <Label
                        htmlFor="timing-specific"
                        className="font-normal cursor-pointer"
                      >
                        Vid specifikt datum och tid
                      </Label>
                    </div>
                  </RadioGroup>

                  {publishInfo.timing === "specific_date" && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div className="space-y-2">
                        <Label htmlFor="specificDate">Datum</Label>
                        <Input
                          id="specificDate"
                          type="date"
                          value={publishInfo.specificDate}
                          onChange={(e) =>
                            setPublishInfo({
                              ...publishInfo,
                              specificDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specificTime">Tid</Label>
                        <Input
                          id="specificTime"
                          type="time"
                          value={publishInfo.specificTime}
                          onChange={(e) =>
                            setPublishInfo({
                              ...publishInfo,
                              specificTime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Review & Send */}
            {formStep === 5 && (
              <div className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg">
                    Granska projektinformation
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Projektnamn:
                      </span>
                      <p className="font-medium">
                        {projectDetails.projectName}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Adress:
                      </span>
                      <p className="font-medium">{propertyAddress}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Antal enheter:
                      </span>
                      <p className="font-medium">
                        {projectDetails.totalUnits} st
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Paket:
                      </span>
                      <p className="font-medium">
                        {recommendedPackages.premium
                          ? "Exklusivpaket"
                          : recommendedPackages.plus
                            ? "Pluspaket"
                            : "Grundpaket"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Säljare:
                      </span>
                      <p className="font-medium">
                        {sellerInfo.name} ({sellerInfo.email})
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Betalare:
                      </span>
                      <p className="font-medium">
                        {paymentInfo.payer === "seller"
                          ? "Säljaren"
                          : "Mäklarkontoret"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <p className="text-sm text-muted-foreground">
                    När du skickar detta formulär kommer säljaren att få ett
                    e-postmeddelande med länk för att granska och godkänna
                    projektannonsen. Efter godkännande och betalning kommer
                    projektet att publiceras enligt dina inställningar.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <div>
                {formStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setFormStep(formStep - 1)}
                  >
                    Tillbaka
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={resetForm}>
                  Avbryt
                </Button>
                {formStep < 5 ? (
                  <Button onClick={() => setFormStep(formStep + 1)}>
                    Nästa
                  </Button>
                ) : (
                  <Button onClick={handleCompleteProject} className="gap-2">
                    <Send className="h-4 w-4" />
                    Skicka till säljaren
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NyproduktionProjectForm;
