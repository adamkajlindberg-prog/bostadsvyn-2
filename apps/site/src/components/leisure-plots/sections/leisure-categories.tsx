import type { LucideIcon } from "lucide-react";
import { MountainIcon, SunIcon, TreesIcon, WavesIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type CategoryIconName = "waves" | "trees" | "mountain" | "sun";

type Category = {
  iconName: CategoryIconName;
  name: string;
  description: string;
  badgeText: string;
};

const ICON_MAP: Record<CategoryIconName, LucideIcon> = {
  waves: WavesIcon,
  trees: TreesIcon,
  mountain: MountainIcon,
  sun: SunIcon,
};

const CATEGORIES: Category[] = [
  {
    iconName: "waves",
    name: "Havsnära fritidshus",
    description: "Charmiga stugor vid svenska västkusten och skärgården",
    badgeText: "2,847 annonser",
  },
  {
    iconName: "trees",
    name: "Skogstomter",
    description: "Natursköna tomter i skog för ditt drömhus",
    badgeText: "4,123 annonser",
  },
  {
    iconName: "mountain",
    name: "Fjällstugor",
    description: "Exklusiva stugor i Sveriges fjällvärd",
    badgeText: "892 annonser",
  },
  {
    iconName: "sun",
    name: "Lantgårdar",
    description: "Större gårdar och egendomar för det gröna livet",
    badgeText: "567 annonser",
  },
];

type CategoryCardProps = Category;

const CategoryCard = ({
  iconName,
  name,
  description,
  badgeText,
}: CategoryCardProps) => {
  const Icon = ICON_MAP[iconName];

  return (
    <Card className="py-6 shadow-xs border-primary/40">
      <CardContent className="px-6">
        <div className="flex justify-center mb-4">
          <div className="inline-flex bg-accent/10 rounded-full p-4 text-primary">
            <Icon size={32} />
          </div>
        </div>

        <h5 className="text-lg text-center font-semibold mb-2">{name}</h5>
        <p className="text-sm text-center text-muted-foreground mb-4">
          {description}
        </p>

        <div className="flex justify-center">
          <div className="bg-primary/10 text-xs text-center text-primary font-medium rounded-full px-3 py-1">
            {badgeText}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LeisureCategories = () => (
  <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-4 gap-6 mb-14">
    {CATEGORIES.map((category) => (
      <CategoryCard key={category.name} {...category} />
    ))}
  </div>
);

export default LeisureCategories;
