import React from 'react';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import SEOOptimization from '@/components/seo/SEOOptimization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Shield, Users, Zap, Award, Target, Heart, Rocket, FileText, Lock, Eye, CheckCircle2, AlertTriangle, ExternalLink, Sparkles, TrendingUp, Calculator, Search, Home, Bot, BarChart3, Wand2, MapPin, UserCheck } from 'lucide-react';
const OmOss = () => {
  return <div className="min-h-screen bg-background">
    <SEOOptimization title="Om Bostadsvyn Sverige AB - Vår vision och värderingar" description="Bostadsvyn Sverige AB grundades 2025 med visionen att utveckla en modern fastighetsplattform. Lär dig mer om våra värderingar, mål och vad som gör oss unika." keywords="om bostadsvyn, företagsinformation, vision, värderingar, fastighetsplattform" />
    <Navigation />

    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="bg-accent text-accent-foreground mb-4">Grundat 2025</Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
          Om Bostadsvyn
        </h1>
        <p className="text-xl text-foreground font-medium max-w-4xl mx-auto leading-relaxed">Vi erbjuder en modern fastighetsplattform som kombinerar AI-teknologi med användarvänlig design för att förenkla och förbättra sökandet efter bostad för alla.</p>
      </div>

      {/* Founder Story */}
      <div className="mb-16">
        <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Grundat och byggt av en fastighetsmäklare med branscherfarenhet</h2>
                <p className="text-accent font-semibold">Fem års erfarenhet från fastighetsbranschen</p>
              </div>
            </div>
            <p className="text-foreground leading-relaxed mb-4 text-lg">Bostadsvyn är grundat och byggt av en registrerad fastighetsmäklare med gedigen branscherfarenhet men också personlig erfarenhet från bostadsmarknaden. Genom fem års erfarenhet har vi identifierat de verktyg och funktioner som verkligen tillför värde för samtliga aktörer på fastighetsmarknaden – fastighetsmäklare, säljare, köpare, spekulanter och hyresvärdar.</p>

            <blockquote className="mt-6 border-l-4 border-accent pl-6 italic text-foreground text-lg">
              <p className="leading-relaxed mb-2">"Jag har sedan hösten 2024 funderat mycket på varför vi i Sverige inte har EN bostadsportal för alla typer av bostäder utan folk måste söka sig till 4-5 olika sidor, beroende på vad de söker. Det var så jag fick idén för Bostadsvyn! Målet för mig är att ta allt jag har lärt mig från att vara en köpare, säljare och mäklare till att tillsammans med den otroliga teknologin som finns idag, skapa den absolut bästa plattformen för bostäder som finns i Sverige. Alla ska kunna annonsera och alla ska ha nytta av portalen och dessa unika verktyg som vi har tagit fram. Förhoppningsvis så kan jag med detta hårda jobb underlätta för er från början till slut, oavsett vad ni söker för bostad."</p>
              <p className="text-sm font-semibold not-italic text-accent">— Adam</p>
            </blockquote>
          </CardContent>
        </Card>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              Vår Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed mb-4">
              Vi revolutionerar fastighetsmarknaden genom att förena avancerad teknologi med djup
              branschkunskap. Vårt mål är att skapa en transparent, effektiv och användarvänlig
              plattform som förenklar hela fastighetsprocessen.
            </p>
            <p className="text-foreground leading-relaxed">
              Med fokus på tillgänglighet och kvalitet levererar vi professionella verktyg och
              beslutsunderlag för privatpersoner, företag och fastighetsmäklare – oavsett om det
              gäller köp, försäljning eller uthyrning.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Rocket className="h-6 w-6 text-accent" />
              Vår Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed mb-4">
              Att bli den ledande fastighetsplattformen i Sverige genom att sätta nya standarder
              för användarvänlighet, transparens och professionalism. Vi skapar ett ekosystem där
              alla parter – köpare, säljare, mäklare och hyresvärdar – får tillgång till samma
              högkvalitativa verktyg och information.
            </p>
            <p className="text-foreground leading-relaxed">
              Genom kontinuerlig innovation och nära kontakt med branschen bygger vi framtidens
              fastighetsmarknad – en marknad som är mer rättvis, effektiv och tillgänglig för alla.
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Platform Overview */}
      <div className="mb-16">
        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-4xl font-bold mb-4">Vår plattform</h2>
          <p className="text-foreground max-w-3xl mx-auto text-lg">
            Vi bygger en fastighetsplattform med moderna verktyg och funktioner.
            Här är våra huvudsakliga fokusområden och planerade funktioner.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-accent/10 rounded-lg p-3">
                  <Home className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">Brett bostadsutbud</h3>
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-3">
                Vi arbetar för att erbjuda olika typer av bostäder i både Sverige och utlandet på en och samma plattform - från villor och lägenheter till hyresbostäder och kommersiellt.
              </p>
              <div className="flex flex-wrap gap-2">


              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Modern AI-teknologi</h3>
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-3">
                Vi utvecklar AI-verktyg för bildredigering, homestyling och marknadsanalys
                som ska ge användare bättre beslutsunderlag för sina fastighetsaffärer.
              </p>

            </CardContent>
          </Card>

          <Card className="border-2 border-success/20 hover:border-success/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-success/10 rounded-lg p-3">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold">Säkerhet & trygghet</h3>
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-3">
                BankID-verifiering, GDPR-efterlevnad, manuell moderering av annonser och
                digitala avtal med juridisk säkerhet för alla transaktioner.
              </p>

            </CardContent>
          </Card>
        </div>
      </div>


      {/* Additional Platform Features */}


      {/* Security & Compliance Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Säkerhet & Efterlevnad</h2>
          <p className="text-foreground max-w-2xl mx-auto">
            Din säkerhet och integritet är vår högsta prioritet. Vi följer alla relevanta lagar
            och arbetar kontinuerligt för att skydda dina uppgifter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-success/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-success/10 rounded-full p-3">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold">BankID-verifiering</h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Vi använder svenskt BankID för användarverifiering för att öka säkerheten
                och motverka bedrägerier på plattformen.
              </p>
            </CardContent>
          </Card>

          <Card className="border-premium/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-premium/10 rounded-full p-3">
                  <Lock className="h-6 w-6 text-premium" />
                </div>
                <h3 className="text-lg font-semibold">GDPR-kompatibel</h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Vi efterlever GDPR-regelverket och arbetar för att skydda användarnas
                personuppgifter med krypterad lagring och transparent hantering.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">Moderering</h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Bostadsannonser granskas för att upprätthålla kvalitet och motverka
                vilseledande marknadsföring på plattformen.
              </p>
            </CardContent>
          </Card>

          <Card className="border-nordic-aurora/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-nordic-aurora/10 rounded-full p-3">
                  <Eye className="h-6 w-6 text-nordic-aurora" />
                </div>
                <h3 className="text-lg font-semibold">Säkerhetsloggning</h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Alla säkerhetshändelser loggas och övervakas kontinuerligt för att snabbt kunna
                upptäcka och åtgärda eventuella hot.
              </p>
            </CardContent>
          </Card>

          <Card className="border-warning/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-warning/10 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <h3 className="text-lg font-semibold">Incidenthantering</h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Strukturerad process för rapportering och hantering av säkerhetsincidenter,
                bedrägerier och regelbrott.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">DAC7-rapportering</h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Vi arbetar för att efterleva EU:s DAC7-direktiv för rapportering av
                hyresintäkter till Skatteverket där det är tillämpligt.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legal Documents Section */}
      <div className="mb-16">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              Juridiska dokument & policyer
            </CardTitle>
            <p className="text-sm text-foreground">
              Läs våra policyer och villkor för att förstå hur vi hanterar dina uppgifter och
              vilka rättigheter du har som användare.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/terms" className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      Allmänna villkor
                    </h4>
                    <p className="text-xs text-foreground">
                      Användarvillkor och regler för plattformen
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-foreground/60 group-hover:text-primary transition-colors" />
              </a>

              <a href="/privacy" className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-premium" />
                  <div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      Integritetspolicy
                    </h4>
                    <p className="text-xs text-foreground">
                      Hur vi hanterar dina personuppgifter
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-foreground/60 group-hover:text-primary transition-colors" />
              </a>

              <a href="/cookies" className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-success" />
                  <div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      Cookie-policy
                    </h4>
                    <p className="text-xs text-foreground">
                      Information om cookies och spårning
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-foreground/60 group-hover:text-primary transition-colors" />
              </a>

              <a href="/support" className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-accent" />
                  <div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      Support & Tvistlösning
                    </h4>
                    <p className="text-xs text-foreground">
                      Kontakta oss eller rapportera problem
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-foreground/60 group-hover:text-primary transition-colors" />
              </a>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Regelefterlevnad
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Marknadsföringslagen (2008:486)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>GDPR (EU 2016/679)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>DAC7-direktivet</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>EU eIDAS-förordningen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Fastighetsmäklarlagen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Bokföringslagen</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact CTA */}

    </main>

    <LegalFooter />
  </div>;
};
export default OmOss;