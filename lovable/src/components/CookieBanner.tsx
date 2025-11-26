import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, Settings, X, Shield, Info } from 'lucide-react';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: Date.now()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allConsent));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: Date.now()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(minimalConsent));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: Date.now()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowBanner(false);
    setShowPreferences(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t">
      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-6">
          {!showPreferences ? (
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-6 w-6 text-nordic-fjord mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Vi använder cookies</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Vi använder cookies och liknande tekniker för att förbättra din upplevelse, 
                    analysera trafik och visa personligt innehåll. Du kan välja vilka cookies 
                    du accepterar enligt lagen om elektronisk kommunikation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-primary hover:underline"
                      onClick={() => setShowPreferences(true)}
                      aria-label="Läs mer om cookies"
                    >
                      <Info className="h-3 w-3 mr-1" aria-hidden="true" />
                      Läs mer om cookies
                    </Button>
                    <span className="text-muted-foreground">•</span>
                    <a
                      href="/cookies"
                      className="text-sm text-primary hover:underline"
                      aria-label="Cookiepolicy"
                    >
                      Cookiepolicy
                    </a>
                    <span className="text-muted-foreground">•</span>
                    <a
                      href="/gdpr"
                      className="text-sm text-primary hover:underline"
                      aria-label="GDPR och din data"
                    >
                      <Shield className="h-3 w-3 inline mr-1" aria-hidden="true" />
                      GDPR
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferences(true)}
                  className="whitespace-nowrap"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Hantera inställningar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  className="whitespace-nowrap"
                >
                  Avböj alla
                </Button>
                <Button
                  variant="nordic"
                  size="sm"
                  onClick={handleAcceptAll}
                  className="whitespace-nowrap"
                >
                  Acceptera alla
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Cookie-inställningar</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">Nödvändiga cookies</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Krävs för grundläggande funktionalitet som inloggning, sessionshantering och säkerhet
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Exempel: Autentiseringstoken, språkval, säkerhetsinställningar
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-foreground ml-4">Alltid aktiv</div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">Analyser</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Hjälper oss förstå hur webbplatsen används och förbättra användarupplevelsen
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Exempel: Sidvisningar, klick, användarbeteende (anonymiserat)
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        analytics: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nordic-fjord"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">Marknadsföring</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Används för att visa relevanta annonser och mäta kampanjeffektivitet
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Exempel: Annonsvisningar, konverteringsspårning, retargeting
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        marketing: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nordic-fjord"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">Funktionella</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Förbättrar funktionalitet och personalisering baserat på dina val
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Exempel: Sparade sökningar, visningspreferenser, favoritlistor
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        functional: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nordic-fjord"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                >
                  Avböj alla
                </Button>
                <Button
                  variant="nordic"
                  size="sm"
                  onClick={handleSavePreferences}
                >
                  Spara inställningar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieBanner;