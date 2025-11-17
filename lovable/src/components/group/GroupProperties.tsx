import { Heart, Minus, ThumbsDown, ThumbsUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PropertyVoting } from "./PropertyVoting";

interface Property {
  id: string;
  title: string;
  price: number;
  address_street: string;
  address_city: string;
  images: string[];
  property_type: string;
  living_area: number;
  rooms: number;
  status: string;
}

interface GroupProperty {
  id: string;
  group_id: string;
  property_id: string;
  added_by: string;
  status: "voting" | "approved" | "rejected" | "maybe";
  created_at: string;
  properties?: Property;
  profiles?: {
    full_name: string;
  };
}

interface GroupVote {
  id: string;
  user_id: string;
  vote: "yes" | "no" | "maybe";
  profiles?: {
    full_name: string;
  };
}

export function GroupProperties({ groupId }: { groupId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groupProperties, setGroupProperties] = useState<GroupProperty[]>([]);
  const [_userGroup, setUserGroup] = useState<any>({ id: groupId });
  const [isLoading, setIsLoading] = useState(true);
  const [_votingProperty, _setVotingProperty] = useState<string | null>(null);
  const [viewFilter, setViewFilter] = useState<"active" | "rejected">("active");

  useEffect(() => {
    if (groupId) {
      setUserGroup({ id: groupId });
      loadGroupProperties();
    }
  }, [groupId, loadGroupProperties]);

  // Remove unused function
  const _loadUserGroup = async () => {
    // Not needed anymore since we get groupId as prop
  };

  const loadGroupProperties = async () => {
    if (!groupId) return;

    setIsLoading(true);
    try {
      const { data: properties, error } = await supabase
        .from("group_properties")
        .select(`
          *,
          properties!group_properties_property_id_fkey(*),
          profiles!group_properties_added_by_fkey(full_name)
        `)
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading group properties:", error);
        return;
      }

      setGroupProperties(properties || ([] as any));
    } catch (error) {
      console.error("Error loading group properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const _addPropertyToGroup = async (propertyId: string) => {
    if (!groupId || !user) return;

    try {
      const { error } = await supabase.from("group_properties").insert({
        group_id: groupId,
        property_id: propertyId,
        added_by: user.id,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Objektet finns redan",
            description: "Detta objekt är redan tillagt till gruppen",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Fel vid tillägg",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Objekt tillagt!",
        description: "Objektet har lagts till för gruppröstning",
      });

      loadGroupProperties();
    } catch (error) {
      console.error("Error adding property to group:", error);
      toast({
        title: "Fel",
        description: "Kunde inte lägga till objekt",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number, status: string) => {
    if (status === "FOR_RENT") {
      return `${new Intl.NumberFormat("sv-SE", {
        style: "currency",
        currency: "SEK",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)}/mån`;
    }
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string, _votes?: GroupVote[]) => {
    const statusConfig = {
      voting: {
        label: "Röstning pågår",
        variant: "secondary" as const,
        icon: Users,
      },
      approved: {
        label: "Godkänt",
        variant: "default" as const,
        icon: ThumbsUp,
      },
      rejected: {
        label: "Avvisat",
        variant: "destructive" as const,
        icon: ThumbsDown,
      },
      maybe: { label: "Kanske", variant: "outline" as const, icon: Minus },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (!user) return null;

  if (!groupId) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Du behöver vara medlem i en grupp för att se gemensamma objekt
          </p>
        </CardContent>
      </Card>
    );
  }

  const filteredProperties = groupProperties.filter((gp) =>
    viewFilter === "active"
      ? gp.status !== "rejected"
      : gp.status === "rejected",
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Gruppens sparade objekt
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Objekt som gruppmedlemmar har lagt till för gemensam röstning.
            Fungerar för både köp- och hyresobjekt.
          </p>
          <div className="flex gap-2 mt-4">
            <Button
              variant={viewFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewFilter("active")}
            >
              <Heart className="h-4 w-4 mr-1" />
              Aktiva favoriter
            </Button>
            <Button
              variant={viewFilter === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewFilter("rejected")}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Avvisade
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p>Laddar gruppens objekt...</p>
          </CardContent>
        </Card>
      ) : filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            {viewFilter === "active" ? (
              <>
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Inga aktiva objekt</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Lägg till objekt från sökresultat eller favoriter för att
                  börja rösta tillsammans
                </p>
              </>
            ) : (
              <>
                <ThumbsDown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Inga avvisade objekt</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Objekt som gruppen röstat nej till hamnar här
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((groupProperty) => {
            const property = groupProperty.properties;
            if (!property) return null;

            return (
              <Card
                key={groupProperty.id}
                className={`
                transition-all duration-200 hover:shadow-lg
                ${groupProperty.status === "approved" ? "ring-2 ring-green-200 bg-green-50/50" : ""}
                ${groupProperty.status === "rejected" ? "ring-2 ring-red-200 bg-red-50/50 opacity-75" : ""}
                ${groupProperty.status === "maybe" ? "ring-2 ring-yellow-200 bg-yellow-50/50" : ""}
              `}
              >
                <div className="relative">
                  {property.images && property.images.length > 0 && (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(groupProperty.status)}
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-background/90">
                      {property.status === "FOR_RENT" ? "Hyra" : "Köp"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {property.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {property.address_street}, {property.address_city}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xl text-primary">
                        {formatPrice(property.price, property.status)}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        {property.living_area && `${property.living_area} m²`}
                        {property.rooms && ` • ${property.rooms} rum`}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Tillagt av {groupProperty.profiles?.full_name || "Okänd"}{" "}
                      •{" "}
                      {new Date(groupProperty.created_at).toLocaleDateString(
                        "sv-SE",
                      )}
                    </div>

                    <div className="space-y-2">
                      <PropertyVoting
                        groupId={groupId}
                        propertyId={property.id}
                        currentStatus={groupProperty.status}
                        onVoteUpdated={loadGroupProperties}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
