import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Lock, Smartphone, CheckCircle2, AlertTriangle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import SEOOptimization from '@/components/seo/SEOOptimization';

const BankIdInfo = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Så funkar BankID - Bostadsvyn"
        description="Läs om hur vi använder BankID för säker identifiering och inloggning på Bostadsvyn. Digital signering och säker autentisering."
        keywords="BankID, säker inloggning, digital identifiering, e-legitimation, säkerhet"
      />
      
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-4xl font-bold mb-4">Så funkar BankID på Bostadsvyn</h1>
            <p className="text-lg text-muted-foreground">
              Vi använder BankID för säker identifiering och digital signering
            </p>
          </div>

          {/* What is BankID */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" aria-hidden="true" />
                Vad är BankID?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                BankID är Sveriges ledande e-legitimation som utfärdas av din bank. Med BankID kan du legitimera dig digitalt och underteckna dokument och avtal med samma juridiska värde som en vanlig underskrift.
              </p>
              <p>
                BankID finns både som app på mobilen (Mobilt BankID) och som säkerhetsdosa eller fil på datorn (BankID på fil).
              </p>
              <div className="bg-nordic-ice p-4 rounded-lg border border-border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                  Varför BankID?
                </h3>
                <ul className="space-y-2 text-sm" role="list">
                  <li>• Utfärdas av din bank - hög säkerhetsnivå</li>
                  <li>• Reglerat av svensk lag och myndighetskrav</li>
                  <li>• Används av myndigheter och banker i hela Sverige</li>
                  <li>• Juridiskt bindande digital signatur</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How we use BankID */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" aria-hidden="true" />
                Hur använder vi BankID?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">1. Kontoregistrering och inloggning</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  När du skapar konto eller loggar in på Bostadsvyn använder du BankID för att verifiera din identitet. Detta säkerställer att endast du kan komma åt ditt konto.
                </p>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Så här går det till:</strong>
                  <ol className="mt-2 space-y-1 list-decimal list-inside" role="list">
                    <li>Klicka på "Logga in med BankID"</li>
                    <li>Öppna BankID-appen på din mobil</li>
                    <li>Identifiera dig med fingeravtryck, Face ID eller PIN-kod</li>
                    <li>Du är inloggad!</li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Verifiering av fastighetsägare och mäklare</h3>
                <p className="text-sm text-muted-foreground">
                  Alla som annonserar fastigheter på Bostadsvyn måste vara BankID-verifierade. Detta förhindrar bluffannonser och skapar förtroende mellan köpare och säljare.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Digital signering av dokument</h3>
                <p className="text-sm text-muted-foreground">
                  I framtiden kommer du kunna signera köpekontrakt och andra dokument direkt via Bostadsvyn med BankID. Signaturerna är juridiskt bindande enligt svensk lag.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                Säkerhet och integritet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                  Vad sparar vi?
                </h3>
                <ul className="space-y-2 text-sm" role="list">
                  <li>• Ditt namn (som det står i folkbokföringen)</li>
                  <li>• Ditt personnummer (krypterat)</li>
                  <li>• Tidpunkt för verifiering</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Vad får vi INTE tillgång till?
                </h3>
                <ul className="space-y-2 text-sm" role="list">
                  <li>• Din BankID-kod eller PIN</li>
                  <li>• Dina bankuppgifter</li>
                  <li>• Annan information från din bank</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                BankID är en säker tjänst som uppfyller höga krav på datasäkerhet. All kommunikation är krypterad och dina personuppgifter skyddas enligt GDPR.
              </p>
            </CardContent>
          </Card>

          {/* Common Questions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Vanliga frågor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Måste jag använda BankID?</h3>
                <p className="text-sm text-muted-foreground">
                  Ja, för att kunna annonsera fastigheter eller kontakta säljare krävs BankID-verifiering. Detta är ett krav för att upprätthålla säkerhet och förtroende på plattformen.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Vad gör jag om jag inte har BankID?</h3>
                <p className="text-sm text-muted-foreground">
                  Kontakta din bank för att beställa BankID. De flesta svenska banker erbjuder BankID kostnadsfritt. Processen tar vanligtvis några minuter.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Kan jag använda utländskt BankID?</h3>
                <p className="text-sm text-muted-foreground">
                  För närvarande stödjer vi endast svenskt BankID. Vi arbetar på att utöka till fler e-legitimationer i framtiden.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Är det säkert att använda BankID på Bostadsvyn?</h3>
                <p className="text-sm text-muted-foreground">
                  Ja, BankID är en av de säkraste identifieringsmetoderna som finns. Vi lagrar aldrig din BankID-kod eller dina bankuppgifter. All kommunikation mellan dig, BankID och Bostadsvyn är krypterad.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                Behöver du hjälp?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm mb-3">
                  <strong>Problem med BankID?</strong>
                </p>
                <ul className="space-y-2 text-sm" role="list">
                  <li>• Tekniska problem med BankID - kontakta din bank</li>
                  <li>• Problem att logga in på Bostadsvyn - kontakta vår support</li>
                  <li>• Frågor om säkerhet - läs vår <a href="/privacy" className="text-primary hover:underline">integritetspolicy</a></li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                Kontakta oss på <a href="mailto:support@bostadsvyn.se" className="text-primary hover:underline">support@bostadsvyn.se</a> om du har frågor om hur vi använder BankID.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default BankIdInfo;
