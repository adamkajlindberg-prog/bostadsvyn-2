import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import { Search, Brain, Heart, Bell, Target, Zap, TrendingUp, Filter, BarChart3, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
const AISokassistent = () => {
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 p-0">
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-4">
              <Brain className="h-4 w-4 mr-1" />
              Smart AI
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              AI Sökassistent
            </h1>
            <p className="text-xl text-foreground font-medium max-w-3xl mx-auto">
              En intelligent assistent som lär sig dina preferenser och rekommenderar nya bostäder baserat på din sökhistorik
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 p-0">
          {/* What is AI Search Assistant */}
          <div className="mb-20">
            <div className="max-w-4xl">
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Din personliga bostadsjägare</h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-foreground font-medium">
                  AI-sökassistenten är en intelligent bostadsjägare som arbetar dygnet runt för att hitta din perfekta bostad. Genom avancerad maskininlärning och beteendeanalys förstår systemet inte bara vad du söker - utan också varför.
                </p>
                <p className="text-foreground font-medium">
                  Tekniken analyserar över <span className="font-semibold">150+ datapunkter</span> från ditt beteende på plattformen - från vilka bostäder du klickar på och hur länge du tittar, till geografiska mönster och prispositionering. Detta skapar en <span className="font-semibold">dynamisk profil</span> som kontinuerligt förbättras ju mer du använder plattformen.
                </p>
                
                

                <Card className="bg-gradient-to-br from-accent/10 to-background border-accent/20 mt-6">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Shield className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Integritet och datasäkerhet</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          All analys sker med full respekt för din integritet. Din data används endast för att förbättra dina personliga rekommendationer och delas aldrig med tredje part. Du har full kontroll och kan när som helst radera din sökhistorik.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Huvudfunktioner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Brain className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Lärandealgoritm</h3>
                  <p className="text-muted-foreground">
                    AI:n förbättras kontinuerligt genom att lära av dina beteenden och preferenser.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Heart className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Personliga tips</h3>
                  <p className="text-muted-foreground">
                    Få dagliga rekommendationer av bostäder som passar just din profil och dina behov.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Bell className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Smarta notiser</h3>
                  <p className="text-muted-foreground">
                    Få omedelbar notis när nya bostäder som matchar dina kriterier läggs ut på marknaden.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Target className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Dold preferensanalys</h3>
                  <p className="text-muted-foreground">
                    Upptäck dolda mönster i dina preferenser som du kanske inte är medveten om.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Filter className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Smart filtrering</h3>
                  <p className="text-muted-foreground">
                    AI:n förstår komplexa önskemål och hittar bostäder även när de inte uppfyller alla kriterier exakt.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <TrendingUp className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Marknadsinsikter</h3>
                  <p className="text-muted-foreground">
                    Få tips om kommande områden och värdeökande bostäder baserat på AI-analys.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How it Learns */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Hur AI:n lär sig</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardHeader>
                  <CardTitle>Vad AI:n analyserar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Vilka bostäder du klickar på och tittar närmare på</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Hur länge du tittar på varje bostad</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Vilka bostäder du sparar som favoriter</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Dina sökningar och filterval</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Bostäder du kontaktar mäklare om</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Geografiska områden du ofta söker i</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardHeader>
                  <CardTitle>Vad AI:n lär sig</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Din prisrange och vad du faktiskt tittar på</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Föredragna områden och grannskapstyper</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Bostadstyp (lägenhet, villa, radhus)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Viktiga faciliteter (skolor, affärer, kommunikationer)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Arkitektonisk stil och ålder på fastigheter</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Prioriteringar mellan olika faktorer</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Fördelar med AI-sökassistenten</h2>
            <div className="space-y-6">
              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Zap className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Spara tid</h3>
                      <p className="text-muted-foreground">
                        Slipp att själv söka igenom hundratals annonser. AI:n hittar rätt bostäder åt dig automatiskt.
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
                      <h3 className="text-xl font-semibold mb-2">Upptäck nya möjligheter</h3>
                      <p className="text-muted-foreground">
                        AI:n kan föreslå bostäder du aldrig skulle ha hittat själv, men som ändå passar dina preferenser perfekt.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Bell className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Var först på bollen</h3>
                      <p className="text-muted-foreground">
                        Få notis direkt när nya relevanta bostäder läggs ut, innan mängden av andra spekulanter hinner reagera.
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
                      <h3 className="text-xl font-semibold mb-2">Lär känna dig själv</h3>
                      <p className="text-muted-foreground">
                        AI:n kan upptäcka preferenser och prioriteringar du inte visste att du hade, vilket hjälper dig fatta bättre beslut.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Member Exclusive */}
          <div className="mb-16">
            
          </div>

          {/* How it Works */}
          

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Låt AI:n hitta din drömbostad
            </h2>
            <p className="text-lg text-foreground font-medium mb-8 max-w-2xl mx-auto">
              Börja använda AI-sökassistenten idag och få personliga bostadsrekommendationer direkt till din inkorg.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild variant="default" size="lg">
                <Link to="/login">Skapa gratis konto</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/search">Börja söka bostäder</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LegalFooter />
    </div>;
};
export default AISokassistent;