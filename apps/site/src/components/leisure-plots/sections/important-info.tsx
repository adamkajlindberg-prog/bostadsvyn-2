import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INFO_CARDS, type InfoCardData, type InfoCardItem } from "./important-info-data";

const InfoCardItemRow = ({ icon: Icon, text }: InfoCardItem) => (
  <div className="flex items-start gap-2">
    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
);

const InfoCard = ({
  icon: Icon,
  iconColorClass,
  bgColorClass,
  title,
  items,
}: InfoCardData) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex items-center gap-3">
        <div className={`${bgColorClass} rounded-lg p-2`}>
          <Icon className={`h-5 w-5 ${iconColorClass}`} />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {items.map((item) => (
        <div key={item.text} className={iconColorClass}>
          <InfoCardItemRow {...item} />
        </div>
      ))}
    </CardContent>
  </Card>
);

const ImportantInfo = () => (
  <div className="mb-12">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold mb-3">
        Viktig information för fritidshusköpare
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Allt du behöver veta innan du investerar i en fritidsbostad eller tomt
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {INFO_CARDS.map((card) => (
        <InfoCard key={card.title} {...card} />
      ))}
    </div>
  </div>
);

export default ImportantInfo;
