import { Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import { UserProfile } from "@/components/UserProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BankIDVerification from "@/components/verification/BankIDVerification";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, loading, profile } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);

  useEffect(() => {
    if (user && profile) {
      checkBankIDStatus();
    }
  }, [user, profile, checkBankIDStatus]);

  const checkBankIDStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("bankid_verified")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (data && !error) {
        setIsVerified(data.bankid_verified || false);
      }
    } catch (error) {
      console.error("Error checking BankID status:", error);
    } finally {
      setCheckingVerification(false);
    }
  };

  if (loading || checkingVerification) {
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
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger
              value="verification"
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Verifiering
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>

          <TabsContent value="verification">
            <BankIDVerification
              userId={user?.id}
              isVerified={isVerified}
              onVerificationComplete={() => {
                setIsVerified(true);
                checkBankIDStatus();
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      <LegalFooter />
    </div>
  );
};

export default Profile;
