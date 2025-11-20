import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { Session } from "@/auth/config";
import { getServerSession } from "@/auth/server-session";
import UserDashboard from "@/components/user-dashboard";
import {
  getDashboardStats,
  getFavoriteProperties,
  getUserAds,
} from "@/lib/dashboard";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Laddar dashboard...</p>
            </div>
          </div>
        </div>
      }
    >
      <DashboardSuspense session={session} />
    </Suspense>
  );
}

const DashboardSuspense = async ({ session }: { session: Session }) => {
  const [stats, favoriteProperties, adsData] = await Promise.all([
    getDashboardStats(session.user.id),
    getFavoriteProperties(session.user.id, 6),
    getUserAds(session.user.id),
  ]);
  return (
    <UserDashboard
      user={session.user}
      stats={stats}
      favoriteProperties={favoriteProperties}
      rentalAds={adsData.rentalAds}
      brokerSalesAds={adsData.salesAds}
      pendingApprovalAds={adsData.pendingApprovalAds}
      pendingApprovalProjects={adsData.pendingApprovalProjects}
    />
  );
};
