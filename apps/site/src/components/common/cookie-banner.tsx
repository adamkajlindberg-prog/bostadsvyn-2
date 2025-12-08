"use client";

import {
  CookieIcon,
  InfoIcon,
  SettingsIcon,
  ShieldIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieConsent extends CookiePreferences {
  timestamp: number;
}

const COOKIE_CONSENT_KEY = "cookie-consent";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (consent: CookieConsent) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: Date.now(),
    });
  };

  const handleRejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: Date.now(),
    });
  };

  const handleSavePreferences = () => {
    saveConsent({
      ...preferences,
      timestamp: Date.now(),
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-background/95 backdrop-blur-sm border-t">
      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-4 sm:p-6">
          {!showPreferences ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <CookieIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                    Vi använder cookies
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                    Vi använder cookies och liknande tekniker för att förbättra
                    din upplevelse, analysera trafik och visa personligt
                    innehåll. Du kan välja vilka cookies du accepterar enligt
                    lagen om elektronisk kommunikation.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-primary hover:underline text-xs sm:text-sm"
                      onClick={() => setShowPreferences(true)}
                      aria-label="Läs mer om cookies"
                    >
                      <InfoIcon
                        className="h-3 w-3 mr-1"
                        aria-hidden="true"
                      />
                      Läs mer
                    </Button>
                    <span className="text-muted-foreground hidden sm:inline">
                      |
                    </span>
                    <Link
                      href="/cookies"
                      className="text-primary hover:underline"
                      aria-label="Cookiepolicy"
                    >
                      Cookiepolicy
                    </Link>
                    <span className="text-muted-foreground hidden sm:inline">
                      |
                    </span>
                    <Link
                      href="/gdpr"
                      className="text-primary hover:underline inline-flex items-center"
                      aria-label="GDPR och din data"
                    >
                      <ShieldIcon
                        className="h-3 w-3 mr-1"
                        aria-hidden="true"
                      />
                      GDPR
                    </Link>
                  </div>
                </div>
              </div>

              {/* Buttons - Stack on mobile, row on larger screens */}
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferences(true)}
                  className="whitespace-nowrap order-3 sm:order-1"
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Inställningar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  className="whitespace-nowrap order-2"
                >
                  Avböj alla
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="whitespace-nowrap order-1 sm:order-3"
                >
                  Acceptera alla
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">
                  Cookie-inställningar
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(false)}
                  aria-label="Stäng inställningar"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 max-h-[50vh] overflow-y-auto">
                {/* Necessary Cookies */}
                <CookiePreferenceItem
                  title="Nödvändiga cookies"
                  description="Krävs för grundläggande funktionalitet som inloggning, sessionshantering och säkerhet"
                  example="Autentiseringstoken, språkval, säkerhetsinställningar"
                  checked={true}
                  disabled={true}
                  alwaysActive
                />

                {/* Analytics */}
                <CookiePreferenceItem
                  title="Analyser"
                  description="Hjälper oss förstå hur webbplatsen används och förbättra användarupplevelsen"
                  example="Sidvisningar, klick, användarbeteende (anonymiserat)"
                  checked={preferences.analytics}
                  onChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, analytics: checked }))
                  }
                />

                {/* Marketing */}
                <CookiePreferenceItem
                  title="Marknadsföring"
                  description="Används för att visa relevanta annonser och mäta kampanjeffektivitet"
                  example="Annonsvisningar, konverteringsspårning, retargeting"
                  checked={preferences.marketing}
                  onChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, marketing: checked }))
                  }
                />

                {/* Functional */}
                <CookiePreferenceItem
                  title="Funktionella"
                  description="Förbättrar funktionalitet och personalisering baserat på dina val"
                  example="Sparade sökningar, visningspreferenser, favoritlistor"
                  checked={preferences.functional}
                  onChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, functional: checked }))
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button variant="outline" size="sm" onClick={handleRejectAll}>
                  Avböj alla
                </Button>
                <Button size="sm" onClick={handleSavePreferences}>
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

interface CookiePreferenceItemProps {
  title: string;
  description: string;
  example: string;
  checked: boolean;
  disabled?: boolean;
  alwaysActive?: boolean;
  onChange?: (checked: boolean) => void;
}

const CookiePreferenceItem = ({
  title,
  description,
  example,
  checked,
  disabled,
  alwaysActive,
  onChange,
}: CookiePreferenceItemProps) => {
  return (
    <div
      className={`flex items-start sm:items-center justify-between gap-3 p-3 border rounded-lg ${alwaysActive ? "bg-muted/30" : ""}`}
    >
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground mb-1 text-sm">{title}</h4>
        <p className="text-xs sm:text-sm text-muted-foreground mb-1">
          {description}
        </p>
        <p className="text-xs text-muted-foreground italic hidden sm:block">
          Exempel: {example}
        </p>
      </div>
      {alwaysActive ? (
        <div className="text-xs sm:text-sm font-semibold text-foreground shrink-0">
          Alltid aktiv
        </div>
      ) : (
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 sm:w-11 sm:h-6 bg-muted rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-primary" />
        </label>
      )}
    </div>
  );
};

export default CookieBanner;
