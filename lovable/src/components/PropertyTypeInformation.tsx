import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, AlertCircle, Euro, TrendingUp, Shield, Clock, 
  FileText, Home, Users, PiggyBank, Scale, Calculator, 
  Target, MapPin, Building, Zap, Droplet, Wifi, Key, Hammer
} from 'lucide-react';

interface PropertyTypeInformationProps {
  propertyType: string;
  status: string;
}

export const PropertyTypeInformation: React.FC<PropertyTypeInformationProps> = ({ 
  propertyType, 
  status 
}) => {
  const isRental = status === 'FOR_RENT';
  
  // Lägenhet/Bostadsrätt information
  const apartmentInfo = isRental ? {
    title: "Viktig information vid hyra av lägenhet",
    subtitle: "Allt du behöver veta om att hyra en lägenhet",
    cards: [
      {
        icon: FileText,
        title: "Hyresavtal & Regler",
        color: "primary",
        items: [
          { icon: FileText, text: "Kontrakt: Förstahand ger besittningsskydd, andrahand begränsat" },
          { icon: Clock, text: "Uppsägningstid: 3 månader för hyresgäst, 9 mån för hyresvärd" },
          { icon: AlertCircle, text: "Andrahandsuthyrning: Kräver hyresvärdens skriftliga tillstånd" },
          { icon: Shield, text: "Besittningsskydd: Stark rätt att bo kvar vid förstahandskontrakt" }
        ]
      },
      {
        icon: Euro,
        title: "Kostnader & Avgifter",
        color: "success",
        items: [
          { icon: Euro, text: "Hyra: Inkluderar ofta värme och vatten" },
          { icon: CheckCircle, text: "Deposition: Max 1 månadshyra vid privatuthyrning" },
          { icon: Zap, text: "El: Separat kostnad, ca 300-1000 kr/mån beroende på förbrukning" },
          { icon: Wifi, text: "Bredband: Ofta inkluderat, annars 200-400 kr/månad" }
        ]
      },
      {
        icon: Key,
        title: "Rättigheter & Skyldigheter",
        color: "accent",
        items: [
          { icon: Shield, text: "Hyresgästföreningen: Hjälper vid tvister, ca 120 kr/mån" },
          { icon: Hammer, text: "Underhåll: Hyresvärd ansvarar för vitvaror och stammar" },
          { icon: CheckCircle, text: "Skötsel: Du ska hålla lägenheten rent och väl vårdad" },
          { icon: AlertCircle, text: "Ändringar: Kräver alltid skriftligt godkännande" }
        ]
      }
    ]
  } : {
    title: "Viktig information vid köp av bostadsrätt",
    subtitle: "Allt du behöver veta innan du köper en bostadsrätt",
    cards: [
      {
        icon: Home,
        title: "BRF & Avgifter",
        color: "primary",
        items: [
          { icon: Users, text: "Bostadsrättsförening: Du blir medlem vid köp" },
          { icon: Euro, text: "Månadsavgift: Täcker drift, underhåll och eventuellt lån" },
          { icon: CheckCircle, text: "Andelstal: Din andel av föreningens kostnader och tillgångar" },
          { icon: PiggyBank, text: "Ekonomisk plan: Granska föreningens ekonomi och lån" }
        ]
      },
      {
        icon: FileText,
        title: "Köpprocess",
        color: "success",
        items: [
          { icon: CheckCircle, text: "Visning: Delta på visning och objektsbesiktning" },
          { icon: Euro, text: "Budgivning: Budgivning sker ofta uppåt från utgångspris" },
          { icon: Clock, text: "Kontrakt: Köpekontrakt och föreningsanmälan tecknas" },
          { icon: TrendingUp, text: "Lånelöfte: Säkra finansieringen innan budgivning" }
        ]
      },
      {
        icon: PiggyBank,
        title: "Finansiering",
        color: "accent",
        items: [
          { icon: TrendingUp, text: "Bolån: Max 85% av köpesumman enligt bolånetaket" },
          { icon: Euro, text: "Kontantinsats: Minst 15% av köpesumman" },
          { icon: AlertCircle, text: "Amorteringskrav: 2% vid belåning över 70%" },
          { icon: Shield, text: "Ränteavdrag: Möjlighet till skatteavdrag på räntekostnader" }
        ]
      }
    ]
  };

  // Villa/Radhus/Parhus/Kedjehus information (Friköpt fastighet)
  const houseInfo = isRental ? {
    title: "Viktig information vid hyra av villa/radhus",
    subtitle: "Allt du behöver veta om att hyra ett hus",
    cards: [
      {
        icon: FileText,
        title: "Hyresavtal & Ansvar",
        color: "primary",
        items: [
          { icon: FileText, text: "Kontrakt: Tydliga villkor för byggnad, tomt och ansvar" },
          { icon: Clock, text: "Bindningstid: Ofta 1-2 år, längre än lägenhet" },
          { icon: Hammer, text: "Trädgård: Specificera ansvar för gräsklippning och skötsel" },
          { icon: AlertCircle, text: "Snöröjning: Vanligen hyresgästens ansvar att röja" }
        ]
      },
      {
        icon: Euro,
        title: "Kostnader",
        color: "success",
        items: [
          { icon: Euro, text: "Hyra: Varierar stort beroende på storlek och läge" },
          { icon: Zap, text: "El & Värme: Ofta separat, 2,000-5,000 kr/mån" },
          { icon: Droplet, text: "Vatten: Kan vara inkluderat eller separat" },
          { icon: Shield, text: "Hemförsäkring: Obligatorisk, ca 200-500 kr/mån" }
        ]
      },
      {
        icon: Key,
        title: "Underhåll & Skötsel",
        color: "accent",
        items: [
          { icon: Hammer, text: "Byggnad: Hyresvärd ansvarar för tak, fasad, stammar" },
          { icon: CheckCircle, text: "Skötsel: Gräsklippning, ogräsrensning, snöröjning" },
          { icon: AlertCircle, text: "Småreparationer: Ofta hyresgästens ansvar att utföra" },
          { icon: Shield, text: "Besiktning: Dokumentera skick vid in- och utflytt noga" }
        ]
      }
    ]
  } : {
    title: "Viktig information vid köp av friköpt fastighet",
    subtitle: "Allt du behöver veta innan du köper villa, radhus, parhus eller kedjehus",
    cards: [
      {
        icon: FileText,
        title: "Köpprocess",
        color: "primary",
        items: [
          { icon: CheckCircle, text: "Besiktning: Alltid rekommenderad vid husköp, kostar 5,000-15,000 kr" },
          { icon: Clock, text: "Dolda fel: 10 års reklamationsrätt vid dolda fel" },
          { icon: Shield, text: "Köpekontrakt: Viktigt med tydliga villkor och tillträdesdag" },
          { icon: AlertCircle, text: "Budgivning: Kontrollera acceptfrist och eventuella förbehåll" }
        ]
      },
      {
        icon: Euro,
        title: "Ekonomi & Löpande Kostnader",
        color: "success",
        items: [
          { icon: TrendingUp, text: "Fastighetsavgift: Ca 8,283 kr/år för småhus (upp till 1 mkr taxeringsvärde)" },
          { icon: Shield, text: "Hemförsäkring: Budgetera 3,000-8,000 kr/år beroende på värde" },
          { icon: Hammer, text: "Underhåll: 1-2% av fastighetsvärdet årligen för löpande underhåll" },
          { icon: Euro, text: "Drift: El, vatten, avlopp, sophämtning 1,500-4,000 kr/mån" }
        ]
      },
      {
        icon: PiggyBank,
        title: "Finansiering & Lån",
        color: "accent",
        items: [
          { icon: TrendingUp, text: "Bolån: Max 85% av köpesumman enligt bolånetaket" },
          { icon: Euro, text: "Kontantinsats: Minst 15% av köpesumman + lagfartskostnad" },
          { icon: AlertCircle, text: "Amorteringskrav: 1-2% årligen beroende på belåningsgrad" },
          { icon: CheckCircle, text: "Lånelöfte: Ordna innan budgivning för att vara trygg" }
        ]
      }
    ]
  };

  // Nyproduktion information
  const newProductionInfo = {
    title: "Viktig information vid köp av nyproduktion",
    subtitle: "Allt du behöver veta om att köpa en nybyggd bostad",
    cards: [
      {
        icon: Building,
        title: "Köpprocess & Avtal",
        color: "primary",
        items: [
          { icon: FileText, text: "Entreprenadavtal: Tecknas tidigt, ofta innan byggnation startar" },
          { icon: Clock, text: "Inflyttning: Planerad tid anges, men kan förskjutas" },
          { icon: Shield, text: "Garanti: 10 års byggnadsgaranti genom försäkring" },
          { icon: AlertCircle, text: "Betalning: Handpenning + etappbetalningar under byggtiden" }
        ]
      },
      {
        icon: CheckCircle,
        title: "Fördelar & Säkerhet",
        color: "success",
        items: [
          { icon: Home, text: "Nytt skick: Allt är nytt, inga omedelbara renoveringsbehov" },
          { icon: Zap, text: "Energieffektivt: Moderna system ger låga driftskostnader" },
          { icon: Shield, text: "Konsumentskydd: Starkt skydd enligt konsumentkköplagen" },
          { icon: CheckCircle, text: "Reklamationsrätt: 2 år på fel och brister från överlämnandet" }
        ]
      },
      {
        icon: Calculator,
        title: "Ekonomi & Kostnader",
        color: "accent",
        items: [
          { icon: Euro, text: "ROT-avdrag: 50,000 kr avdrag per person vid nybyggnation" },
          { icon: AlertCircle, text: "Slutpris: Kan ändras om ändringar görs under byggtiden" },
          { icon: TrendingUp, text: "Indexuppräkning: Priset kan justeras enligt byggindex" },
          { icon: PiggyBank, text: "Lånelöfte: Ordna tidigt då lånebehovet är känt" }
        ]
      }
    ]
  };

  // Tomt information
  const plotInfo = {
    title: "Viktig information vid köp av tomt",
    subtitle: "Allt du behöver veta innan du köper en tomt",
    cards: [
      {
        icon: FileText,
        title: "Tillstånd & Bygglov",
        color: "primary",
        items: [
          { icon: CheckCircle, text: "Detaljplan: Kontrollera detaljplan hos kommunen" },
          { icon: Building, text: "Byggrätt: Verifiera maximal byggnadsarea" },
          { icon: AlertCircle, text: "Bygglov: Planera för bygglovskostnader 10,000-30,000 kr" },
          { icon: Shield, text: "Anslutningsavgifter: El, vatten, avlopp kan kosta 100,000-400,000 kr" }
        ]
      },
      {
        icon: Hammer,
        title: "Byggnation",
        color: "success",
        items: [
          { icon: Euro, text: "Byggnadsarbete: Budgetera för hela byggprocessen" },
          { icon: Clock, text: "Tidsplan: Räkna med 12-24 månader för nybyggnation" },
          { icon: CheckCircle, text: "Byggherre: Överväg om du vill vara egen byggherre" },
          { icon: Shield, text: "Försäkring: Allriskförsäkring under byggtiden" }
        ]
      },
      {
        icon: Target,
        title: "Läge & Mark",
        color: "accent",
        items: [
          { icon: MapPin, text: "Markförhållanden: Undersök mark och geoteknik" },
          { icon: Droplet, text: "Dränering: Kontrollera dräneringsförhållanden" },
          { icon: Zap, text: "Infrastruktur: Närhet till vägar och service" },
          { icon: TrendingUp, text: "Värdeutveckling: Analysera områdets utveckling" }
        ]
      }
    ]
  };

  // Fritidshus information
  const vacationHomeInfo = {
    title: "Viktig information vid köp av fritidshus",
    subtitle: "Allt du behöver veta innan du köper ett fritidshus",
    cards: [
      {
        icon: FileText,
        title: "Tillstånd & Regler",
        color: "primary",
        items: [
          { icon: CheckCircle, text: "Detaljplan: Kontrollera bestämmelser hos kommunen" },
          { icon: Shield, text: "Strandskydd: Minst 100m från strand, särskilda regler gäller" },
          { icon: Building, text: "Byggrätt: Verifiera maximal byggnadsarea" },
          { icon: AlertCircle, text: "Allemansrätt: Kontrollera begränsningar" }
        ]
      },
      {
        icon: Zap,
        title: "Infrastruktur",
        color: "success",
        items: [
          { icon: Zap, text: "El: Kontrollera elnät eller alternativa lösningar" },
          { icon: Droplet, text: "Vatten: Egen brunn, vattentank eller kommunalt?" },
          { icon: Building, text: "Avlopp: Kontrollera avloppslösning och krav" },
          { icon: Wifi, text: "Bredband: Verifiera täckning för internetuppkoppling" }
        ]
      },
      {
        icon: Euro,
        title: "Ekonomi",
        color: "accent",
        items: [
          { icon: TrendingUp, text: "Fastighetsavgift: 0,75% av taxeringsvärdet årligen" },
          { icon: Shield, text: "Försäkring: Särskild för fritidshus, 3,000-8,000 kr/år" },
          { icon: Clock, text: "Underhåll: 1-2% av fastighetsvärdet årligen" },
          { icon: AlertCircle, text: "Drift: El, snöröjning, sophämtning" }
        ]
      }
    ]
  };

  // Kommersiellt information
  const commercialInfo = isRental ? {
    title: "Viktig information vid hyra av kommersiell lokal",
    subtitle: "Allt företag behöver veta om kommersiella hyresavtal",
    cards: [
      {
        icon: Scale,
        title: "Juridik & Avtal",
        color: "primary",
        items: [
          { icon: FileText, text: "Avtal: Triple Net, Brutto eller Netto - läs villkoren noga" },
          { icon: Clock, text: "Hyrestid: Ofta 3-5 år med option på förlängning" },
          { icon: AlertCircle, text: "Besittningsskydd: Saknas ofta vid kommersiell hyra" },
          { icon: Shield, text: "Uppsägning: 9 månader är vanligt för lokalhyra" }
        ]
      },
      {
        icon: Calculator,
        title: "Kostnader",
        color: "success",
        items: [
          { icon: Euro, text: "Hyra: Per m², 500-5,000 kr/m²/år beroende på läge" },
          { icon: TrendingUp, text: "Driftskostnader: Ofta tillkommer 200-600 kr/m²/år" },
          { icon: CheckCircle, text: "Indexuppräkning: Hyra justeras årligen enligt KPI" },
          { icon: Building, text: "Anpassning: Investeringar i lokalen, ofta 1,000-5,000 kr/m²" }
        ]
      },
      {
        icon: Target,
        title: "Läge & Verksamhet",
        color: "accent",
        items: [
          { icon: MapPin, text: "Läge: A-läge dyrast men högst genomströmning" },
          { icon: Users, text: "Målgrupp: Analysera passagerarflöde och demografi" },
          { icon: Building, text: "Användning: Kontrollera att verksamheten är tillåten" },
          { icon: CheckCircle, text: "Parkering: Avgörande för detaljhandel och vissa tjänster" }
        ]
      }
    ]
  } : {
    title: "Viktig information vid köp av kommersiell fastighet",
    subtitle: "Allt företag och investerare behöver veta",
    cards: [
      {
        icon: Scale,
        title: "Juridik & Avtal",
        color: "primary",
        items: [
          { icon: FileText, text: "Hyresavtal: Befintliga hyresavtal ingår i köpet" },
          { icon: Clock, text: "Hyrestid: Kontrollera bindningstider och villkor" },
          { icon: AlertCircle, text: "Besittningsskydd: Begränsat för kommersiella hyresgäster" },
          { icon: Shield, text: "Due diligence: Grundlig granskning av avtal och ekonomi" }
        ]
      },
      {
        icon: Calculator,
        title: "Ekonomisk Kalkyl",
        color: "success",
        items: [
          { icon: Euro, text: "Direktavkastning: Nettodriftsintäkt / Köpeskilling (4-8%)" },
          { icon: TrendingUp, text: "Driftsnetton: Hyresintäkter minus driftskostnader" },
          { icon: Calculator, text: "Kassaflöde: Prognostisera inkomster och utgifter" },
          { icon: Shield, text: "Värdering: Ortspris-, avkastnings- och produktionsmetod" }
        ]
      },
      {
        icon: Target,
        title: "Läge & Marknad",
        color: "accent",
        items: [
          { icon: MapPin, text: "Lägesanalys: Trafik, synlighet, tillväxtpotential" },
          { icon: Users, text: "Demografi: Målgrupp och befolkningsutveckling" },
          { icon: TrendingUp, text: "Vakansgrad: Lokalt utbud och efterfrågan" },
          { icon: Building, text: "Konkurrens: Befintliga och planerade objekt" }
        ]
      }
    ]
  };

  // Välj rätt information baserat på property_type
  let infoData = apartmentInfo;
  
  if (propertyType === 'villa' || propertyType === 'radhus' || propertyType === 'parhus' || propertyType === 'kedjehus') {
    infoData = houseInfo;
  } else if (propertyType === 'tomt') {
    infoData = plotInfo;
  } else if (propertyType === 'fritidshus') {
    infoData = vacationHomeInfo;
  } else if (propertyType === 'kommersiellt') {
    infoData = commercialInfo;
  } else if (propertyType === 'nyproduktion') {
    infoData = newProductionInfo;
  }

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-3">{infoData.title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {infoData.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {infoData.cards.map((card, index) => {
          const IconComponent = card.icon;
          const colorClasses = {
            primary: 'bg-primary/10 text-primary',
            success: 'bg-success/10 text-success',
            accent: 'bg-accent/10 text-accent',
            premium: 'bg-premium/10 text-premium'
          };
          const iconBgClass = colorClasses[card.color as keyof typeof colorClasses] || 'bg-primary/10';
          const iconColorClass = card.color === 'primary' ? 'text-primary' : 
                                 card.color === 'success' ? 'text-success' : 
                                 card.color === 'accent' ? 'text-accent' : 
                                 card.color === 'premium' ? 'text-premium' : 'text-primary';
          
          return (
            <Card key={index} className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={iconBgClass.split(' ')[0] + ' rounded-lg p-2'}>
                    <IconComponent className={`h-5 w-5 ${iconColorClass}`} />
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {card.items.map((item, itemIndex) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={itemIndex} className="flex items-start gap-2">
                      <ItemIcon className={`h-4 w-4 ${iconColorClass} mt-0.5 flex-shrink-0`} />
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};