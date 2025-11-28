import React from 'react';
import Navigation from '@/components/Navigation';
import { PropertySearch } from '@/components/PropertySearch';
import LegalFooter from '@/components/LegalFooter';
import { Helmet } from 'react-helmet-async';

const KommersiellFastighet = () => {
  return (
    <>
      <Helmet>
        <title>Kommersiella fastigheter - Bostadsvyn</title>
        <meta name="description" content="Sök bland kommersiella fastigheter till salu och uthyrning. Lokaler, kontor, industrifastigheter och affärslokaler." />
        <meta name="keywords" content="kommersiella fastigheter, lokaler, kontor, industri, affärslokaler, näringsfastigheter" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <PropertySearch defaultTab="COMMERCIAL" />
        </main>
        <LegalFooter />
      </div>
    </>
  );
};

export default KommersiellFastighet;
