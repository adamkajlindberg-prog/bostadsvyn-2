import { Heart } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import type { Session } from "@/auth/config";
import { getServerSession } from "@/auth/server-session";
import PropertyCard from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardStats, getFavoriteProperties } from "@/lib/dashboard";

export default async function FavoriterPage() {
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
            <p>Laddar favoriter...</p>
          </div>
        </div>
      }
    >
      <FavoriterSuspense session={session} />
    </Suspense>
  );
}

const FavoriterSuspense = async ({ session }: { session: Session }) => {
  const [stats, favoriteProperties] = await Promise.all([
    getDashboardStats(session.user.id),
    getFavoriteProperties(session.user.id),
  ]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mina favoriter</h2>
        <p className="text-muted-foreground">{stats.favoriteCount} favoriter</p>
      </div>

      {favoriteProperties.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Inga favoriter ännu</h3>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </>
  );
};
