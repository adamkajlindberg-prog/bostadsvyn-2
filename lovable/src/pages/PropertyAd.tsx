import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';

/**
 * PropertyAd is a router component that redirects to the appropriate
 * detail page based on property type:
 * - FOR_RENT → /rental/:id (hyresbostäder)
 * - Broker properties → /broker/property/:id (mäklarfastigheter)
 * - Others → /property/:id (vanliga fastigheter)
 */
const PropertyAd = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    redirectToDetailPage();
  }, [id]);

  const redirectToDetailPage = async () => {
    if (!id) {
      navigate('/', { replace: true });
      return;
    }

    // Sanitize id to a valid UUID (handles accidental suffixes like "-d0")
    const cleanId = id.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)?.[0] || id;

    try {
      // Check if property exists in database
      const { data: propertyData } = await supabase
        .from('properties')
        .select('status, user_id')
        .eq('id', cleanId)
        .maybeSingle();

      if (propertyData) {
        // Redirect based on status
        if (propertyData.status === 'FOR_RENT') {
          navigate(`/rental/${cleanId}`, { replace: true });
          return;
        }
        
        // Check if it's a broker property
        const { data: brokerData } = await supabase
          .from('brokers')
          .select('id')
          .eq('user_id', propertyData.user_id)
          .maybeSingle();
        
        if (brokerData) {
          navigate(`/broker/property/${cleanId}`, { replace: true });
        } else {
          navigate(`/property/${cleanId}`, { replace: true });
        }
        return;
      }

      // If not in database, check mock/test data
      // Test rental property
      if (cleanId === '550e8400-e29b-41d4-a716-446655440010' || 
          cleanId === '550e8400-e29b-41d4-a716-446655440011') {
        navigate(`/rental/${cleanId}`, { replace: true });
        return;
      }

      // All other test properties go to standard property details (supports test data)
      if (cleanId.startsWith('550e8400-e29b-41d4-a716-4466554400')) {
        navigate(`/property/${cleanId}`, { replace: true });
        return;
      }

      // Default to property details
      navigate(`/property/${cleanId}`, { replace: true });
      
    } catch (error) {
      console.error('Error redirecting:', error);
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Laddar fastighet...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PropertyAd;
