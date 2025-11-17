import {
  BarChart3,
  Building2,
  CheckCircle,
  Clock,
  Home,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import SEOOptimization from "@/components/seo/SEOOptimization";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TEST_LISTING_PROPERTIES } from "@/data/testProperties";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BrokerInfo {
  id: string;
  user_id: string;
  broker_name: string;
  email?: string;
  phone?: string;
  license_number?: string;
  office_id?: string;
  office_name?: string;
  office_address?: string;
  office_city?: string;
  office_logo?: string;
  avatar_url?: string;
}
interface BrokerStats {
  totalProperties: number;
  forSaleProperties: number;
  comingSoonProperties: number;
  avgPrice: number;
  totalArea: number;
}
const BrokerProfile = () => {
  const { brokerId } = useParams<{
    brokerId: string;
  }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [broker, setBroker] = useState<BrokerInfo | null>(null);
  const [stats, setStats] = useState<BrokerStats | null>(null);
  const [forSaleProperties, setForSaleProperties] = useState<Property[]>([]);
  const [comingSoonProperties, setComingSoonProperties] = useState<Property[]>(
    [],
  );
  const [activeTab, setActiveTab] = useState("for-sale");
  useEffect(() => {
    if (brokerId) {
      loadBrokerData();
    }
  }, [brokerId, loadBrokerData]);
  const loadBrokerData = async () => {
    try {
      setLoading(true);

      // Load broker information with explicit type casting
      const brokerQuery = await supabase
        .from("brokers")
        .select(`
          *,
          broker_offices (
            office_name,
            office_address,
            office_city,
            office_postal_code
          )
        `)
        .eq("id", brokerId)
        .maybeSingle();
      const brokerData: any = brokerQuery.data;
      const brokerError: any = brokerQuery.error;
      if (brokerError) {
        // If no broker found, continue with mock data fallback
        console.warn("Broker not found, using fallback for demo");
      }
      if (brokerData) {
        const officeData = Array.isArray(brokerData.broker_offices)
          ? brokerData.broker_offices[0]
          : brokerData.broker_offices;
        setBroker({
          id: brokerData.id,
          user_id: brokerData.user_id,
          broker_name: brokerData.broker_name,
          email: brokerData.broker_email,
          phone: brokerData.broker_phone,
          license_number: brokerData.license_number,
          office_id: brokerData.office_id,
          office_name: officeData?.office_name,
          office_address: officeData?.office_address,
          office_city: officeData?.office_city,
          office_logo: undefined,
          avatar_url: undefined,
        });
      } else {
        // Fallback broker for demo/test
        setBroker({
          id: brokerId!,
          user_id: brokerId!,
          broker_name: "Exempelmäklare",
          email: "maklare@example.com",
          phone: "070-000 00 00",
          license_number: "LIC-12345",
          office_id: "demo-office",
          office_name: "Exempel Mäklarkontor",
          office_address: "Storgatan 1",
          office_city: "Stockholm",
          office_logo: undefined,
          avatar_url: undefined,
        });
      }

      // Load properties for this broker (DB) and fallback to test data
      try {
        const supabaseAny: any = supabase;
        const ownerId = brokerData?.user_id ? brokerData.user_id : brokerId;
        const propertiesQuery = await supabaseAny
          .from("properties")
          .select("*")
          .eq("user_id", ownerId);
        const dbProps: any[] = propertiesQuery.data || [];
        let allProps: any[] = dbProps;
        if (allProps.length === 0) {
          // Fallback to demo/test properties if none in DB
          allProps = TEST_LISTING_PROPERTIES.filter(
            (p) => (p as any).user_id === (brokerId || "test"),
          ) as any[];
          if (allProps.length === 0) {
            allProps = TEST_LISTING_PROPERTIES.filter(
              (p) => (p as any).user_id === "test",
            ) as any[];
          }
        }
        const forSale = allProps.filter(
          (p: any) => p.status === "FOR_SALE",
        ) as unknown as Property[];
        const comingSoon = allProps.filter(
          (p: any) => p.status === "COMING_SOON",
        ) as unknown as Property[];
        setForSaleProperties(forSale);
        setComingSoonProperties(comingSoon);

        // Calculate statistics
        const totalArea = allProps.reduce(
          (sum: number, p: any) => sum + (p.living_area || 0),
          0,
        );
        const avgPrice =
          allProps.length > 0
            ? allProps.reduce(
                (sum: number, p: any) => sum + (p.price || 0),
                0,
              ) / allProps.length
            : 0;
        setStats({
          totalProperties: allProps.length,
          forSaleProperties: forSale.length,
          comingSoonProperties: comingSoon.length,
          avgPrice,
          totalArea,
        });
      } catch (innerError) {
        console.error("Properties error:", innerError);
      }
    } catch (error: any) {
      console.error("Error loading broker data:", error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda mäklarinformation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <LegalFooter />
      </div>
    );
  }
  if (!broker) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                Mäklaren kunde inte hittas
              </p>
              <Button onClick={() => navigate("/")} className="mt-4">
                Tillbaka till startsidan
              </Button>
            </CardContent>
          </Card>
        </main>
        <LegalFooter />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title={`${broker.broker_name} - Mäklare | Bostadsvyn`}
        description={`Se ${broker.broker_name}s aktiva annonser, statistik och kontaktuppgifter. ${stats?.totalProperties || 0} aktiva objekt.`}
        keywords={`${broker.broker_name}, mäklare, fastigheter, bostäder`}
      />
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Broker Header Card */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left side - Broker Info */}
              <div className="flex-1">
                <div className="flex items-start gap-6 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={
                        broker.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(broker.broker_name)}&background=4F46E5&color=fff&size=96`
                      }
                    />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {broker.broker_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">
                      {broker.broker_name}
                    </h1>

                    {broker.license_number}

                    {/* Contact Info */}
                    <div className="space-y-2">
                      {broker.phone && (
                        <a
                          href={`tel:${broker.phone}`}
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          {broker.phone}
                        </a>
                      )}
                      {broker.email && (
                        <a
                          href={`mailto:${broker.email}`}
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          {broker.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Office Info */}
                {broker.office_name && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Kontor
                    </h3>
                    <div className="space-y-2">
                      <p className="font-medium">{broker.office_name}</p>
                      {(broker.office_address || broker.office_city) && (
                        <p className="text-sm text-muted-foreground flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>
                            {broker.office_address &&
                              `${broker.office_address}, `}
                            {broker.office_city}
                          </span>
                        </p>
                      )}
                      {broker.office_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() =>
                            navigate(`/kontor/${broker.office_id}`)
                          }
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Se alla mäklare på kontoret
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right side - Office Logo */}
              {broker.office_logo && (
                <div className="flex items-center justify-center md:w-64">
                  <div className="p-6 bg-muted rounded-lg">
                    <img
                      src={broker.office_logo}
                      alt={broker.office_name || "Mäklarkontor"}
                      className="h-24 w-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Totalt antal objekt
                    </p>
                    <p className="text-3xl font-bold">
                      {stats.totalProperties}
                    </p>
                  </div>
                  <Home className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Till salu
                    </p>
                    <p className="text-3xl font-bold text-success">
                      {stats.forSaleProperties}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Snart till salu
                    </p>
                    <p className="text-3xl font-bold text-accent">
                      {stats.comingSoonProperties}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Snittpris
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.avgPrice > 0
                        ? `${(stats.avgPrice / 1000000).toFixed(1)} Mkr`
                        : "-"}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Properties Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Aktiva annonser
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger
                  value="for-sale"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Till salu ({stats?.forSaleProperties || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="coming-soon"
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Snart till salu ({stats?.comingSoonProperties || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="for-sale" className="mt-6">
                {forSaleProperties.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {forSaleProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Inga annonser till salu för tillfället
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="coming-soon" className="mt-6">
                {comingSoonProperties.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {comingSoonProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Inga kommande annonser för tillfället
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <LegalFooter />
    </div>
  );
};
export default BrokerProfile;
