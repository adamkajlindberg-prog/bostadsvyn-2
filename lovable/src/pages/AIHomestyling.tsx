import {
  Brain,
  CheckCircle,
  Home,
  Palette,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import aiStagingImage from "@/assets/ai-staging-preview.jpg";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AIHomestyling = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-4">
              <Brain className="h-4 w-4 mr-1" />
              AI-Powered
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              AI-Homestyling
            </h1>
            <p className="text-xl text-foreground font-medium max-w-3xl mx-auto">
              Transformera tomma rum till inredda drömhem med vår avancerade
              AI-teknik
            </p>
          </div>

          {/* Featured Image */}
          <div className="mb-16">
            <Card className="overflow-hidden shadow-elevated bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
              <img
                src={aiStagingImage}
                alt="AI homestyling exempel"
                className="w-full h-auto"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* What is AI-Homestyling */}
          <div className="mb-20">
            <div className="max-w-4xl">
              <Badge variant="outline" className="mb-6 text-base">
                <Sparkles className="h-4 w-4 mr-2" />
                Avancerad teknologi
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">
                Vad är AI-Homestyling?
              </h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-foreground font-medium">
                  AI-Homestyling är en banbrytande teknik som revolutionerar hur
                  vi visualiserar bostäder. Genom avancerad artificiell
                  intelligens och djupinlärning kan vi transformera tomma eller
                  omöbleraderum till fullt inredda, fotorealistiska miljöer på
                  några sekunder.
                </p>
                <p className="text-foreground font-medium">
                  Vår proprietära AI-motor analyserar över{" "}
                  <span className="font-semibold">200 parametrar</span> i varje
                  bild - från rummets dimensioner och ljusförhållanden till
                  arkitektoniska detaljer som fönsterplacering, takhöjd och
                  golvmaterial. Detta gör att vi kan skapa visualiseringar som
                  inte bara ser professionella ut, utan också är arkitektoniskt
                  korrekta och realistiska.
                </p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Kraftfulla funktioner
            </h2>
            <p className="text-lg text-foreground font-medium mb-12 max-w-3xl">
              Vår AI-homestyling levererar professionella resultat med
              funktioner som tidigare endast var tillgängliga för stora
              fastighetsbolag och designbyråer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Zap className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">
                    Snabb rendering
                  </h3>
                  <p className="text-foreground font-medium">
                    Få fotorealistiska resultat på bara några sekunder. Ingen
                    lång väntetid - se resultatet omedelbart.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Palette className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Olika stilar</h3>
                  <p className="text-muted-foreground">
                    Välj mellan skandinavisk, modern, klassisk, minimalistisk
                    och många fler inredningsstilar.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Home className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">
                    Automatisk anpassning
                  </h3>
                  <p className="text-muted-foreground">
                    AI:n anpassar automatiskt möbler och inredning till rummets
                    storlek och form.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Sparkles className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">
                    Fotorealistisk kvalitet
                  </h3>
                  <p className="text-muted-foreground">
                    Resultat som ser ut som professionella interiörfoton med
                    korrekt ljussättning och skuggor.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <CheckCircle className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">
                    Flera alternativ
                  </h3>
                  <p className="text-muted-foreground">
                    Generera flera olika förslag för samma rum och jämför olika
                    inredningslösningar.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Brain className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">
                    Smart AI-analys
                  </h3>
                  <p className="text-muted-foreground">
                    AI:n förstår rummets funktion och föreslår relevant
                    inredning - sovrum får säng, kök får köksinredning.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
              Fördelar för olika användare
            </h2>

            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Home className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">För bostadsköpare</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-foreground font-medium mb-6">
                    Gör smartare köpbeslut genom att visualisera
                    bostadspotentialen innan du investerar.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">
                          Se bostadspotentialen
                        </p>
                        <p className="text-muted-foreground">
                          Visualisera hur tomma eller dåligt inredda rum kan se
                          ut när de är professionellt inredda
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">
                          Testa din egen stil
                        </p>
                        <p className="text-muted-foreground">
                          Prova olika inredningsstilar för att se vad som passar
                          dina preferenser bäst
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">
                          Få designinspiration
                        </p>
                        <p className="text-muted-foreground">
                          Använd AI-genereraden inredningen som inspiration för
                          ditt eget inredningsprojekt
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">
                          Jämför alternativ
                        </p>
                        <p className="text-muted-foreground">
                          Generera flera olika förslag och jämför vilken stil
                          och layout som tilltalar dig mest
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/5 to-background border-accent/20 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent/10 rounded-xl">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-xl">
                      För säljare och mäklare
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-foreground font-medium mb-6">
                    Sälj snabbare och till högre priser genom professionell
                    digital homestaging.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">
                          Öka försäljningspriset
                        </p>
                        <p className="text-muted-foreground">
                          Studier visar att homestagade bostäder säljs för 5-15%
                          högre pris än omöblerade alternativ
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">
                          Spara tid och pengar
                        </p>
                        <p className="text-muted-foreground">
                          Digital homestaging kostar en bråkdel av fysisk
                          staging och tar bara sekunder att genomföra
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">
                          Nå fler köpare
                        </p>
                        <p className="text-muted-foreground">
                          Visa flera olika inredningsstilar för att tilltala
                          olika målgrupper och öka räckvidden
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">
                          Sälj snabbare
                        </p>
                        <p className="text-muted-foreground">
                          Professionellt stagade bostäder får fler visningar och
                          säljs i genomsnitt 30-50% snabbare
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How it Works */}

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Redo att prova AI-Homestyling?
            </h2>
            <p className="text-lg text-foreground font-medium mb-8 max-w-2xl mx-auto">
              Börja visualisera din drömbostad idag. Logga in eller skapa ett
              konto för att komma igång.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild variant="default" size="lg">
                <Link to="/login">Logga in/Registrera dig</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LegalFooter />
    </div>
  );
};
export default AIHomestyling;
