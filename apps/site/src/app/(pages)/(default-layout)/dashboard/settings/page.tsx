import { Suspense } from "react";
import { getServerSession } from "@/auth/server-session";
import { Card, CardContent } from "@/components/ui/card";

export default async function SettingsPage() {
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
            <p>Laddar inställningar...</p>
          </div>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}

const SettingsContent = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <p className="text-muted-foreground">Inställningar kommer snart</p>
      </CardContent>
    </Card>
  );
};
