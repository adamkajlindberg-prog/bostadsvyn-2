import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import SEOOptimization from '@/components/seo/SEOOptimization';
import ModerationQueue from '@/components/moderation/ModerationQueue';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';

const AdminModeration = () => {
  const navigate = useNavigate();
  const { userRoles } = useAuth();

  // Check if user is admin
  const isAdmin = userRoles.includes('admin');

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SEOOptimization
          title="Åtkomst nekad - Bostadsvyn"
          description="Du har inte behörighet att komma åt denna sida"
          noIndex={true}
        />
        <Navigation />
        <main id="main-content" className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-bold">Åtkomst nekad</h1>
            <p className="text-muted-foreground">
              Du har inte behörighet att komma åt moderationspanelen.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka till startsidan
            </Button>
          </div>
        </main>
        <LegalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Moderering - Bostadsvyn"
        description="Admin panel för moderering av fastigheter och annonser"
        noIndex={true}
      />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Moderering</h1>
              <p className="text-muted-foreground">
                Granska och godkänn fastigheter och annonser innan publicering
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka
            </Button>
          </div>

          <ModerationQueue />
        </div>
      </main>
      <LegalFooter />
    </div>
  );
};

export default AdminModeration;
