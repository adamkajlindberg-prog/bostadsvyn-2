import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Building2, Mail, Bell, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BrokerSettings() {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    hideOrganizations: true,
  });

  const [mailSettings, setMailSettings] = useState({
    endStatistics: true,
    forwardInquiries: true,
    showSmsButton: true,
  });

  const [officeSettings, setOfficeSettings] = useState({
    office1: true,
    office2: true,
  });

  const [newsletterSettings, setNewsletterSettings] = useState({
    weeklyStats: true,
    marketInsights: true,
    newFeatures: false,
    brokerNewsletter: true,
    leadNotifications: true,
    noNewsletter: false,
  });

  const handleSaveGeneral = () => {
    toast({
      title: "Inställningar sparade",
      description: "Dina allmänna inställningar har uppdaterats.",
    });
  };

  const handleSaveMail = () => {
    toast({
      title: "Mail & kontakter sparade",
      description: "Dina mail- och kontaktinställningar har uppdaterats.",
    });
  };

  const handleSaveOffice = () => {
    toast({
      title: "Kontorinställningar sparade",
      description: "Dina kontorinställningar har uppdaterats.",
    });
  };

  const handleSaveNewsletter = () => {
    toast({
      title: "Nyhetsbrev sparade",
      description: "Dina nyhetsbrevsinställningar har uppdaterats.",
    });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Inställningar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="hide-organizations"
              checked={generalSettings.hideOrganizations}
              onCheckedChange={(checked) =>
                setGeneralSettings({ ...generalSettings, hideOrganizations: checked as boolean })
              }
            />
            <Label htmlFor="hide-organizations" className="font-normal cursor-pointer">
              Visa organisationer utan användare i Kundportalen
            </Label>
          </div>
          <Button onClick={handleSaveGeneral} className="bg-success hover:bg-success/90">
            Spara
          </Button>
        </CardContent>
      </Card>

      {/* Mail & Contacts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Mail & kontakter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="end-statistics"
                checked={mailSettings.endStatistics}
                onCheckedChange={(checked) =>
                  setMailSettings({ ...mailSettings, endStatistics: checked as boolean })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="end-statistics" className="font-normal cursor-pointer">
                  Mejla ut slutstatistik till mig när objekt har sålts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Gäller både slutstatistik samt hur bostaden presterade på Bostadsvyn
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="forward-inquiries"
                checked={mailSettings.forwardInquiries}
                onCheckedChange={(checked) =>
                  setMailSettings({ ...mailSettings, forwardInquiries: checked as boolean })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="forward-inquiries" className="font-normal cursor-pointer">
                  Vidarebefordra kontaktförfrågningar via mejl
                </Label>
                <p className="text-sm text-muted-foreground">
                  Obs! Gäller endast om du använder ett mäklarsystem med elektronisk koppling för överföring av kontakter.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="show-sms"
                checked={mailSettings.showSmsButton}
                onCheckedChange={(checked) =>
                  setMailSettings({ ...mailSettings, showSmsButton: checked as boolean })
                }
              />
              <Label htmlFor="show-sms" className="font-normal cursor-pointer">
                Visa SMS-knapp i apparna
              </Label>
            </div>
          </div>
          <Button onClick={handleSaveMail} className="bg-success hover:bg-success/90">
            Spara
          </Button>
        </CardContent>
      </Card>

      {/* Office & Brokers Management */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Inställningar för kontor och mäklare
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Hantera vilka kontor och mäklare som är aktiva i din organisation
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Välj vilka kontor du vill ha notifieringar från:</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="office-1"
                    checked={officeSettings.office1}
                    onCheckedChange={(checked) =>
                      setOfficeSettings({ ...officeSettings, office1: checked as boolean })
                    }
                  />
                  <Label htmlFor="office-1" className="font-normal cursor-pointer">
                    Huvudkontoret Stockholm
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">5 mäklare</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="office-2"
                    checked={officeSettings.office2}
                    onCheckedChange={(checked) =>
                      setOfficeSettings({ ...officeSettings, office2: checked as boolean })
                    }
                  />
                  <Label htmlFor="office-2" className="font-normal cursor-pointer">
                    Filial Göteborg
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">3 mäklare</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Mäklare och assistenter på kontoret:</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Anna Andersson</p>
                    <p className="text-sm text-muted-foreground">Mäklare - Huvudkontoret Stockholm</p>
                  </div>
                </div>
                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">Aktiv</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Erik Eriksson</p>
                    <p className="text-sm text-muted-foreground">Mäklare - Huvudkontoret Stockholm</p>
                  </div>
                </div>
                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">Aktiv</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Maria Svensson</p>
                    <p className="text-sm text-muted-foreground">Assistent - Huvudkontoret Stockholm</p>
                  </div>
                </div>
                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">Aktiv</span>
              </div>
            </div>
          </div>

          <Button onClick={handleSaveOffice} className="bg-success hover:bg-success/90">
            Spara
          </Button>
        </CardContent>
      </Card>

      {/* Newsletter Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Utskick och information från Bostadsvyn
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Håll dig uppdaterad med de senaste funktionerna, marknadsinsikter och tips för att maximera din försäljning.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Du kan när som helst ändra dina inställningar. Vi använder endast din e-postadress för att skicka relevant information om Bostadsvyn.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="weekly-stats"
                checked={newsletterSettings.weeklyStats}
                onCheckedChange={(checked) =>
                  setNewsletterSettings({ 
                    ...newsletterSettings, 
                    weeklyStats: checked as boolean,
                    noNewsletter: false 
                  })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="weekly-stats" className="font-normal cursor-pointer">
                  Veckosammanfattning med statistik
                </Label>
                <p className="text-sm text-muted-foreground">
                  Få en översikt över dina objekts prestanda, antal visningar och intresseanmälningar
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="market-insights"
                checked={newsletterSettings.marketInsights}
                onCheckedChange={(checked) =>
                  setNewsletterSettings({ 
                    ...newsletterSettings, 
                    marketInsights: checked as boolean,
                    noNewsletter: false 
                  })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="market-insights" className="font-normal cursor-pointer">
                  Marknadsinsikter och trendrapporter
                </Label>
                <p className="text-sm text-muted-foreground">
                  Lokala marknadsanalyser, prissättningsdata och köparmönster i ditt område
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="new-features"
                checked={newsletterSettings.newFeatures}
                onCheckedChange={(checked) =>
                  setNewsletterSettings({ 
                    ...newsletterSettings, 
                    newFeatures: checked as boolean,
                    noNewsletter: false 
                  })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="new-features" className="font-normal cursor-pointer">
                  Nya funktioner och verktyg
                </Label>
                <p className="text-sm text-muted-foreground">
                  Bli först med att testa nya AI-verktyg och marknadsföringsfunktioner
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="broker-newsletter"
                checked={newsletterSettings.brokerNewsletter}
                onCheckedChange={(checked) =>
                  setNewsletterSettings({ 
                    ...newsletterSettings, 
                    brokerNewsletter: checked as boolean,
                    noNewsletter: false 
                  })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="broker-newsletter" className="font-normal cursor-pointer">
                  Mäklarnyheter och best practice
                </Label>
                <p className="text-sm text-muted-foreground">
                  Tips från framgångsrika mäklare och guider för att öka din försäljning
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="lead-notifications"
                checked={newsletterSettings.leadNotifications}
                onCheckedChange={(checked) =>
                  setNewsletterSettings({ 
                    ...newsletterSettings, 
                    leadNotifications: checked as boolean,
                    noNewsletter: false 
                  })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="lead-notifications" className="font-normal cursor-pointer">
                  Leadnotifieringar och intresseanmälningar
                </Label>
                <p className="text-sm text-muted-foreground">
                  Omedelbar avisering när någon visar intresse för dina objekt
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="no-newsletter"
                checked={newsletterSettings.noNewsletter}
                onCheckedChange={(checked) =>
                  setNewsletterSettings({ 
                    weeklyStats: false,
                    marketInsights: false,
                    newFeatures: false,
                    brokerNewsletter: false,
                    leadNotifications: false,
                    noNewsletter: checked as boolean 
                  })
                }
              />
              <Label htmlFor="no-newsletter" className="font-normal cursor-pointer">
                Jag vill inte ha några utskick från Bostadsvyn
              </Label>
            </div>
          </div>

          <Button onClick={handleSaveNewsletter} className="bg-success hover:bg-success/90">
            Spara
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
