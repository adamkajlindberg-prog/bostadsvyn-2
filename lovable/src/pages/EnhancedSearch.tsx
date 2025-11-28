import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, BarChart3, Sparkles, Target } from 'lucide-react';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import PropertyComparison from '@/components/comparison/PropertyComparison';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const EnhancedSearch = () => {
  const { user, loading, userRoles } = useAuth();
  const [activeTab, setActiveTab] = useState('search');
  const isBroker = userRoles.includes('broker');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Brokers should not have access to smart search
  if (isBroker) {
    return <Navigate to="/mäklarportal" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Smart Fastighetssökning
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hitta din perfekta fastighet med avancerad sökning, AI-rekommendationer och detaljerad jämförelse.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Search className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm text-muted-foreground">Sökfilter</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">AI</p>
                  <p className="text-sm text-muted-foreground">Rekommendationer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Max jämförelse</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search" className="gap-2">
              <Search className="h-4 w-4" />
              Avancerad sökning
            </TabsTrigger>
            <TabsTrigger value="comparison" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Jämför fastigheter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <AdvancedSearch />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <PropertyComparison />
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Funktioner i Smart Sökning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Badge className="bg-primary text-primary-foreground">1</Badge>
                <div>
                  <h4 className="font-semibold mb-1">AI-Powered Rekommendationer</h4>
                  <p className="text-sm text-muted-foreground">
                    Få personliga förslag baserat på din sökhistorik och preferenser.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge className="bg-primary text-primary-foreground">2</Badge>
                <div>
                  <h4 className="font-semibold mb-1">Detaljerad Jämförelse</h4>
                  <p className="text-sm text-muted-foreground">
                    Jämför upp till 4 fastigheter sida vid sida med marknadsanalys.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge className="bg-primary text-primary-foreground">3</Badge>
                <div>
                  <h4 className="font-semibold mb-1">Sparade Sökningar</h4>
                  <p className="text-sm text-muted-foreground">
                    Spara dina sökkriterier och få notifieringar om nya matchningar.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedSearch;