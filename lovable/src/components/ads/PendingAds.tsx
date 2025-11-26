import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, AlertCircle, CheckCircle, Edit, Send, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
interface PendingAd {
  id: string;
  title: string;
  property_id: string;
  created_at: string;
  moderation_status: string;
  moderation_notes: string | null;
  seller_name?: string;
  seller_email?: string;
  seller_phone?: string;
  address?: string;
  ad_id?: string;
}
const PendingAds = () => {
  const {
    user
  } = useAuth();
  const [pendingAds, setPendingAds] = useState<PendingAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<PendingAd | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [adDetails, setAdDetails] = useState({
    headline: '',
    videoUrl: '',
    videoAsFirstImage: false,
    threedTourUrl: ''
  });
  const [recommendedPackages, setRecommendedPackages] = useState({
    free: false,
    plus: false,
    premium: true
  });
  const [brokerRecommendation, setBrokerRecommendation] = useState('');
  const handlePackageSelect = (packageName: 'free' | 'plus' | 'premium') => {
    setRecommendedPackages({
      free: packageName === 'free',
      plus: packageName === 'plus',
      premium: packageName === 'premium'
    });
  };
  const [sellerInfo, setSellerInfo] = useState({
    type: 'private',
    name: '',
    email: '',
    phone: '',
    personalNumber: '',
    orgNumber: '',
    contactPerson: '',
    notes: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    payer: 'seller'
  });
  const [publishInfo, setPublishInfo] = useState({
    timing: 'on_completion',
    specificDate: '',
    specificTime: '12:00'
  });
  const [propertyAddress, setPropertyAddress] = useState('');
  useEffect(() => {
    if (user) {
      fetchPendingAds();
    }
  }, [user]);
  const fetchPendingAds = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('ads').select('*').eq('user_id', user?.id).in('moderation_status', ['pending', 'draft']).order('created_at', {
        ascending: false
      });
      if (error) throw error;

      // Add example ad for demonstration
      const exampleAd: PendingAd = {
        id: 'example-ad-1',
        title: 'Storgatan 12, 118 46 Stockholm',
        property_id: 'example-property-1',
        created_at: new Date().toISOString(),
        moderation_status: 'pending',
        moderation_notes: 'Importerad från Vitec via affärssystem',
        address: 'Storgatan 12, 118 46 Stockholm',
        ad_id: 'ANS-2025-001'
      };
      setPendingAds([exampleAd, ...(data || [])]);
    } catch (error) {
      console.error('Error fetching pending ads:', error);
      toast.error('Kunde inte hämta väntande annonser');
    } finally {
      setLoading(false);
    }
  };
  const handleCompleteAd = async () => {
    if (!selectedAd) return;
    if (!propertyAddress.trim()) {
      toast.error('Vänligen fyll i fastighetens adress');
      return;
    }
    if (!sellerInfo.name || !sellerInfo.email || !sellerInfo.phone) {
      toast.error('Vänligen fyll i all säljinformation');
      return;
    }
    if (publishInfo.timing === 'specific_date' && (!publishInfo.specificDate || !publishInfo.specificTime)) {
      toast.error('Vänligen välj både datum och tid för publicering');
      return;
    }
    try {
      // Billing address automatically comes from seller info or broker profile
      const billingAddress = paymentInfo.payer === 'seller' ? {
        address: propertyAddress,
        name: sellerInfo.name,
        personalNumber: sellerInfo.personalNumber,
        orgNumber: sellerInfo.orgNumber
      } : {
        // Office billing info would come from broker's profile/office
        name: user?.email || 'Mäklarkontor',
        address: 'Hämtas från kontouppgifter'
      };
      // Prepare broker form data for seller review
      const brokerFormData = {
        recommendedPackages,
        propertyInfo: {
          address: propertyAddress,
          seller: sellerInfo
        },
        paymentInfo: {
          payer: paymentInfo.payer,
          billingAddress: billingAddress
        },
        publishInfo,
        brokerRecommendation
      };

      const moderationNotes = {
        address: propertyAddress,
        seller: sellerInfo,
        payment: paymentInfo,
        billingAddress: billingAddress,
        publish: publishInfo,
        brokerRecommendation: brokerRecommendation
      };

      // Update ad with complete information for seller approval
      const {
        error: updateError
      } = await supabase.from('ads').update({
        moderation_status: 'pending_seller_approval',
        broker_form_data: brokerFormData,
        moderation_notes: JSON.stringify(moderationNotes)
      }).eq('id', selectedAd.id).eq('user_id', user?.id);
      if (updateError) throw updateError;

      // Here you would typically send an email to the seller
      // Using a Supabase edge function with Resend

      toast.success('Annonsen har skickats till säljaren för godkännande!');
      resetForm();
      fetchPendingAds();
    } catch (error) {
      console.error('Error completing ad:', error);
      toast.error('Kunde inte färdigställa annonsen');
    }
  };
  const resetForm = () => {
    setSelectedAd(null);
    setFormStep(1);
    setPropertyAddress('');
    setAdDetails({
      headline: '',
      videoUrl: '',
      videoAsFirstImage: false,
      threedTourUrl: ''
    });
    setRecommendedPackages({
      free: false,
      plus: false,
      premium: true
    });
    setBrokerRecommendation('');
    setSellerInfo({
      type: 'private',
      name: '',
      email: '',
      phone: '',
      personalNumber: '',
      orgNumber: '',
      contactPerson: '',
      notes: ''
    });
    setPaymentInfo({
      payer: 'seller'
    });
    setPublishInfo({
      timing: 'on_completion',
      specificDate: '',
      specificTime: '12:00'
    });
  };
  if (loading) {
    return <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Laddar väntande annonser...</div>
      </div>;
  }
  return <div className="space-y-6">
      {/* Info Banner */}
      <Card className="border-warning bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h3 className="font-medium text-warning">Väntande annonser kräver åtgärd</h3>
              <p className="text-sm text-muted-foreground mt-1">Dessa annonser har lagts till via mäklarsystemet och behöver information innan de kan publiceras. Du kommer att få ett mejl när en ny annons behöver färdigställas.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Ads List */}
      {pendingAds.length === 0 ? <Card>
          <CardContent className="text-center p-8">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Inga väntande annonser</h3>
            <p className="text-muted-foreground">
              Alla dina annonser är färdigställda och publicerade.
            </p>
          </CardContent>
        </Card> : <div className="grid gap-4">
          {pendingAds.map(ad => <Card key={ad.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{ad.title}</h3>
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Väntande
                      </Badge>
                    </div>
                    {ad.ad_id && <p className="text-xs font-mono text-muted-foreground mb-2">
                      AnnonsID: {ad.ad_id}
                    </p>}
                    <p className="text-sm text-muted-foreground mb-3">
                      Skapad: {new Date(ad.created_at).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                    </p>
                  </div>
                  <Button onClick={() => {
              setSelectedAd(ad);
              if (ad.address) {
                setPropertyAddress(ad.address);
              }
            }} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Fyll i uppgifter för utskick
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>}

      {/* Multi-step Form */}
      {selectedAd && <Card>
          <CardHeader>
            <CardTitle>Färdigställ annons - {selectedAd.title}</CardTitle>
            {selectedAd.ad_id && <div className="text-xs font-mono text-muted-foreground mt-1">
              AnnonsID: {selectedAd.ad_id}
            </div>}
            <CardDescription>
              Steg {formStep} av 5: {formStep === 1 ? 'Säljinformation' : formStep === 2 ? 'Rekommenderade paket' : formStep === 3 ? 'Marknadsföring' : formStep === 4 ? 'Betalning & Publicering' : 'Granska & Skicka'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Seller Information */}
            {formStep === 1 && <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyAddress">Fastighetens adress *</Label>
                  <Input id="propertyAddress" placeholder="Gatuadress, postnummer, ort" value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} className={selectedAd?.address ? 'bg-muted' : ''} />
                  <p className="text-xs text-muted-foreground">
                    {selectedAd?.address ? 'Adressen hämtades automatiskt från mäklarsystemet' : 'Denna adress kommer att visas på annonsen'}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Typ av säljare *</Label>
                  <RadioGroup value={sellerInfo.type} onValueChange={value => setSellerInfo({
              ...sellerInfo,
              type: value
            })}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private" className="font-normal cursor-pointer">
                        Privatperson
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="estate" id="estate" />
                      <Label htmlFor="estate" className="font-normal cursor-pointer">
                        Dödsbo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="guardian" id="guardian" />
                      <Label htmlFor="guardian" className="font-normal cursor-pointer">
                        God man
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="font-normal cursor-pointer">
                        Företag
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sellerInfo.type === 'company' ? <>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Företagsnamn *</Label>
                        <Input id="companyName" placeholder="AB Företaget" value={sellerInfo.name} onChange={e => setSellerInfo({
                  ...sellerInfo,
                  name: e.target.value
                })} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="orgNumber">Organisationsnummer *</Label>
                        <Input id="orgNumber" placeholder="556677-8899" value={sellerInfo.orgNumber} onChange={e => setSellerInfo({
                  ...sellerInfo,
                  orgNumber: e.target.value
                })} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Kontaktperson *</Label>
                        <Input id="contactPerson" placeholder="För- och efternamn" value={sellerInfo.contactPerson} onChange={e => setSellerInfo({
                  ...sellerInfo,
                  contactPerson: e.target.value
                })} />
                      </div>
                    </> : <>
                      <div className="space-y-2">
                        <Label htmlFor="sellerName">
                          {sellerInfo.type === 'estate' ? 'Organisationsnummer *' : sellerInfo.type === 'guardian' ? 'God mans namn *' : 'Säljarens namn *'}
                        </Label>
                        <Input id="sellerName" placeholder="För- och efternamn" value={sellerInfo.name} onChange={e => setSellerInfo({
                  ...sellerInfo,
                  name: e.target.value
                })} />
                      </div>

                      {sellerInfo.type === 'private' && <div className="space-y-2">
                        <Label htmlFor="personalNumber">Personnummer *</Label>
                        <Input id="personalNumber" placeholder="ÅÅÅÅMMDD-XXXX" value={sellerInfo.personalNumber} onChange={e => setSellerInfo({
                  ...sellerInfo,
                  personalNumber: e.target.value
                })} />
                      </div>}
                    </>}

                  <div className="space-y-2">
                    <Label htmlFor="sellerEmail">E-postadress *</Label>
                    <Input id="sellerEmail" type="email" placeholder="exempel@email.com" value={sellerInfo.email} onChange={e => setSellerInfo({
                ...sellerInfo,
                email: e.target.value
              })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellerPhone">Telefonnummer *</Label>
                    <Input id="sellerPhone" type="tel" placeholder="070-123 45 67" value={sellerInfo.phone} onChange={e => setSellerInfo({
                ...sellerInfo,
                phone: e.target.value
              })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Ytterligare information (valfritt)</Label>
                  <Textarea id="notes" placeholder="Särskilda önskemål eller information från säljaren..." rows={3} value={sellerInfo.notes} onChange={e => setSellerInfo({
              ...sellerInfo,
              notes: e.target.value
            })} />
                </div>
              </div>}

            {/* Step 2: Recommended Packages */}
            {formStep === 2 && <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Rekommenderade annonspaket</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Välj vilka paket du vill rekommendera till säljaren. Säljaren kan sedan välja sitt önskade paket.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Grundpaket - Gratis */}
                    <div className="border rounded-lg p-4 space-y-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => handlePackageSelect('free')}>
                      <div className="flex items-start space-x-3">
                        <Checkbox id="package-free" checked={recommendedPackages.free} onCheckedChange={() => handlePackageSelect('free')} />
                        <div className="flex-1">
                          <Label htmlFor="package-free" className="font-medium cursor-pointer text-lg">
                            Grundpaket - Gratis
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1 mb-3">
                            Kostnadsfri grundannons för alla
                          </p>
                          <div className="grid md:grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="font-semibold mb-1">Grundläggande publicering:</p>
                              <ul className="text-muted-foreground space-y-0.5 ml-3">
                                <li>• Standard annonsformat</li>
                                <li>• Tillhörande statistik för mäklare och säljare</li>
                                <li>• Bläddra genom alla bilder utan att gå in på annonsen</li>
                                <li>• Fri publicering för alla säljare</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pluspaket - 1995 kr */}
                    <div className="border rounded-lg p-4 space-y-3 border-accent/50 bg-accent/5 cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => handlePackageSelect('plus')}>
                      <div className="flex items-start space-x-3">
                        <Checkbox id="package-plus" checked={recommendedPackages.plus} onCheckedChange={() => handlePackageSelect('plus')} />
                        <div className="flex-1">
                          <Label htmlFor="package-plus" className="font-medium cursor-pointer text-lg">
                            Pluspaket
                          </Label>
                          <p className="text-sm font-semibold text-accent mt-1">1 995 kr</p>
                          <p className="text-sm text-muted-foreground mb-3">
                            Större annons med kostnadsfri förnyelse var 4:e vecka
                          </p>
                          <div className="grid md:grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="font-semibold mb-1">Ökad synlighet:</p>
                              <ul className="text-muted-foreground space-y-0.5 ml-3">
                                <li>• Allt som ingår i Grundpaketet + större annons</li>
                                <li>• Hamnar över Grundpaketet i publiceringslistan</li>
                                <li>• Plus-badge</li>
                                <li>• Kostnadsfri förnyelse varje månad</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exklusivpaket - 3995 kr */}
                    <div className="border rounded-lg p-4 space-y-3 border-premium/50 bg-premium/5 cursor-pointer hover:bg-premium/10 transition-colors" onClick={() => handlePackageSelect('premium')}>
                      <div className="flex items-start space-x-3">
                        <Checkbox id="package-premium" checked={recommendedPackages.premium} onCheckedChange={() => handlePackageSelect('premium')} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="package-premium" className="font-medium cursor-pointer text-lg">
                              Exklusivpaket
                            </Label>
                            <Badge variant="secondary">Rekommenderat</Badge>
                          </div>
                          <p className="text-sm font-semibold text-premium mt-1">3 995 kr</p>
                          <p className="text-sm text-muted-foreground mb-3">
                            Störst synlighet, unika AI-verktyg och kostnadsfri förnyelse varje månad
                          </p>
                          <div className="grid md:grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="font-semibold mb-1">Maximerad synlighet:</p>
                              <ul className="text-muted-foreground space-y-0.5 ml-3">
                                <li>• Allt som ingår i Pluspaketet + största annonsen</li>
                                <li>• Hamnar över Pluspaketet i publiceringslistan</li>
                                <li>• Premium-badge som sticker ut</li>
                                <li>• Kostnadsfri förnyelse varje månad</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold mb-1">Exklusiva AI-verktyg:</p>
                              <ul className="text-muted-foreground space-y-0.5 ml-3">
                                <li>• AI-Bildredigering som levererar otroliga resultat</li>
                                <li>• Unik AI-statistik i mäklarens och säljarens kundportal</li>
                                <li>• Detaljerad intressestatistik för mäklare och säljare</li>
                                <li>• Mest trafik till annonsen</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-6 border-t">
                  <Label htmlFor="brokerRecommendation">Din rekommendation till säljaren (valfritt)</Label>
                  <Textarea id="brokerRecommendation" placeholder="Förklara varför du rekommenderar ett visst paket baserat på objektet och målgruppen..." rows={4} value={brokerRecommendation} onChange={e => setBrokerRecommendation(e.target.value)} />
                  <p className="text-xs text-muted-foreground">
                    Denna text kommer att visas för säljaren tillsammans med paketalternativen
                  </p>
                </div>
              </div>}

            {/* Step 3: Marketing */}
            {formStep === 3 && <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="headline">Annonsrubrik (valfritt)</Label>
                  <Input id="headline" placeholder="T.ex. 'Drömvilla vid havet'" value={adDetails.headline} onChange={e => {
              const value = e.target.value;
              if (value.length <= 20) {
                setAdDetails({
                  ...adDetails,
                  headline: value
                });
              }
            }} maxLength={20} />
                  <p className="text-xs text-muted-foreground">
                    {adDetails.headline.length}/20 tecken - Kommer att visas på annonskortet
                  </p>
                  <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg mt-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong>Tips för en bra annonsrubrik:</strong> En kort och kärnfull rubrik fångar uppmärksamhet bäst. 
                      Fokusera på det viktigaste - läge, stil eller kännetecken. 
                      Exempel: "Havsnära villa" eller "Ljus 3:a i city"
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Filmlänk (valfritt)</Label>
                  <Input id="videoUrl" placeholder="https://www.youtube.com/watch?v=..." value={adDetails.videoUrl} onChange={e => setAdDetails({
              ...adDetails,
              videoUrl: e.target.value
            })} />
                  <p className="text-xs text-muted-foreground">
                    Länk till film på YouTube, Vimeo eller liknande. Film ökar intresset och ger köpare en bättre känsla för objektet.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2 p-2 bg-accent/10 rounded-md border border-accent/20">
                    <strong>Tips:</strong> Unikt med Bostadsvyn är att du kan ha en film som förstabild för att fånga mer intresse.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threedTourUrl">3D-visningslänk (valfritt)</Label>
                  <Input 
                    id="threedTourUrl" 
                    placeholder="https://my.matterport.com/show/?m=..." 
                    value={adDetails.threedTourUrl} 
                    onChange={e => setAdDetails({
                      ...adDetails,
                      threedTourUrl: e.target.value
                    })} 
                  />
                  <p className="text-xs text-muted-foreground">
                    Länk till 3D-visning från Matterport eller liknande tjänst. Ger köpare möjlighet att virtuellt gå igenom objektet.
                  </p>
                </div>

                {adDetails.videoUrl && <div className="flex items-start space-x-2 bg-accent/5 border border-accent/20 p-3 rounded-lg">
                    <Checkbox id="videoAsFirstImage" checked={adDetails.videoAsFirstImage} onCheckedChange={checked => setAdDetails({
              ...adDetails,
              videoAsFirstImage: checked as boolean
            })} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="videoAsFirstImage" className="font-normal cursor-pointer text-sm">
                        Visa film som förstabild i annonsflödet och på annonsen
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Filmen startar automatiskt utan ljud när någon hovrar över annonsen. Detta ger maximal uppmärksamhet och synlighet.
                      </p>
                    </div>
                  </div>}
              </div>}

            {/* Step 4: Payment & Publishing */}
            {formStep === 4 && <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Vem betalar annonsen? *</Label>
                  <RadioGroup value={paymentInfo.payer} onValueChange={value => setPaymentInfo({
              ...paymentInfo,
              payer: value
            })}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seller" id="seller" />
                      <Label htmlFor="seller" className="font-normal cursor-pointer">
                        Säljaren betalar
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="broker" id="broker" />
                      <Label htmlFor="broker" className="font-normal cursor-pointer">
                        Mäklaren betalar
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Billing Address Section - Auto-filled */}
                <div className="border-t pt-6 space-y-3">
                  <div>
                    <Label className="text-base">Faktureringsadress</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {paymentInfo.payer === 'seller' ? 'Säljarens faktureringsadress hämtas automatiskt från mäklarsystemet' : 'Mäklarkontorets faktureringsadress hämtas automatiskt från dina kontouppgifter'}
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                    {paymentInfo.payer === 'seller' ? <>
                        <div>
                          <span className="font-medium">Namn:</span> {sellerInfo.name || 'Ej angivet'}
                        </div>
                        {sellerInfo.type === 'company' && sellerInfo.orgNumber && <div>
                            <span className="font-medium">Org.nummer:</span> {sellerInfo.orgNumber}
                          </div>}
                        {sellerInfo.type === 'private' && sellerInfo.personalNumber && <div>
                            <span className="font-medium">Personnummer:</span> {sellerInfo.personalNumber}
                          </div>}
                        <div>
                          <span className="font-medium">Adress:</span> {propertyAddress || 'Ej angivet'}
                        </div>
                      </> : <>
                        <div>
                          <span className="font-medium">Kontor:</span> {user?.email || 'Ditt mäklarkontor'}
                        </div>
                        <div className="text-muted-foreground italic">
                          Faktureringsadress hämtas från dina kontouppgifter
                        </div>
                      </>}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Rekommenderat annonspaket *</Label>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm space-y-1">
                      <p className="font-medium">
                        {recommendedPackages.free && 'Grundpaket - Gratis'}
                        {recommendedPackages.plus && 'Pluspaket - 1 995 kr'}
                        {recommendedPackages.premium && 'Exklusivpaket - 3 995 kr'}
                      </p>
                      <p className="text-muted-foreground">
                        {recommendedPackages.free && 'Grundpaket: Kostnadsfri grundannons för alla'}
                        {recommendedPackages.plus && 'Pluspaket: Större annons med kostnadsfri förnyelse var 4:e vecka'}
                        {recommendedPackages.premium && 'Exklusivpaket: Störst synlighet, unika AI-verktyg och kostnadsfri förnyelse varje månad'}
                      </p>
                      
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-3">
                  <Label>När ska annonsen publiceras? *</Label>
                  <RadioGroup value={publishInfo.timing} onValueChange={value => setPublishInfo({
              ...publishInfo,
              timing: value
            })}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="on_completion" id="on_completion" />
                      <Label htmlFor="on_completion" className="font-normal cursor-pointer">
                        När köpet slutförs av mäklaren eller säljaren
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="on_approval" id="on_approval" />
                      <Label htmlFor="on_approval" className="font-normal cursor-pointer">
                        Direkt efter säljarens godkännande
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific_date" id="specific_date" />
                      <Label htmlFor="specific_date" className="font-normal cursor-pointer">
                        Specifikt datum
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {publishInfo.timing === 'specific_date' && <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="specificDate">Välj datum *</Label>
                      <div className="relative">
                        <Input id="specificDate" type="date" value={publishInfo.specificDate} onChange={e => setPublishInfo({
                  ...publishInfo,
                  specificDate: e.target.value
                })} min={new Date().toISOString().split('T')[0]} />
                        <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="specificTime">Välj tid *</Label>
                      <Input id="specificTime" type="time" value={publishInfo.specificTime} onChange={e => setPublishInfo({
                ...publishInfo,
                specificTime: e.target.value
              })} />
                      <p className="text-xs text-muted-foreground">
                        Annonsen publiceras automatiskt vid vald tidpunkt
                      </p>
                    </div>
                  </div>}
                
                {/* Seller Payment Information */}
                <div className="border-t pt-6 space-y-3">
                  <Label className="text-base">Säljarens betalningsalternativ</Label>
                  <p className="text-sm text-muted-foreground">
                    Säljaren kommer att kunna välja mellan följande betalningsalternativ när de godkänner annonsen:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-medium">•</span>
                      <div>
                        <span className="font-medium">Klarna Checkout</span>
                        <p className="text-muted-foreground text-xs mt-0.5">Säljaren kan välja att få faktura utskickad efter 3 månader</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium">•</span>
                      <span className="font-medium">Kort (Visa, Mastercard)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium">•</span>
                      <span className="font-medium">Swish</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium">•</span>
                      <span className="font-medium">Banköverföring</span>
                    </div>
                  </div>
                </div>
              </div>}

            {/* Step 5: Review */}
            {formStep === 5 && <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Fastighetsadress</h4>
                    <p className="text-sm">{propertyAddress}</p>
                  </div>

                  {(adDetails.headline || adDetails.videoUrl) && <div>
                      <h4 className="font-medium mb-2">Annonsdetaljer</h4>
                      <div className="text-sm space-y-1">
                        {adDetails.headline && <p><span className="font-medium">Rubrik:</span> {adDetails.headline}</p>}
                        {adDetails.videoUrl && <>
                            <p><span className="font-medium">Film:</span> {adDetails.videoUrl}</p>
                            {adDetails.videoAsFirstImage && <p className="text-muted-foreground">✓ Filmen visas som förstabild</p>}
                          </>}
                      </div>
                    </div>}

                  <div>
                    <h4 className="font-medium mb-2">Säljinformation</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Typ:</span> {sellerInfo.type === 'private' ? 'Privatperson' : sellerInfo.type === 'estate' ? 'Dödsbo' : sellerInfo.type === 'guardian' ? 'God man' : 'Företag'}</p>
                      {sellerInfo.type === 'company' && <>
                          <p><span className="font-medium">Företag:</span> {sellerInfo.name}</p>
                          <p><span className="font-medium">Org.nummer:</span> {sellerInfo.orgNumber}</p>
                          <p><span className="font-medium">Kontaktperson:</span> {sellerInfo.contactPerson}</p>
                        </>}
                      {sellerInfo.type !== 'company' && <p><span className="font-medium">Namn:</span> {sellerInfo.name}</p>}
                      {sellerInfo.type === 'private' && sellerInfo.personalNumber && <p><span className="font-medium">Personnummer:</span> {sellerInfo.personalNumber}</p>}
                      <p><span className="font-medium">E-post:</span> {sellerInfo.email}</p>
                      <p><span className="font-medium">Telefon:</span> {sellerInfo.phone}</p>
                      {sellerInfo.notes && <p><span className="font-medium">Anteckningar:</span> {sellerInfo.notes}</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Betalning & Paket</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Betalare:</span> {paymentInfo.payer === 'seller' ? 'Säljaren' : 'Mäklaren'}</p>
                      <p><span className="font-medium">Paket:</span> {recommendedPackages.free ? 'Grundpaket (Gratis)' : recommendedPackages.plus ? 'Pluspaket (1 995 kr)' : 'Exklusivpaket (3 995 kr)'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Faktureringsadress</h4>
                    <div className="text-sm space-y-1">
                      {paymentInfo.payer === 'seller' ? <>
                          <p><span className="font-medium">Namn:</span> {sellerInfo.name}</p>
                          {sellerInfo.type === 'company' && sellerInfo.orgNumber && <p><span className="font-medium">Org.nummer:</span> {sellerInfo.orgNumber}</p>}
                          {sellerInfo.type === 'private' && sellerInfo.personalNumber && <p><span className="font-medium">Personnummer:</span> {sellerInfo.personalNumber}</p>}
                          <p><span className="font-medium">Adress:</span> {propertyAddress}</p>
                        </> : <>
                          <p><span className="font-medium">Kontor:</span> {user?.email}</p>
                          <p className="text-muted-foreground italic">Faktureringsadress från kontouppgifter</p>
                        </>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Publicering</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Tidpunkt:</span> {publishInfo.timing === 'on_completion' ? 'När köpet slutförs' : publishInfo.timing === 'on_approval' ? 'Direkt efter godkännande' : `${new Date(publishInfo.specificDate).toLocaleDateString('sv-SE')} kl. ${publishInfo.specificTime}`}</p>
                    </div>
                  </div>

                </div>

                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Vad händer härnäst?</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Säljaren får ett mejl med information angående publicering och paket</li>
                    <li>Säljaren kan betala och granska alla uppgifter</li>
                    <li>Annonsen publiceras enligt vald tidpunkt</li>
                    <li>Du får en bekräftelse när annonsen är live</li>
                  </ol>
                </div>
              </div>}

            {/* Navigation Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              {formStep > 1 && <Button variant="outline" onClick={() => setFormStep(formStep - 1)}>
                  Föregående
                </Button>}
              
              {formStep < 5 ? <Button onClick={() => setFormStep(formStep + 1)}>
                  Nästa
                </Button> : <Button onClick={handleCompleteAd} className="gap-2">
                  <Send className="h-4 w-4" />
                  Skicka till säljare
                </Button>}
              
              <Button variant="outline" onClick={resetForm}>
                Avbryt
              </Button>
            </div>
          </CardContent>
        </Card>}
    </div>;
};
export default PendingAds;