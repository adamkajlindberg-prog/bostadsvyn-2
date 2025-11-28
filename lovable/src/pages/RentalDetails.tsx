import React from 'react';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import { RentalDetails as RentalDetailsComponent } from '@/components/RentalDetails';

const RentalDetails = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <RentalDetailsComponent />
      <LegalFooter />
    </div>
  );
};

export default RentalDetails;
