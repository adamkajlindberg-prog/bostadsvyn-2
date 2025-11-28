import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Mail, Lock, User, Phone, Briefcase } from 'lucide-react';
import Logo from '@/components/Logo';
export default function BrokerAuthForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Office fields
  const [officeName, setOfficeName] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [officeCity, setOfficeCity] = useState('');
  const [officePostalCode, setOfficePostalCode] = useState('');
  const [officePhone, setOfficePhone] = useState('');
  const [officeEmail, setOfficeEmail] = useState('');
  
  // Broker fields
  const [licenseNumber, setLicenseNumber] = useState('');
  
  // Role fields
  const [isOfficeOwner, setIsOfficeOwner] = useState(false);
  const [isAssistant, setIsAssistant] = useState(false);
  const [isBroker, setIsBroker] = useState(false);
  
  const {
    signIn,
    signUpBroker
  } = useAuth();
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First create the user account
      const { error: signUpError } = await signUpBroker(email, password, fullName, phone, company);
      
      if (signUpError) {
        console.error('Sign up error:', signUpError);
        setLoading(false);
        return;
      }
      
      // Import supabase to create office and broker profile
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Create office
      const { data: officeData, error: officeError } = await supabase
        .from('broker_offices')
        .insert({
          office_name: officeName,
          office_address: officeAddress,
          office_city: officeCity,
          office_postal_code: officePostalCode,
          office_phone: officePhone,
          office_email: officeEmail,
        })
        .select()
        .single();
      
      if (officeError) {
        console.error('Office creation error:', officeError);
        setLoading(false);
        return;
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && officeData) {
        // Create broker profile with roles
        const { error: brokerError } = await supabase
          .from('brokers')
          .insert({
            user_id: user.id,
            office_id: officeData.id,
            broker_name: fullName,
            broker_phone: phone,
            broker_email: email,
            license_number: licenseNumber,
            is_office_owner: isOfficeOwner,
            is_assistant: isAssistant,
            is_broker: isBroker,
          });
        
        if (brokerError) {
          console.error('Broker profile creation error:', brokerError);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
    
    setLoading(false);
  };
  return <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Company Logo and Name Header */}
      

      <div className="w-full max-w-md">
        {/* Company Logo and Name Header */}
        <div 
          onClick={() => navigate('/')} 
          className="text-center mb-8 cursor-pointer group transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="bg-primary ring-2 ring-primary-light rounded-lg p-1 shadow-lg">
              <Logo className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Bostadsvyn.se
            </h1>
          </div>
          <p className="text-sm font-medium text-foreground">
            Sveriges smartaste fastighetsmäklarportal
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="text-center">
            <CardTitle className="text-xl md:text-2xl font-semibold">Välkommen!</CardTitle>
            <CardDescription className="font-medium text-foreground">
              Logga in på din mäklarportal eller registrera dig som ny mäklare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Logga in</TabsTrigger>
                <TabsTrigger value="signup">Ny mäklare</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">E-postadress</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signin-email" type="email" placeholder="maklare@byrå.se" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Lösenord</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signin-password" type="password" placeholder="Ditt lösenord" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary-deep" disabled={loading}>
                    {loading ? 'Loggar in...' : 'Logga in i portalen'}
                  </Button>
                </form>
                
                
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="text-sm font-bold text-primary mb-3">Kontorsinformation</div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="office-name">Kontorets namn</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="office-name" type="text" placeholder="Kontorets namn" value={officeName} onChange={e => setOfficeName(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="office-address">Adress</Label>
                      <Input id="office-address" type="text" placeholder="Gatuadress" value={officeAddress} onChange={e => setOfficeAddress(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="office-city">Stad</Label>
                      <Input id="office-city" type="text" placeholder="Stad" value={officeCity} onChange={e => setOfficeCity(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="office-postal">Postnummer</Label>
                      <Input id="office-postal" type="text" placeholder="123 45" value={officePostalCode} onChange={e => setOfficePostalCode(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="office-phone">Kontorets telefon</Label>
                      <Input id="office-phone" type="tel" placeholder="+46 8 123 456" value={officePhone} onChange={e => setOfficePhone(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="office-email">Kontorets e-post</Label>
                    <Input id="office-email" type="email" placeholder="info@kontor.se" value={officeEmail} onChange={e => setOfficeEmail(e.target.value)} />
                  </div>

                  <div className="text-sm font-bold text-primary mb-3 mt-4">Din information som mäklare</div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Fullständigt namn</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-name" type="text" placeholder="Ditt fullständiga namn" value={fullName} onChange={e => setFullName(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Telefonnummer</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-phone" type="tel" placeholder="+46 70 123 45 67" value={phone} onChange={e => setPhone(e.target.value)} className="pl-10" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license-number">Mäklarlicens</Label>
                      <Input id="license-number" type="text" placeholder="Licensnummer" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Din roll</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="role-owner" 
                          checked={isOfficeOwner}
                          onCheckedChange={(checked) => setIsOfficeOwner(checked as boolean)}
                        />
                        <Label htmlFor="role-owner" className="font-normal cursor-pointer">
                          Kontorsägare
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="role-assistant" 
                          checked={isAssistant}
                          onCheckedChange={(checked) => setIsAssistant(checked as boolean)}
                        />
                        <Label htmlFor="role-assistant" className="font-normal cursor-pointer">
                          Assistent
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="role-broker" 
                          checked={isBroker}
                          onCheckedChange={(checked) => setIsBroker(checked as boolean)}
                        />
                        <Label htmlFor="role-broker" className="font-normal cursor-pointer">
                          Mäklare
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-postadress</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-email" type="email" placeholder="din.epost@maklare.se" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Lösenord</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-password" type="password" placeholder="Välj ett säkert lösenord" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" required minLength={6} />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                    {loading ? 'Registrerar...' : 'Registrera mäklarkonto'}
                  </Button>
                </form>
                
                <div className="mt-4 text-center text-xs font-medium text-foreground">
                  Genom att registrera dig accepterar du våra villkor för mäklare och bekräftar att du har rätt att representera din mäklarbyrå.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>;
}