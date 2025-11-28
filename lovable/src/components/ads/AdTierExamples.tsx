import React from 'react';
import PropertyCard, { Property } from '@/components/PropertyCard';
import { TEST_LISTING_PROPERTIES } from '@/data/testProperties';


const AdTierExamples = () => {
  // Använd samma bild och text för alla tre paket så att skillnaden mellan paketen syns tydligt
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const baseProperty: Property = {
    ...TEST_LISTING_PROPERTIES[0],
    ad_tier: 'premium',
    viewing_times: [
      {
        date: tomorrowStr,
        time: '18:00-19:00',
        status: 'scheduled' as const,
        spots_available: 8
      }
    ]
  } as unknown as Property;
  
  if (!baseProperty) return null;

  // Skapa tre versioner av samma annons med olika ad_tier
  const premiumExample: Property = { ...baseProperty, ad_tier: 'premium' };
  const plusExample: Property = { ...baseProperty, ad_tier: 'plus' };
  const freeExample: Property = { ...baseProperty, ad_tier: 'free' };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <PropertyCard property={premiumExample} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <PropertyCard property={plusExample} />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-1">
          <PropertyCard property={freeExample} />
        </div>
      </div>
    </div>
  );
};

export default AdTierExamples;
