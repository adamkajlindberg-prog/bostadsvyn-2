import { Card, CardContent } from "@/components/ui/card";

type Tip = {
  title: string;
  items: string[];
};

const TIPS: Tip[] = [
  {
    title: "Innan du köper",
    items: [
      "Kontrollera bygglov och markförhållanden",
      "Undersök tillgång till el, vatten och avlopp",
      "Kolla vägtillgång och snöröjning",
      "Verifiera allemansrättsliga begränsningar",
    ],
  },
  {
    title: "Ekonomiska aspekter",
    items: [
      "Budgetera för underhåll och renovering",
      "Kontrollera fastighetsavgift och taxering",
      "Undersök föreningsavgifter om tillämpligt",
      "Tänk på försäkringar och säsongsboende",
    ],
  },
];

type TipSectionProps = Tip;

const TipSection = ({ title, items }: TipSectionProps) => (
  <div>
    <div className="font-semibold mb-2">{title}</div>
    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const TipsForBuyer = () => (
  <Card className="py-6 mb-12 shadow-xs bg-gradient-to-br from-primary/5 to-success/5">
    <CardContent className="px-6">
      <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight mb-6">
        Tips för fritidshusköpare
      </h3>

      <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6">
        {TIPS.map((tip) => (
          <TipSection key={tip.title} {...tip} />
        ))}
      </div>
    </CardContent>
  </Card>
);

export default TipsForBuyer;
