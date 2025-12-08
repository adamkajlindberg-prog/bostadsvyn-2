import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import { TrendingUp, LineChart, MapPin, Calculator, Brain, BarChart3, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
const Prisanalys = () => {
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 p-0">
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-4">
              <Brain className="h-4 w-4 mr-1" />
              AI-Driven
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Prisanalys & Prognoser
            </h1>
            <p className="text-xl text-foreground font-medium max-w-3xl mx-auto">Få trovärdiga värderingar och framtida prisförutsägelser baserat på marknadsdata och avancerad AI</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 p-0">
          {/* What is Price Analysis */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Vad är AI-driven prisanalys?</h2>
            <p className="text-lg text-foreground font-medium leading-relaxed mb-6">Vår AI-drivna prisanalys kombinerar historiska transaktionsdata, aktuella marknadsförhållanden och avancerade prediktionsmodeller för att ge dig de mest trovärdiga värderingarna på bostadsmarknaden. Vi analyserar tusentals datapunkter för att förstå vad som påverkar priset på just din bostad.</p>
            <p className="text-lg text-foreground font-medium leading-relaxed">
              Med realtidsdata från hela svenska bostadsmarknaden kan vi inte bara berätta vad en bostad är värd idag, utan också prognostisera hur värdet kommer att utvecklas framåt. Detta ger dig ett tydligt beslutsunderlag oavsett om du ska köpa eller sälja.
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Huvudfunktioner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <LineChart className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Realtidsdata</h3>
                  <p className="text-muted-foreground">
                    Prisanalyser baserade på de senaste transaktionerna och marknadsförändringar i realtid.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Target className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Konfidensintervall</h3>
                  <p className="text-muted-foreground">
                    Se inte bara ett pris utan ett intervall med sannolikhet för att förstå osäkerheten.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <MapPin className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Områdesanalys</h3>
                  <p className="text-muted-foreground">
                    Djupgående analys av hur området påverkar priset och framtida värdeutveckling.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <TrendingUp className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Prisförutsägelser</h3>
                  <p className="text-muted-foreground">
                    AI-baserade prognoser för hur priset förväntas utvecklas de kommande 6-12 månaderna.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <BarChart3 className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Jämförbar analys</h3>
                  <p className="text-muted-foreground">
                    Jämför med liknande objekt i området för att se hur prisvärt objektet är.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Calculator className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Detaljerad uppdelning</h3>
                  <p className="text-muted-foreground">
                    Förstå exakt vilka faktorer som påverkar priset och hur mycket varje faktor väger.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What We Analyze */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Vad analyserar vi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardHeader>
                  <CardTitle>Objektspecifika faktorer</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Bostadstyp (lägenhet, villa, radhus)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Storlek (yta och antal rum)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Ålder och skick</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Våningsplan och utsikt</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Balkong, uteplats eller trädgård</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Standard på kök och badrum</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardHeader>
                  <CardTitle>Områdesspecifika faktorer</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Läge och närhet till stadskärna</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Kollektivtrafik och kommunikationer</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Skolor och barnomsorg</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Service och butiker</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Historisk prisutveckling i området</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Kommande stadsplanering och utveckling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Fördelar med vår prisanalys</h2>
            <div className="space-y-6">
              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Zap className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Snabbare beslutsfattande</h3>
                      <p className="text-muted-foreground">
                        Få en omedelbar värdering istället för att vänta på mäklarbedömningar. Du kan analysera flera bostäder på kort tid.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Target className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Bättre förhandlingsposition</h3>
                      <p className="text-muted-foreground">
                        Med detaljerad prisanalys och jämförelser kan du förhandla mer effektivt oavsett om du köper eller säljer.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <TrendingUp className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Långsiktig planering</h3>
                      <p className="text-muted-foreground">
                        Prisförutsägelser hjälper dig att planera när det är bäst att köpa eller sälja för maximal avkastning.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Brain className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Objektivt beslutsunderlag</h3>
                      <p className="text-muted-foreground">
                        AI-baserade analyser ger dig objektiva siffror utan känslomässiga bedömningar eller säljintresse.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Få en värdering idag
            </h2>
            <p className="text-lg text-foreground font-medium mb-8 max-w-2xl mx-auto">
              Börja analysera priser och få värdefulla insikter om bostadsmarknaden. Skapa ett konto för att komma igång.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild variant="default" size="lg">
                <Link to="/ai-tools">Testa prisanalys</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/search">Sök bostäder</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LegalFooter />
    </div>;
};
export default Prisanalys;