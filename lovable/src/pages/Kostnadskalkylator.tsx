import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import { Calculator, PiggyBank, TrendingDown, FileText, Home, CreditCard, Target, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
const Kostnadskalkylator = () => {
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-4">
              <Calculator className="h-4 w-4 mr-1" />
              Kalkylverktyg
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Kostnadskalkylator
            </h1>
            <p className="text-xl text-foreground font-medium max-w-3xl mx-auto">
              Beräkna totala kostnader inklusive skatter, avgifter och låneinformation för att planera ditt bostadsköp
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* What is the Cost Calculator */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Vad är kostnadskalkylatorn?</h2>
            <p className="text-lg text-foreground font-medium leading-relaxed mb-6">
              Vår kostnadskalkylator ger dig en komplett bild av de verkliga kostnaderna för ett bostadsköp. Det räcker inte att bara titta på priset - det finns många andra kostnader som månatliga avgifter, räntor, amorteringar, driftskostnader och skatter som tillsammans utgör din totala boendekostnad.
            </p>
            <p className="text-lg text-foreground font-medium leading-relaxed">
              Kalkylatorn tar hänsyn till alla dessa faktorer och ger dig en realistisk månadsbudget. Du kan även jämföra olika lånealternativ, se hur räntebindning påverkar, och planera för framtida kostnadsförändringar. Allt för att du ska kunna fatta ett välgrundat beslut.
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Huvudfunktioner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <CreditCard className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Lånekalkyler</h3>
                  <p className="text-muted-foreground">
                    Beräkna månadskostnad för olika lån baserat på ränta, amortering och löptid.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <FileText className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Skatteinfo</h3>
                  <p className="text-muted-foreground">
                    Automatisk beräkning av ränteavdrag och fastighetsskatt baserat på aktuella regler.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <PiggyBank className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Månadsbudget</h3>
                  <p className="text-muted-foreground">
                    Se din totala månadskostnad inklusive alla avgifter, räntor och driftskostnader.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <Target className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Kontantinsatsberäkning</h3>
                  <p className="text-muted-foreground">
                    Beräkna hur mycket kontantinsats som krävs enligt krav på minst 15% av köpesumman.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <BarChart className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Belåningsgrad</h3>
                  <p className="text-muted-foreground">
                    Se hur mycket du kan låna och vilka amorteringskrav som gäller för olika belåningsgrader.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <TrendingDown className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Räntekänslighetsanalys</h3>
                  <p className="text-muted-foreground">
                    Se hur din månadskostnad påverkas om räntan förändras - viktigt för framtidsplanering.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Vad ingår i beräkningen?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardHeader>
                  <CardTitle>Lånekostnader</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Månadskostnad för ränta på bolån</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Amortering enligt krav (1-2% per år)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Ränteavdrag (skattelättnad på räntan)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Olika räntebindning och deras påverkan</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardHeader>
                  <CardTitle>Driftskostnader</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Månadsavgift (för bostadsrätter)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Fastighetsskatt eller fastighetsavgift</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Uppvärmningskostnader (för villor)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">El, vatten och sophämtning</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardHeader>
                  <CardTitle>Engångskostnader</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Lagfart (1,5% av köpeskillingen)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Pantbrev och inteckning</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Besiktningskostnad</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Flyttkostnader</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardHeader>
                  <CardTitle>Framtida kostnader</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Underhållskostnader (för villor)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Renoveringar och upprustningar</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Förväntade avgiftshöjningar</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <span className="text-muted-foreground">Räntehöjningar - stresstestning</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Fördelar med kostnadskalkylatorn</h2>
            <div className="space-y-6">
              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Calculator className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Fullständig översikt</h3>
                      <p className="text-muted-foreground">
                        Få alla kostnader samlade på ett ställe istället för att försöka räkna ut allt själv. Inga dolda kostnader eller överraskningar.
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
                      <h3 className="text-xl font-semibold mb-2">Realistisk budgetering</h3>
                      <p className="text-muted-foreground">
                        Förstå vad du verkligen har råd med och undvik att köpa för dyrt. Se din faktiska månadskostnad inklusive alla avgifter.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <BarChart className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Jämför alternativ</h3>
                      <p className="text-muted-foreground">
                        Jämför olika bostäder och lånealternativ sida vid sida för att hitta det mest ekonomiska alternativet.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <TrendingDown className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Stresstesta din ekonomi</h3>
                      <p className="text-muted-foreground">
                        Se hur din ekonomi påverkas vid räntehöjningar eller andra kostnadsförändringar. Planera för framtiden.
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
              Beräkna dina boendekostnader idag
            </h2>
            <p className="text-lg text-foreground font-medium mb-8 max-w-2xl mx-auto">
              Få en realistisk bild av vad ditt bostadsköp kommer att kosta. Använd vår kostnadskalkylator gratis.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild variant="default" size="lg">
                <Link to="/tools">Använd kostnadskalkylatorn</Link>
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
export default Kostnadskalkylator;