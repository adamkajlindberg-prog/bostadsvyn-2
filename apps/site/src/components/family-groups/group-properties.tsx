"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Minus, Users, Heart } from "lucide-react";
import { toast } from "sonner";
import {
  getGroupProperties,
  addPropertyToGroup,
  type GroupPropertyWithDetails,
} from "@/lib/actions/groups";
import { PropertyVoting } from "./property-voting";

interface GroupPropertiesProps {
  groupId: string;
  userId: string;
}

export function GroupProperties({ groupId, userId }: GroupPropertiesProps) {
  const [groupProperties, setGroupProperties] = useState<
    GroupPropertyWithDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState<"active" | "rejected">("active");

  useEffect(() => {
    if (groupId) {
      loadGroupProperties();
    }
  }, [groupId]);

  const loadGroupProperties = async () => {
    if (!groupId) return;

    setIsLoading(true);
    try {
      const properties = await getGroupProperties(groupId);
      setGroupProperties(properties);
    } catch (error) {
      console.error("Error loading group properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number, status: string) => {
    if (status === "FOR_RENT") {
      return (
        new Intl.NumberFormat("sv-SE", {
          style: "currency",
          currency: "SEK",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(price) + "/mån"
      );
    }
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
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
      maybe: {
        label: "Kanske",
        variant: "outline" as const,
        icon: Minus,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.voting;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

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
                  Lägg till objekt från sökresultat eller favoriter för att börja
                  rösta tillsammans
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
            const property = groupProperty.property;
            if (!property) return null;

            return (
              <Card
                key={groupProperty.id}
                className={`
                transition-all duration-200 hover:shadow-lg
                ${
                  groupProperty.status === "approved"
                    ? "ring-2 ring-green-200 bg-green-50/50"
                    : ""
                }
                ${
                  groupProperty.status === "rejected"
                    ? "ring-2 ring-red-200 bg-red-50/50 opacity-75"
                    : ""
                }
                ${
                  groupProperty.status === "maybe"
                    ? "ring-2 ring-yellow-200 bg-yellow-50/50"
                    : ""
                }
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
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {property.addressStreet}, {property.addressCity}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xl text-primary">
                        {formatPrice(property.price, property.status)}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        {property.livingArea && `${property.livingArea} m²`}
                        {property.rooms && ` • ${property.rooms} rum`}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Tillagt av {groupProperty.addedByName || "Okänd"} •{" "}
                      {new Date(groupProperty.createdAt).toLocaleDateString("sv-SE")}
                    </div>

                    <div className="space-y-2">
                      <PropertyVoting
                        groupId={groupId}
                        propertyId={property.id}
                        currentStatus={groupProperty.status}
                        onVoteUpdated={loadGroupProperties}
                        userId={userId}
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

