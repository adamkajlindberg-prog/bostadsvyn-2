import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Kommersiella objekt",
    value: "8,450",
    colorClass: "text-primary",
  },
  {
    title: "Tillgänglig yta",
    value: "1,2M m²",
    colorClass: "text-green-600",
  },
  {
    title: "Aktiva mäklare",
    value: "340",
    colorClass: "text-accent-foreground",
  },
  {
    title: "Klientnöjdhet",
    value: "94%",
    colorClass: "text-emerald-500",
  },
];

const Stats = () => {
  return (
    <div className="grid grid-cols-2 @lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat) => (
        <Card key={stat.title} className="text-center py-6 shadow-xs">
          <CardContent className="px-6">
            <div className={`text-3xl font-bold mb-2 ${stat.colorClass}`}>
              {stat.value}
            </div>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Stats;
