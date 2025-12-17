import ProjectCard from "@/components/new-production/project-card";
import { properties } from "@/utils/constants";

const CommercialProperties = () => {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">
          Utvalda kommersiella fastigheter
        </h3>
        <div className="text-xs text-center font-semibold rounded-full border px-3 py-1">
          Exklusiva objekt
        </div>
      </div>

      <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-6 mb-12">
        {properties.map((property) => (
          <ProjectCard key={property.name} project={property} />
        ))}
      </div>
    </>
  );
};

export default CommercialProperties;
