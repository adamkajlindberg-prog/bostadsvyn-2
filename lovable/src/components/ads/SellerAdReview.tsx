import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Package, CreditCard, FileText, Home, User, ImageIcon, Crown, TrendingUp, Star, Edit2, Check, X } from 'lucide-react';
interface SellerAdReviewProps {
  ad: any;
  onApproved: () => void;
  onRejected: () => void;
}
export const SellerAdReview: React.FC<SellerAdReviewProps> = ({
  ad,
  onApproved,
  onRejected
}) => {
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [expandDescription, setExpandDescription] = useState(false);
  const [editingBillingAddress, setEditingBillingAddress] = useState(false);
  const [editedBillingAddress, setEditedBillingAddress] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(ad.ad_tier);
  const brokerData = ad.broker_form_data || {};
  const property = ad.properties;
  const videoUrl = property?.video_url || brokerData?.videoUrl || brokerData?.media?.videoUrl || ad.video_url;
  const threedTourUrl = property?.threed_tour_url || brokerData?.threedTourUrl || brokerData?.media?.threedTourUrl || ad.threed_tour_url;
  const handleApprove = async () => {
    try {
      setLoading(true);

      // Om grundpaket (gratis), publicera direkt
      if (ad.ad_tier === 'free') {
        const {
          error
        } = await supabase.from('ads').update({
          moderation_status: 'approved',
          seller_approved_at: new Date().toISOString(),
          payment_status: 'paid',
          published_at: new Date().toISOString()
        }).eq('id', ad.id);
        if (error) throw error;
        toast({
          title: 'Annons publicerad',
          description: 'Din annons är nu live!'
        });
        onApproved();
        return;
      }

      // För plus och premium, starta betalningsprocess
      const {
        data,
        error
      } = await supabase.functions.invoke('create-ad-payment', {
        body: {
          adId: ad.id,
          adTier: ad.ad_tier
        }
      });
      if (error) throw error;
      if (!data?.url) throw new Error('Ingen betalningslänk mottagen');

      // Öppna Stripe Checkout i nytt fönster
      window.open(data.url, '_blank');
      toast({
        title: 'Betalsida öppnad',
        description: 'Slutför betalningen för att publicera din annons.'
      });
    } catch (error) {
      console.error('Error starting payment:', error);
      toast({
        title: 'Ett fel uppstod',
        description: 'Kunde inte starta betalningen. Försök igen.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleReject = async () => {
    try {
      setLoading(true);
      const {
        error
      } = await supabase.from('ads').update({
        moderation_status: 'rejected'
      }).eq('id', ad.id);
      if (error) throw error;
      toast({
        title: 'Annons avvisad',
        description: 'Mäklaren har informerats om att annonsen behöver uppdateras.'
      });
      onRejected();
    } catch (error) {
      console.error('Error rejecting ad:', error);
      toast({
        title: 'Ett fel uppstod',
        description: 'Kunde inte avvisa annonsen. Försök igen.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const getPackageName = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'Exklusivpaket';
      case 'plus':
        return 'Pluspaket';
      default:
        return 'Grundpaket';
    }
  };
  return <Card className="border-primary/50">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Färdigställ och granska annons
          </CardTitle>
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
            Inväntar godkännande
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-8">
        {/* Property Information */}
        <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Home className="h-5 w-5 text-primary" />
            </div>
            Fastighetsinformation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Titel</span>
              <p className="text-base font-semibold text-foreground">{ad.title}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Adress</span>
              <p className="text-base font-semibold text-foreground">{property?.address_street}, {property?.address_city}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pris</span>
              <p className="text-base font-semibold text-foreground">{property?.price?.toLocaleString('sv-SE')} kr</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Boarea</span>
              <p className="text-base font-semibold text-foreground">{property?.living_area} m²</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rum</span>
              <p className="text-base font-semibold text-foreground">{property?.rooms} rum</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Typ</span>
              <p className="text-base font-semibold text-foreground">{property?.property_type}</p>
            </div>
            {property?.bedrooms && <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sovrum</span>
                <p className="text-base font-semibold text-foreground">{property.bedrooms} st</p>
              </div>}
            {property?.bathrooms && <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Badrum</span>
                <p className="text-base font-semibold text-foreground">{property.bathrooms} st</p>
              </div>}
          </div>
          {ad.description && <div className="mt-6 pt-6 border-t border-border/50">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-3">Beskrivning</span>
              <div>
                <div className={`overflow-hidden transition-all duration-300 ${ad.description.length > 200 ? expandDescription ? 'max-h-[500px]' : 'max-h-[80px]' : 'max-h-none'}`}>
                  <p className="text-sm text-foreground leading-relaxed">{ad.description}</p>
                </div>
                {ad.description.length > 200 && <Button variant="ghost" size="sm" onClick={() => setExpandDescription(!expandDescription)} className="mt-3 h-9 text-xs font-medium">
                    {expandDescription ? 'Visa mindre' : 'Visa mer'}
                  </Button>}
              </div>
            </div>}
        </div>


        {/* Ad Details */}
        <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            Annonsdetaljer
          </h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Annonsrubrik</span>
              <p className="text-base font-semibold text-foreground">{ad.title}</p>
            </div>
            
            <Separator className="bg-border/50" />
            
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Film</span>
              {videoUrl ? <>
                  <p className="text-base font-semibold text-foreground">
                    Filmlänk har lagts till
                  </p>
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline text-primary break-all hover:text-primary/80 transition-colors block mt-1">
                    {videoUrl}
                  </a>
                  {brokerData.useVideoAsMainImage && <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mt-2">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                      Används som förstabild
                    </p>}
                </> : <p className="text-base font-semibold text-foreground">
                  Ingen filmlänk har lagts till
                </p>}
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">3D-visning</span>
              {threedTourUrl ? <>
                  <p className="text-base font-semibold text-foreground">
                    3D-visningslänk har lagts till
                  </p>
                  <a href={threedTourUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline text-primary break-all hover:text-primary/80 transition-colors block mt-1">
                    {threedTourUrl}
                  </a>
                </> : <p className="text-base font-semibold text-foreground">
                  Ingen 3D-visningslänk har lagts till
                </p>}
            </div>

            <Separator className="bg-border/50" />

            {ad.custom_image_url && <>
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Anpassad annonsbild</span>
                <p className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Egen bild har laddats upp
                </p>
              </div>
              <Separator className="bg-border/50" />
            </>}
            
            {ad.ai_generated_image_url && <>
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">AI-genererad annonsbild</span>
                <p className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  AI-bild har genererats för annonsen
                </p>
              </div>
              <Separator className="bg-border/50" />
            </>}
            
            {property?.floor_plan_url && <>
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Planlösning</span>
                <p className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Planlösning har lagts till
                </p>
              </div>
              <Separator className="bg-border/50" />
            </>}
            
            {brokerData.additionalFeatures && <>
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Ytterligare funktioner</span>
                <p className="text-sm font-medium text-foreground">{brokerData.additionalFeatures}</p>
              </div>
              <Separator className="bg-border/50" />
            </>}
            
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Publicering</span>
              <p className="text-base font-semibold text-foreground">
                {brokerData.publicationDate ? brokerData.publicationDate : 'Publiceras direkt efter godkännande'}
              </p>
            </div>
          </div>
        </div>

        {/* Seller/Broker Contact Information */}
        {brokerData.propertyInfo && <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
            <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-foreground">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              Kontaktinformation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brokerData.propertyInfo.seller?.name && <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Säljare</span>
                  <p className="text-base font-semibold text-foreground">{brokerData.propertyInfo.seller.name}</p>
                </div>}
              {brokerData.propertyInfo.seller?.type && <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Typ</span>
                  <p className="text-base font-semibold text-foreground">
                    {brokerData.propertyInfo.seller.type === 'private' ? 'Privatperson' : 'Företag'}
                  </p>
                </div>}
            </div>
          </div>}

        {/* Billing Information */}
        <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            Faktureringsinformation
          </h3>
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Betalare</span>
              <p className="text-base font-semibold text-foreground">
                {brokerData.billingInfo?.payer === 'seller' ? 'Säljare' : brokerData.billingInfo?.payer === 'broker' ? 'Mäklare' : 'Ej angivet'}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Faktureringsadress</span>
                {!editingBillingAddress && <Button variant="ghost" size="sm" onClick={() => {
                setEditingBillingAddress(true);
                setEditedBillingAddress(brokerData.billingInfo?.billingAddress || '');
              }} className="h-8 text-xs font-medium">
                    <Edit2 className="h-3 w-3 mr-1" />
                    Ändra
                  </Button>}
              </div>
              {editingBillingAddress ? <div className="space-y-3">
                  <Input value={editedBillingAddress} onChange={e => setEditedBillingAddress(e.target.value)} placeholder="Ange faktureringsadress" className="text-sm" />
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={async () => {
                  try {
                    const updatedBrokerData = {
                      ...brokerData,
                      billingInfo: {
                        ...brokerData.billingInfo,
                        billingAddress: editedBillingAddress
                      }
                    };
                    const {
                      error
                    } = await supabase.from('ads').update({
                      broker_form_data: updatedBrokerData
                    }).eq('id', ad.id);
                    if (error) throw error;
                    setEditingBillingAddress(false);
                    toast({
                      title: 'Adress uppdaterad',
                      description: 'Faktureringsadressen har sparats.'
                    });
                  } catch (error) {
                    console.error('Error updating billing address:', error);
                    toast({
                      title: 'Ett fel uppstod',
                      description: 'Kunde inte spara adressen. Försök igen.',
                      variant: 'destructive'
                    });
                  }
                }} className="h-9 text-xs font-medium">
                      <Check className="h-3 w-3 mr-1" />
                      Spara
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                  setEditingBillingAddress(false);
                  setEditedBillingAddress('');
                }} className="h-9 text-xs font-medium">
                      <X className="h-3 w-3 mr-1" />
                      Avbryt
                    </Button>
                  </div>
                </div> : <p className="text-base font-semibold text-foreground">
                  {brokerData.billingInfo?.billingAddress || 'Adress ifylld av mäklaren'}
                </p>}
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border-2 border-primary/20">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            Välj paket
          </h3>
          
          <Accordion type="single" value={selectedPackage} onValueChange={(value) => setSelectedPackage(value)} collapsible className="space-y-4">
            {/* Exklusivpaket */}
            <AccordionItem 
              value="premium" 
              className={`border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all ${
                selectedPackage === 'premium' 
                  ? 'border-premium bg-premium/10 ring-2 ring-premium shadow-lg' 
                  : 'border-premium bg-premium/5'
              }`}
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline">
                <div className="text-left flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h4 className="text-xl font-bold text-foreground">Exklusivpaket</h4>
                    <span className="text-2xl font-bold text-premium">3995 kr</span>
                    {ad.ad_tier === 'premium' && <Badge className="bg-premium text-premium-foreground shadow-sm">
                        <Crown className="h-3 w-3 mr-1" />
                        Mäklarens rekommendation
                      </Badge>}
                    {selectedPackage === 'premium' && <Badge className="bg-green-600 text-white shadow-sm">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Valt paket
                      </Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Störst synlighet, unika AI-verktyg och kostnadsfri förnyelse varje månad
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <div className="grid md:grid-cols-2 gap-6 mb-5">
                  <div className="space-y-3">
                    <h5 className="font-bold mb-3 flex items-center gap-2 text-base text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      Maximerad synlighet
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-2 ml-7">
                      <li className="leading-relaxed">• Allt som ingår i Pluspaketet + största annonsen</li>
                      <li className="leading-relaxed">• Hamnar över Pluspaketet i publiceringslistan</li>
                      <li className="leading-relaxed">• Exklusiv-badge som sticker ut</li>
                      <li className="leading-relaxed">• Kostnadsfri förnyelse varje månad</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-bold mb-3 flex items-center gap-2 text-base text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      Exklusiva AI-verktyg
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-2 ml-7">
                      <li className="leading-relaxed">• AI-Bildredigering som levererar otroliga resultat</li>
                      <li className="leading-relaxed">• Unik AI-statistik i mäklarens och säljarens kundportal</li>
                      <li className="leading-relaxed">• Detaljerad intressestatistik för mäklare och säljare</li>
                      <li className="leading-relaxed">• Mest trafik till annonsen</li>
                    </ul>
                  </div>
                </div>
                
                
              </AccordionContent>
            </AccordionItem>

            {/* Pluspaket */}
            <AccordionItem 
              value="plus" 
              className={`border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all ${
                selectedPackage === 'plus' 
                  ? 'border-accent bg-accent/10 ring-2 ring-accent shadow-lg' 
                  : 'border-accent bg-accent/5'
              }`}
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline">
                <div className="text-left flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h4 className="text-xl font-bold text-foreground">Pluspaket</h4>
                    <span className="text-2xl font-bold text-accent">1995 kr</span>
                    {ad.ad_tier === 'plus' && <Badge className="bg-accent text-accent-foreground shadow-sm">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Mäklarens rekommendation
                      </Badge>}
                    {selectedPackage === 'plus' && <Badge className="bg-green-600 text-white shadow-sm">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Valt paket
                      </Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Större annons med kostnadsfri förnyelse varje månad
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <div className="space-y-3">
                  <h5 className="font-bold mb-3 flex items-center gap-2 text-base text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Ökad synlighet
                  </h5>
                  <ul className="text-sm text-muted-foreground space-y-2 ml-7">
                    <li className="leading-relaxed">• Allt som ingår i Grundpaketet + större annons</li>
                    <li className="leading-relaxed">• Hamnar över Grundpaketet i publiceringslistan</li>
                    <li className="leading-relaxed">• Plus-badge</li>
                    <li className="leading-relaxed">• Kostnadsfri förnyelse varje månad</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Grundpaket */}
            <AccordionItem 
              value="free" 
              className={`border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all ${
                selectedPackage === 'free' 
                  ? 'border-muted-foreground bg-muted/10 ring-2 ring-muted-foreground shadow-lg' 
                  : 'border-muted bg-muted/5'
              }`}
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline">
                <div className="text-left flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h4 className="text-xl font-bold text-foreground">Grundpaket</h4>
                    <span className="text-2xl font-bold text-accent">Gratis</span>
                    {ad.ad_tier === 'free' && <Badge variant="secondary" className="shadow-sm">
                        <Star className="h-3 w-3 mr-1" />
                        Mäklarens rekommendation
                      </Badge>}
                    {selectedPackage === 'free' && <Badge className="bg-green-600 text-white shadow-sm">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Valt paket
                      </Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Kostnadsfri grundannons för alla
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <div className="space-y-3">
                  <h5 className="font-bold mb-3 flex items-center gap-2 text-base text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Grundläggande publicering
                  </h5>
                  <ul className="text-sm text-muted-foreground space-y-2 ml-7">
                    <li className="leading-relaxed">• Standard annonsformat</li>
                    <li className="leading-relaxed">• Tillhörande statistik för mäklare och säljare</li>
                    <li className="leading-relaxed">• Bläddra genom alla bilder utan att gå in på annonsen</li>
                    <li className="leading-relaxed">• Fri publicering för alla säljare</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <Button variant="outline" className="w-full mt-6 h-11 font-medium" onClick={() => window.location.href = '/salj'}>
            Läs mer om våra annonspaket
          </Button>
        </div>


        {/* Payment Methods Info */}
        <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
          <h3 className="font-bold text-base mb-4 text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Tillgängliga betalningsmöjligheter vid publicering
          </h3>
          <ul className="text-sm space-y-2 text-foreground/80">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              Klarna checkout
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              Kort (Visa, Mastercard)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              Swish
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              Banköverföring
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center pt-6">
          <Button onClick={handleApprove} disabled={loading} size="lg" className="w-full max-w-md h-14 text-base font-bold shadow-lg hover:shadow-xl transition-all">
            <CheckCircle2 className="h-6 w-6 mr-2" />
            {loading ? 'Bearbetar...' : 'Godkänn och publicera'}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto">
          Genom att godkänna bekräftar du att informationen är korrekt och att annonsen kan publiceras.
        </p>
      </CardContent>
    </Card>;
};