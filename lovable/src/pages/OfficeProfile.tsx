import {
  Building2,
  Globe,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OfficeInfo {
  id: string;
  office_name: string;
  office_address: string;
  office_city: string;
  office_postal_code: string;
  office_phone: string;
  office_email: string;
  office_website: string;
}

interface BrokerInfo {
  id: string;
  user_id: string;
  broker_name: string;
  broker_email: string;
  broker_phone: string;
  property_count: number;
  total_area: number;
  avg_price: number;
}

interface OfficeStats {
  total_properties: number;
  for_sale: number;
  coming_soon: number;
  average_price: number;
  total_area: number;
  total_brokers: number;
}

export default function OfficeProfile() {
  const { officeId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [office, setOffice] = useState<OfficeInfo | null>(null);
  const [brokers, setBrokers] = useState<BrokerInfo[]>([]);
  const [stats, setStats] = useState<OfficeStats>({
    total_properties: 0,
    for_sale: 0,
    coming_soon: 0,
    average_price: 0,
    total_area: 0,
    total_brokers: 0,
  });
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (officeId) {
      loadOfficeData();
    }
  }, [officeId, loadOfficeData]);

  const loadOfficeData = async () => {
    try {
      setLoading(true);

      // Fetch office info
      const { data: officeData, error: officeError } = await supabase
        .from("broker_offices")
        .select("*")
        .eq("id", officeId)
        .single();

      // Fallback to demo office if not found
      const office = officeData || {
        id: officeId || "demo-office",
        office_name: "Hemma Mäkleri Stockholm",
        office_address: "Storgatan 15",
        office_city: "Stockholm",
        office_postal_code: "114 51",
        office_phone: "08-123 456 78",
        office_email: "info@hemmamäkleri.se",
        office_website: "https://hemmamäkleri.se",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setOffice(office);

      // Fetch brokers at this office
      const { data: brokersData, error: brokersError } = await supabase
        .from("brokers")
        .select("*")
        .eq("office_id", officeId);

      // Fallback to demo brokers if not found or empty
      const brokers =
        brokersData && brokersData.length > 0
          ? brokersData
          : [
              {
                id: "demo-broker-1",
                user_id: "demo-user-1",
                broker_name: "Anna Andersson",
                broker_email: "anna@hemmamäkleri.se",
                broker_phone: "070-123 45 67",
                office_id: officeId || "demo-office",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: "demo-broker-2",
                user_id: "demo-user-2",
                broker_name: "Erik Eriksson",
                broker_email: "erik@hemmamäkleri.se",
                broker_phone: "070-234 56 78",
                office_id: officeId || "demo-office",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: "demo-broker-3",
                user_id: "demo-user-3",
                broker_name: "Maria Svensson",
                broker_email: "maria@hemmamäkleri.se",
                broker_phone: "070-345 67 89",
                office_id: officeId || "demo-office",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ];

      // Get property stats for each broker
      const brokersWithStats = await Promise.all(
        brokers.map(async (broker) => {
          const { data: propData } = await supabase
            .from("properties")
            .select("*")
            .eq("user_id", broker.user_id);

          const propertyCount = propData?.length || 0;
          const totalArea =
            propData?.reduce((sum, p) => sum + (p.living_area || 0), 0) || 0;
          const avgPrice =
            propertyCount > 0
              ? propData.reduce((sum, p) => sum + (p.price || 0), 0) /
                propertyCount
              : 0;

          return {
            id: broker.id,
            user_id: broker.user_id,
            broker_name: broker.broker_name,
            broker_email: broker.broker_email,
            broker_phone: broker.broker_phone,
            property_count: propertyCount,
            total_area: totalArea,
            avg_price: avgPrice,
          };
        }),
      );

      setBrokers(brokersWithStats);

      // Fetch all properties from all brokers at this office
      const userIds = brokers.map((b) => b.user_id);
      if (userIds.length > 0) {
        const { data: propertiesData } = await supabase
          .from("properties")
          .select("*")
          .in("user_id", userIds)
          .order("created_at", { ascending: false });

        setProperties((propertiesData || []) as unknown as Property[]);

        // Calculate office-wide stats
        const totalProperties = propertiesData?.length || 0;
        const forSale =
          propertiesData?.filter((p) => p.status === "for_sale").length || 0;
        const comingSoon =
          propertiesData?.filter((p) => p.status === "coming_soon").length || 0;
        const avgPrice =
          totalProperties > 0
            ? propertiesData.reduce((sum, p) => sum + (p.price || 0), 0) /
              totalProperties
            : 0;
        const totalArea =
          propertiesData?.reduce((sum, p) => sum + (p.living_area || 0), 0) ||
          0;

        setStats({
          total_properties: totalProperties,
          for_sale: forSale,
          coming_soon: comingSoon,
          average_price: avgPrice,
          total_area: totalArea,
          total_brokers: brokers.length,
        });
      } else {
        // Set default stats if no properties
        setStats({
          total_properties: 0,
          for_sale: 0,
          coming_soon: 0,
          average_price: 0,
          total_area: 0,
          total_brokers: brokers.length,
        });
      }
    } catch (error) {
      console.error("Error loading office data:", error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda kontorets information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-24 pb-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-64 w-full mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
        <LegalFooter />
      </>
    );
  }

  if (!office) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-24 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Kontoret hittades inte</h1>
          </div>
        </div>
        <LegalFooter />
      </>
    );
  }

  const forSaleProperties = properties.filter((p) => p.status === "FOR_SALE");
  const comingSoonProperties = properties.filter(
    (p) => p.status === "COMING_SOON",
  );

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Office Header */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="flex-grow">
                <h1 className="text-3xl font-bold mb-2">
                  {office.office_name}
                </h1>
                <div className="flex flex-wrap gap-4 text-muted-foreground mt-4">
                  {office.office_address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {office.office_address}, {office.office_postal_code}{" "}
                        {office.office_city}
                      </span>
                    </div>
                  )}
                  {office.office_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{office.office_phone}</span>
                    </div>
                  )}
                  {office.office_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{office.office_email}</span>
                    </div>
                  )}
                  {office.office_website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <a
                        href={office.office_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        {office.office_website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Office Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Antal mäklare</p>
                  <p className="text-2xl font-bold">{stats.total_brokers}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Totalt antal objekt
                  </p>
                  <p className="text-2xl font-bold">{stats.total_properties}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Medelpris</p>
                  <p className="text-2xl font-bold">
                    {stats.average_price.toLocaleString("sv-SE")} kr
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total yta</p>
                  <p className="text-2xl font-bold">
                    {stats.total_area.toLocaleString("sv-SE")} m²
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Brokers List */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Våra mäklare</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brokers.map((broker) => (
                <Card
                  key={broker.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/maklare/${broker.user_id}`)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {broker.broker_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">
                        {broker.broker_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Fastighetsmäklare
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span>{broker.broker_phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>{broker.broker_email}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t space-y-1 text-sm">
                        <p>
                          <span className="font-medium">
                            {broker.property_count}
                          </span>{" "}
                          objekt
                        </p>
                        <p>
                          <span className="font-medium">
                            {broker.avg_price.toLocaleString("sv-SE")} kr
                          </span>{" "}
                          snitt
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Properties Tabs */}
          <Tabs defaultValue="for-sale" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="for-sale" className="flex-1">
                Till salu ({forSaleProperties.length})
              </TabsTrigger>
              <TabsTrigger value="coming-soon" className="flex-1">
                Snart till salu ({comingSoonProperties.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="for-sale" className="mt-6">
              {forSaleProperties.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    Inga objekt till salu just nu
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {forSaleProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="coming-soon" className="mt-6">
              {comingSoonProperties.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Inga kommande objekt</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {comingSoonProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <LegalFooter />
    </>
  );
}
