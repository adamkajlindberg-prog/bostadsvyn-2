import { Navigate } from "react-router-dom";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import { UserDashboard } from "@/components/UserDashboard";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <UserDashboard />
      <LegalFooter />
    </div>
  );
};

export default Dashboard;
