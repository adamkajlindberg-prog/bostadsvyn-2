import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { Session } from "@/auth/config";
import { getServerSession } from "@/auth/server-session";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Laddar dashboard...</p>
              </div>
            </div>
          }
        >
          <DashboardLayoutContent session={session}>
            {children}
          </DashboardLayoutContent>
        </Suspense>
      </div>
    </div>
  );
}

const DashboardLayoutContent = async ({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) => {
  return (
    <>
      <DashboardHeader user={session.user} />
      <div className="mb-6">
        <DashboardNav />
      </div>
      <main className="space-y-6">{children}</main>
    </>
  );
};
