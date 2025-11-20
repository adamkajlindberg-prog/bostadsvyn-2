"use client";

import type { Property } from "db";
import {
  AlertCircle,
  BarChart3,
  Bot,
  Calculator,
  Calendar,
  Clock,
  Heart,
  History,
  Home,
  MessageSquare,
  Plus,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@/auth/config";
import PropertyCard from "@/components/property-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DashboardStats } from "@/lib/dashboard";

interface UserDashboardProps {
  user: User;
  stats: DashboardStats;
  favoriteProperties: Property[];
  // biome-ignore lint/suspicious/noExplicitAny: Ad type will be properly typed when ad schema is finalized
  rentalAds: any[];
  // biome-ignore lint/suspicious/noExplicitAny: Ad type will be properly typed when ad schema is finalized
  brokerSalesAds: any[];
  // biome-ignore lint/suspicious/noExplicitAny: Ad type will be properly typed when ad schema is finalized
  pendingApprovalAds: any[];
  // biome-ignore lint/suspicious/noExplicitAny: Ad type will be properly typed when ad schema is finalized
  pendingApprovalProjects: any[];
}

export const UserDashboard = ({
  user,
  stats,
  favoriteProperties,
  rentalAds,
  brokerSalesAds,
  pendingApprovalAds,
}: UserDashboardProps) => {
  const router = useRouter();

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "AN";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              Välkommen, {user?.name || "Användare"}
            </h1>
            <div className="flex gap-2 items-center flex-wrap">
              {user?.role && (
                <Badge variant="secondary">
                  {user.role === "admin"
                    ? "Admin"
                    : user.role === "broker"
                      ? "Mäklare"
                      : user.role === "seller"
                        ? "Säljare"
                        : user.role}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="favorites">Favoriter</TabsTrigger>
          <TabsTrigger value="my-ads">Mina annonser</TabsTrigger>
          <TabsTrigger value="group">Grupp</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="tools">
            <Calculator className="h-4 w-4 mr-1" />
            Verktyg
          </TabsTrigger>
          <TabsTrigger value="ai-gallery">
            <Sparkles className="h-4 w-4 mr-1" />
            AI-bildgalleri
          </TabsTrigger>
          <TabsTrigger value="ai-tools">
            <Wand2 className="h-4 w-4 mr-1" />
            AI-verktyg
          </TabsTrigger>
          <TabsTrigger value="settings">Inställningar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Översikt över dina sektioner
            </h2>
            <p className="text-muted-foreground">
              Välj en sektion nedan för att komma igång med att hantera dina
              annonser, favoriter och inställningar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Favoriter Card */}
            <Card
              className="hover:border-primary transition-colors cursor-pointer"
              onClick={() => {
                const favTab = document.querySelector(
                  '[value="favorites"]',
                ) as HTMLElement;
                favTab?.click();
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-red-500/10">
                    <Heart className="h-6 w-6 text-red-500" />
                  </div>
                  <CardTitle>Favoriter</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Se och hantera alla dina sparade favoritbostäder på ett
                  ställe.
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  {stats.favoriteCount} favoriter
                </div>
              </CardContent>
            </Card>

            {/* Mina Annonser Card */}
            <Card
              className="hover:border-primary transition-colors cursor-pointer"
              onClick={() => {
                const adsTab = document.querySelector(
                  '[value="my-ads"]',
                ) as HTMLElement;
                adsTab?.click();
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Home className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Mina Annonser</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {user?.role === "broker"
                    ? "Hantera försäljningsannonser och mäklaruppdrag via Mäklarportalen."
                    : "Skapa och hantera hyresannonser för uthyrning."}
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Se annonser och statistik
                </div>
              </CardContent>
            </Card>

            {/* Grupp Card */}
            <Card
              className="hover:border-primary transition-colors cursor-pointer"
              onClick={() => {
                const groupTab = document.querySelector(
                  '[value="group"]',
                ) as HTMLElement;
                groupTab?.click();
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle>Gruppkonton</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Samarbeta med familj och vänner för att hitta och rösta på
                  bostäder.
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Gå till gruppkonton
                </div>
              </CardContent>
            </Card>

            {/* AI-bilder Card */}
            <Card
              className="hover:border-primary transition-colors cursor-pointer"
              onClick={() => {
                const aiTab = document.querySelector(
                  '[value="ai-gallery"]',
                ) as HTMLElement;
                aiTab?.click();
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-pink-500/10">
                    <Sparkles className="h-6 w-6 text-pink-500" />
                  </div>
                  <CardTitle>AI-bildgalleri</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Se och hantera dina AI-genererade bilder för
                  fastighetsannonser.
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Öppna bildgalleri
                </div>
              </CardContent>
            </Card>

            {/* AI-verktyg Card */}
            <Card
              className="hover:border-primary transition-colors cursor-pointer"
              onClick={() => {
                const aiToolsTab = document.querySelector(
                  '[value="ai-tools"]',
                ) as HTMLElement;
                aiToolsTab?.click();
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <Wand2 className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle>AI-verktyg</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Använd AI för att förbättra dina annonser och analysera
                  marknaden.
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Öppna AI-verktyg
                </div>
              </CardContent>
            </Card>

            {/* Meddelanden Card */}
            <Card className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <MessageSquare className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle>Meddelanden</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Se alla dina chatkonversationer och obesvarade meddelanden.
                </p>
                <Button
                  onClick={() => router.push("/messages")}
                  variant="default"
                  className="mt-2"
                >
                  Öppna meddelanden
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="my-ads" className="space-y-6">
          {/* Pending Approval Ads Section */}
          {pendingApprovalAds.length > 0 && (
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
                <h2 className="text-2xl font-bold">
                  Inväntar ditt godkännande
                </h2>
                <Badge variant="outline" className="bg-yellow-500/10">
                  {pendingApprovalAds.length} annons
                  {pendingApprovalAds.length !== 1 ? "er" : ""}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Granska och godkänn annonserna nedan för att publicera dem.
              </p>
              {/* TODO: Add SellerAdReview component */}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Mina annonser</h2>
                {user?.role !== "broker" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Skapa hyresannonser för bostäder och lokaler eller följ din
                    egna bostadsförsäljning
                  </p>
                )}
              </div>
              <Button asChild>
                <Link href="/skapa-hyresannons">
                  <Plus className="h-4 w-4 mr-2" />
                  Skapa hyresannons
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              {/* Rental Ads Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Uthyrning</CardTitle>
                </CardHeader>
                <CardContent>
                  {rentalAds.length === 0 ? (
                    <div className="text-center py-12">
                      <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Inga hyresannonser ännu
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Skapa din första hyresannons för att börja hyra ut din
                        bostad.
                      </p>
                      <Button asChild>
                        <Link href="/property-management">
                          <Plus className="h-4 w-4 mr-2" />
                          Skapa hyresannons
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {/* biome-ignore lint/suspicious/noExplicitAny: Ad type will be properly typed when ad schema is finalized */}
                      {rentalAds.slice(0, 5).map((ad: any) => (
                        <div key={ad.id} className="relative">
                          <Card>
                            <CardHeader>
                              <CardTitle>{ad.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                {ad.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Skapad:{" "}
                                  {new Date(ad.createdAt).toLocaleDateString(
                                    "sv-SE",
                                  )}
                                </span>
                                {ad.expiresAt && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Utgår:{" "}
                                    {new Date(ad.expiresAt).toLocaleDateString(
                                      "sv-SE",
                                    )}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Broker Sales Ads Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Försäljning</CardTitle>
                </CardHeader>
                <CardContent>
                  {brokerSalesAds.length === 0 ? (
                    <div className="text-center py-12">
                      <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Inga försäljningsannonser ännu
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Här visas dina försäljningsannonser som hanteras av
                        mäklare.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {/* biome-ignore lint/suspicious/noExplicitAny: Ad type will be properly typed when ad schema is finalized */}
                      {brokerSalesAds.slice(0, 5).map((ad: any) => (
                        <div key={ad.id} className="relative">
                          <Card>
                            <CardHeader>
                              <CardTitle>{ad.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                {ad.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Publicerad:{" "}
                                  {new Date(ad.createdAt).toLocaleDateString(
                                    "sv-SE",
                                  )}
                                </span>
                                {ad.expiresAt && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Utgår:{" "}
                                    {new Date(ad.expiresAt).toLocaleDateString(
                                      "sv-SE",
                                    )}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Mina favoriter</h2>
            <p className="text-muted-foreground">
              {stats.favoriteCount} favoriter
            </p>
          </div>

          {favoriteProperties.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Inga favoriter ännu
                </h3>
                <p className="text-muted-foreground mb-4">
                  Börja spara fastigheter som du gillar för att enkelt hitta dem
                  senare.
                </p>
                <Button asChild>
                  <Link href="/search">Utforska fastigheter</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {favoriteProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="group" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gruppkonton
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Skapa eller gå med i en grupp
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Samarbeta med familj och vänner för att hitta och rösta på
                bostäder. Fungerar för både köp, hyresrätter och kommersiella
                fastigheter.
              </p>
              <Button asChild size="lg">
                <Link href="/familjekonton">
                  <Users className="h-4 w-4 mr-2" />
                  Gå till gruppkonton
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Verktyg & Tjänster</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Kraftfulla verktyg för att hjälpa dig i din fastighetsresa
              </p>
            </div>
            {/* TODO: Add PropertyComparison and MortgageCalculator components */}
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Verktyg kommer snart</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-gallery" className="space-y-6">
          {/* TODO: Add AIImageGallery component */}
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                AI-bildgalleri kommer snart
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-6">
          <Tabs defaultValue="advisor" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 gap-1">
              <TabsTrigger
                value="advisor"
                className="flex items-center gap-1 text-xs px-2"
              >
                <Bot className="h-3 w-3" />
                <span className="hidden sm:inline">AI-Rådgivare</span>
              </TabsTrigger>
              <TabsTrigger
                value="homestyling"
                className="flex items-center gap-1 text-xs px-2"
              >
                <Home className="h-3 w-3" />
                <span className="hidden sm:inline">Homestyling</span>
              </TabsTrigger>
              <TabsTrigger
                value="valuation"
                className="flex items-center gap-1 text-xs px-2"
              >
                <Calculator className="h-3 w-3" />
                <span className="hidden sm:inline">Värdering</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-1 text-xs px-2"
              >
                <History className="h-3 w-3" />
                <span className="hidden sm:inline">Historik</span>
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="flex items-center gap-1 text-xs px-2"
              >
                <BarChart3 className="h-3 w-3" />
                <span className="hidden sm:inline">Marknadsanalys</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="advisor">
              {/* TODO: Add AIPropertyAdvisor component */}
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    AI-rådgivare kommer snart
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="homestyling">
              {/* TODO: Add AIHomestyling component */}
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    AI-homestyling kommer snart
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="valuation">
              {/* TODO: Add AIPropertyValuation component */}
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    AI-värdering kommer snart
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis">
              {/* TODO: Add AIMarketAnalysis component */}
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    Marknadsanalys kommer snart
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              {/* TODO: Add AIAnalysisHistory component */}
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    Analyshistorik kommer snart
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          {/* TODO: Add ProfileEditor component */}
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                Profilredigering kommer snart
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* TODO: Add UserProfile component */}
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                Inställningar kommer snart
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
