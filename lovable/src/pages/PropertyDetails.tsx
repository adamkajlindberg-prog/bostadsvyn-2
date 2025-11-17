import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import { PropertyDetails as PropertyDetailsComponent } from "@/components/PropertyDetails";

const PropertyDetails = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PropertyDetailsComponent />
      <LegalFooter />
    </div>
  );
};

export default PropertyDetails;
