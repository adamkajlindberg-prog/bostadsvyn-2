import { AlertCircle, Calendar, Clock, Home, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import type { Session } from "@/auth/config";
import { getServerSession } from "@/auth/server-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserAds } from "@/lib/dashboard";

export default async function MinaAnnonserPage() {
  const session = await getServerSession();
  if (!session?.user) {
    return null; // Layout handles redirect
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar annonser...</p>
          </div>
        </div>
      }
    >
      <MinaAnnonserSuspense session={session} />
    </Suspense>
  );
}

const MinaAnnonserSuspense = async ({ session }: { session: Session }) => {
  const adsData = await getUserAds(session.user.id);

  return (
    <>
      {/* Pending Approval Ads Section */}
      {adsData.pendingApprovalAds.length > 0 && (
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            <h2 className="text-lg sm:text-2xl font-bold">Inväntar ditt godkännande</h2>
            <Badge variant="outline" className="bg-yellow-500/10">
              {adsData.pendingApprovalAds.length} annons
              {adsData.pendingApprovalAds.length !== 1 ? "er" : ""}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Granska och godkänn annonserna nedan för att publicera dem.
          </p>
          {/* TODO: Add SellerAdReview component */}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold">Mina annonser</h2>
            {session.user?.role !== "broker" && (
              <p className="text-sm text-muted-foreground mt-1">
                Skapa hyresannonser för bostäder och lokaler eller följ din egna
                bostadsförsäljning
              </p>
            )}
          </div>
          <Button asChild className="w-full sm:w-auto">
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
              {adsData.rentalAds.length === 0 ? (
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
                  {adsData.rentalAds.slice(0, 5).map((ad: any) => (
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
              {adsData.salesAds.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Inga försäljningsannonser ännu
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Här visas dina försäljningsannonser som hanteras av mäklare.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {/* biome-ignore lint/suspicious/noExplicitAny: Ad type will be properly typed when ad schema is finalized */}
                  {adsData.salesAds.slice(0, 5).map((ad: any) => (
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
    </>
  );
};
