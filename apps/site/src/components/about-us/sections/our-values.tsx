import { Card, CardContent } from "@/components/ui/card";
import { valueCategories, advantages, advantagesHeader, ourValuesHeader } from "@/utils/constants";
import { getIcon } from "../utils/icon-map";

const OurValues = () => {
  return (
    <>
      <h2 className="text-2xl @lg:text-3xl text-center font-semibold mb-10">
        {ourValuesHeader.title}
      </h2>
      <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-4 gap-6 mb-14">
        {valueCategories.map((category) => {
          const IconComponent = getIcon(category.iconName);
          return (
            <Card key={category.id} className="py-6 shadow-xs border-primary/40">
              <CardContent className="px-6">
                <div className="flex justify-center mb-4">
                  <div className="inline-flex bg-accent/10 rounded-full p-4 text-primary">
                    <IconComponent size={32} />
                  </div>
                </div>

                <h5 className="text-lg text-center font-semibold mb-2">
                  {category.name}
                </h5>
                <p className="text-sm text-center text-muted-foreground">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <h2 className="text-2xl @lg:text-3xl text-center font-semibold mb-10">
        {advantagesHeader.title}
      </h2>
      <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-6 pb-16 mb-14 border-b-2">
        {advantages.map((advantage) => {
          const IconComponent = getIcon(advantage.iconName);
          return (
            <Card key={advantage.id} className="py-6 shadow-xs">
              <CardContent className="px-6">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="inline-flex text-primary">
                    <IconComponent />
                  </div>
                  <div className="text-base @lg:text-lg font-semibold">
                    {advantage.title}
                  </div>
                </div>
                <p className="text-sm @lg:text-base text-muted-foreground">
                  {advantage.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default OurValues;
