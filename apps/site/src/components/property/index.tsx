"use client";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ContainerWrapper from "@/components/common/container-wrapper";
import Area from "./sections/area";
import ContactBroker from "./sections/contact-broker";
import CostEstimate from "./sections/cost-estimate";
import PropertyImages from "./sections/property-images";
import PropertyInfo from "./sections/property-info";
import SimilarProperties from "./sections/similar-properties";
import Statistics from "./sections/statistics";

const Property = () => {
  const router = useRouter();

  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <button
          type="button"
          className="inline-flex items-center gap-x-2.5 text-sm hover:underline underline-offset-2 mb-8 cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon size={18} /> Tillbaka
        </button>

        <div className="grid grid-cols-1 @5xl:grid-cols-12 gap-8">
          <div className="@5xl:col-span-8 flex flex-col gap-6">
            <PropertyImages />
            <PropertyInfo />
          </div>

          <div className="@5xl:col-span-4 flex flex-col gap-6">
            <ContactBroker />
            <CostEstimate />
            <Area />
            <Statistics />
            <SimilarProperties />
          </div>
        </div>
      </ContainerWrapper>
    </div>
  );
};

export default Property;
