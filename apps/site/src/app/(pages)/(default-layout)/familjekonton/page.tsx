import { Suspense } from "react";
import { getServerSession } from "@/auth/server-session";
import FamilyGroups from "@/components/family-groups";
import { Card, CardContent } from "@/components/ui/card";

function LoadingFallback() {
  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laddar gruppkonto...</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function FamilyGroupsPage() {
  const session = await getServerSession();
  const userId = session?.user?.id;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <FamilyGroups initialUserId={userId} />
    </Suspense>
  );
}
