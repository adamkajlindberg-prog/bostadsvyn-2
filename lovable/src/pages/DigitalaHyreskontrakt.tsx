import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import { FileText, Shield, Clock, CheckCircle, FileCheck, Lock, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
const DigitalaHyreskontrakt = () => {
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 p-0">
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-4">
              <Shield className="h-4 w-4 mr-1" />
              Säker & Juridiskt bindande
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Digitala Hyreskontrakt
            </h1>
            <p className="text-xl text-foreground font-medium max-w-3xl mx-auto">
              Säkra signeringar med BankID och automatiserade juridiska dokument för en smidig uthyrningsprocess
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 p-0">
          {/* What is Digital Rental Contracts */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Vad är digitala hyreskontrakt?</h2>
            <p className="text-lg text-foreground font-medium leading-relaxed mb-6">
              Våra digitala hyreskontrakt gör det enkelt, säkert och effektivt att hantera uthyrning. Istället för att träffas fysiskt för att skriva under papper kan både hyresvärd och hyresgäst signera digitalt med BankID - Sveriges mest betrodda e-legitimation. Hela processen är juridiskt bindande och följer svensk hyreslagstiftning.
            </p>
            <p className="text-lg text-foreground font-medium leading-relaxed">
              Systemet skapar automatiskt kompletta hyreskontrakt baserat på din information och gällande lagar. Du får mallar som är granskade av jurister, anpassningsbara efter dina behov, och automatisk lagring av alla dokument för framtida referens.
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Huvudfunktioner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Lock className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">BankID-integration</h3>
                  <p className="text-muted-foreground">
                    Signera säkert med Sveriges mest betrodda e-legitimation för juridiskt bindande avtal.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Zap className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Automatisk generering</h3>
                  <p className="text-muted-foreground">
                    Kontrakt skapas automatiskt baserat på dina uppgifter och gällande hyreslagstiftning.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Shield className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Juridisk säkerhet</h3>
                  <p className="text-muted-foreground">
                    Alla mallar är granskade av jurister och följer svensk hyreslagstiftning till punkt och pricka.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <FileCheck className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Digital arkivering</h3>
                  <p className="text-muted-foreground">
                    Alla kontrakt sparas säkert i molnet och är alltid tillgängliga för båda parter.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Users className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Flera parter</h3>
                  <p className="text-muted-foreground">
                    Stöd för andrahandshyresgäster, borgensmän och andra medtecknare.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Clock className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Påminnelser</h3>
                  <p className="text-muted-foreground">
                    Automatiska påminnelser om viktiga datum som hyresförnyelse och uppsägningsfrister.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8">Komplett kontraktsinnehåll</h2>
            <p className="text-lg text-foreground font-medium mb-10 max-w-3xl">
              Varje digitalt hyreskontrakt innehåller alla nödvändiga juridiska komponenter och följer gällande hyreslagstiftning. Kontrakten är granskade av erfarna fastighetsj urister och uppdateras kontinuerligt för att följa nya lagar och praxis.
            </p>
            <Card className="bg-gradient-to-br from-card/60 to-background border-primary-foreground/20 shadow-lg">
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Grundläggande information</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">Partsuppgifter</p>
                          <p className="text-sm text-muted-foreground">Fullständiga uppgifter för hyresvärd och hyresgäst verifierade med BankID</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">Objektsbeskrivning</p>
                          <p className="text-sm text-muted-foreground">Detaljerad beskrivning av bostaden inklusive adress, storlek och specifikationer</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">Hyresperiod</p>
                          <p className="text-sm text-muted-foreground">Startdatum, uppsägningstid och eventuell tidsbegränsning enligt lag</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">Ekonomiska villkor</p>
                          <p className="text-sm text-muted-foreground">Hyresbelopp, förfallodatum, indexjusteringar och betalningsmetod</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-accent/10 rounded-xl">
                        <Shield className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-xl font-semibold">Villkor och ansvar</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">Underhållsansvar</p>
                          <p className="text-sm text-muted-foreground">Tydlig fördelning av underhållsskyldigheter mellan parterna</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">Andrahandsuthyrning</p>
                          <p className="text-sm text-muted-foreground">Regler och villkor för eventuell andrahandsuthyrning enligt hyreslagen</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">Deposition och säkerhet</p>
                          <p className="text-sm text-muted-foreground">Depositionsbelopp, hantering och återbetalningsvillkor</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">Uppsägning och avflyttning</p>
                          <p className="text-sm text-muted-foreground">Uppsägningsregler, besiktning och återställningskrav</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Fördelar med digitala kontrakt</h2>
            <div className="space-y-6">
              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Clock className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Spara tid</h3>
                      <p className="text-muted-foreground">
                        Ingen fysisk träff behövs - signera när och var som helst. Hela processen tar bara några minuter istället för dagar.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Shield className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Ökad säkerhet</h3>
                      <p className="text-muted-foreground">
                        BankID-signering ger högsta säkerhet och alla dokument krypteras och lagras säkert.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <FileCheck className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Alltid tillgängligt</h3>
                      <p className="text-muted-foreground">
                        Ditt kontrakt finns alltid i din digitala ärendemapp, åtkomligt från alla enheter när du behöver det.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Zap className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Automatiserad process</h3>
                      <p className="text-muted-foreground">
                        Påminnelser om hyresbetalningar, förnyelser och andra viktiga datum skickas automatiskt.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How it Works */}
          

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Skapa ditt första digitala hyreskontrakt
            </h2>
            <p className="text-lg text-foreground font-medium mb-8 max-w-2xl mx-auto">
              Förenkla din uthyrningsprocess med våra digitala hyreskontrakt. Säkert, snabbt och juridiskt korrekt.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild variant="default" size="lg">
                <Link to="/skapa-hyresannons">Skapa hyreskontrakt</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/hyresbostader">Se hyresbostäder</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LegalFooter />
    </div>;
};
export default DigitalaHyreskontrakt;