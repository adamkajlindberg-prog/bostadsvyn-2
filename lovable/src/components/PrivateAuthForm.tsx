import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User, Heart, Building2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export default function PrivateAuthForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [accountType, setAccountType] = useState<'buyer' | 'company'>('buyer');
  const [companyName, setCompanyName] = useState('');
  const [orgNumber, setOrgNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    signIn,
    signUp
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
      const extraMeta = accountType === 'company'
        ? { account_type: 'company', company_name: companyName, org_number: orgNumber }
        : { account_type: 'buyer' };
      const { error: signUpError } = await signUp(email, password, fullName, extraMeta);
      if (signUpError) {
        toast.error('Registrering misslyckades: ' + signUpError.message);
        setLoading(false);
        return;
      }

      // Get the newly created user
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      
      if (user) {
        if (accountType === 'company') {
          // Add company role
          const {
            error: roleError
          } = await supabase.from('user_roles').insert({
            user_id: user.id,
            role: 'company'
          });
          if (roleError) {
            console.error('Error adding company role:', roleError);
          }

          // Update profile with company info
          const {
            error: profileError
          } = await supabase.from('profiles').update({
            company_name: companyName,
            org_number: orgNumber
          }).eq('user_id', user.id);
          if (profileError) {
            console.error('Error updating company profile:', profileError);
          }
        } else {
          // Add buyer role for private individuals
          const {
            error: roleError
          } = await supabase.from('user_roles').insert({
            user_id: user.id,
            role: 'buyer'
          });
          if (roleError) {
            console.error('Error adding buyer role:', roleError);
          }
        }
      }
      toast.success('Konto skapat! Du loggas in...');
      
      // Navigate to home page after successful signup
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Ett fel uppstod vid registrering');
    }
    setLoading(false);
  };
  return <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div onClick={() => navigate('/')} className="flex items-center justify-center space-x-3 mb-4 cursor-pointer group transition-all duration-300 hover:scale-105">
            <div className="bg-primary ring-2 ring-primary-light rounded-lg p-1 shadow-lg">
              <Logo className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Bostadsvyn.se
            </h1>
          </div>
          
          
        </div>

        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-xl md:text-2xl font-semibold">Välkommen!</CardTitle>
            <CardDescription className="font-medium text-foreground">
              Logga in eller skapa ett konto för att komma igång
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Logga in</TabsTrigger>
                <TabsTrigger value="signup">Skapa konto</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">E-postadress</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signin-email" type="email" placeholder="din@email.se" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
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
                    {loading ? 'Loggar in...' : 'Logga in'}
                  </Button>
                </form>
                
                <div className="mt-6 pt-6 border-t text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm font-medium text-foreground">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Hitta ditt drömhem bland tusentals annonser</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Kontotyp</Label>
                    <div className="inline-flex h-12 items-center justify-center rounded-lg bg-white shadow-sm p-1.5 gap-2 w-full">
                      <button type="button" onClick={() => setAccountType('buyer')} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold ring-offset-background transition-all border-2 flex-1", accountType === 'buyer' ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-transparent text-foreground border-border hover:border-primary/50")}>
                        <User className="w-4 h-4 mr-2" />
                        Privatperson
                      </button>
                      <button type="button" onClick={() => setAccountType('company')} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold ring-offset-background transition-all border-2 flex-1", accountType === 'company' ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-transparent text-foreground border-border hover:border-primary/50")}>
                        <Building2 className="w-4 h-4 mr-2" />
                        Företag
                      </button>
                    </div>
                  </div>

                  {accountType === 'company' && <>
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Företagsnamn</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="company-name" type="text" placeholder="Företagets namn" value={companyName} onChange={e => setCompanyName(e.target.value)} className="pl-10" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="org-number">Organisationsnummer</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="org-number" type="text" placeholder="XXXXXX-XXXX" value={orgNumber} onChange={e => setOrgNumber(e.target.value)} className="pl-10" required />
                        </div>
                      </div>
                    </>}

                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{accountType === 'company' ? 'Kontaktperson' : 'Fullständigt namn'}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-name" type="text" placeholder={accountType === 'company' ? 'Namn på kontaktperson' : 'Ditt fullständiga namn'} value={fullName} onChange={e => setFullName(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-postadress</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-email" type="email" placeholder="din@email.se" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Lösenord</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-password" type="password" placeholder="Välj ett säkert lösenord" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" required minLength={6} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-success hover:bg-success-light" disabled={loading}>
                    {loading ? 'Skapar konto...' : 'Skapa konto'}
                  </Button>
                </form>
                
                
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>;
}