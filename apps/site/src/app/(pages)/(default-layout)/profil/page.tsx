import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Shield, User } from "lucide-react";
import { getServerSession } from "@/auth/server-session";
import { BankIDVerification } from "@/components/profile/bankid-verification";
import { UserProfile } from "@/components/profile/user-profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ProfilPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Laddar...</p>
              </div>
            </div>
          }
        >
          <ProfilContent userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  );
}

function ProfilContent({ userId }: { userId: string }) {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profil
        </TabsTrigger>
        <TabsTrigger value="verification" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Verifiering
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <UserProfile />
      </TabsContent>

      <TabsContent value="verification">
        <BankIDVerification userId={userId} />
      </TabsContent>
    </Tabs>
  );
}

