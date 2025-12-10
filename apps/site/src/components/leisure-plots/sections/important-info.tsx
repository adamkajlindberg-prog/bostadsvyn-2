import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoItem, InfoSection, INFO_SECTIONS } from "@/utils/contants";


const InfoItemRow = ({ icon: Icon, text }: InfoItem) => (
  <div className="flex items-start gap-2">
    <Icon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
);

const InfoCard = ({ section }: { section: InfoSection }) => {
  const HeaderIcon = section.icon;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`${section.iconBgClass} rounded-lg p-2`}>
            <HeaderIcon className={`h-5 w-5 ${section.iconColorClass}`} />
          </div>
          <CardTitle className="text-lg">{section.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {section.items.map((item) => (
          <InfoItemRow key={item.text} icon={item.icon} text={item.text} />
        ))}
      </CardContent>
    </Card>
  );
};

const ImportantInfo = () => {
  return (
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
        {INFO_SECTIONS.map((section) => (
          <InfoCard key={section.title} section={section} />
        ))}
      </div>
    </div>
  );
};

export default ImportantInfo;
