import { Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getServerSession } from "@/auth/server-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function GruppkontonPage() {
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
            <p>Laddar gruppkonton...</p>
          </div>
        </div>
      }
    >
      <GruppkontonContent />
    </Suspense>
  );
}

const GruppkontonContent = () => {
  return (
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
          Samarbeta med familj och vänner för att hitta och rösta på bostäder.
          Fungerar för både köp, hyresrätter och kommersiella fastigheter.
        </p>
        <Button asChild size="lg">
          <Link href="/familjekonton">
            <Users className="h-4 w-4 mr-2" />
            Gå till gruppkonton
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
