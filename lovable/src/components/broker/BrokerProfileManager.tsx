import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Camera, Save, Loader2 } from 'lucide-react';
export function BrokerProfileManager() {
  const {
    user,
    profile
  } = useAuth();
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Fel filtyp',
          description: 'Vänligen välj en bildfil',
          variant: 'destructive'
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Filen är för stor',
          description: 'Maximal filstorlek är 5MB',
          variant: 'destructive'
        });
        return;
      }
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const {
        data: uploadData,
        error: uploadError
      } = await supabase.storage.from('broker-profiles').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('broker-profiles').getPublicUrl(fileName);
      setAvatarUrl(publicUrl);
      toast({
        title: 'Profilbild uppladdad',
        description: 'Din profilbild har laddats upp. Glöm inte att spara!'
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Uppladdning misslyckades',
        description: 'Kunde inte ladda upp profilbild',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const {
        error
      } = await supabase.from('profiles').update({
        bio,
        avatar_url: avatarUrl,
        full_name: fullName,
        phone,
        updated_at: new Date().toISOString()
      }).eq('user_id', user.id);
      if (error) throw error;
      toast({
        title: 'Profil uppdaterad',
        description: 'Dina profiluppgifter har sparats'
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Uppdatering misslyckades',
        description: 'Kunde inte spara profiluppgifter',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const getUserInitials = () => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'M';
  };
  return <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Min mäklarprofil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={fullName || 'Mäklare'} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary-deep transition-colors">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploading} />
            </label>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{fullName || user?.email}</h3>
            <p className="text-sm text-muted-foreground">Mäklare</p>
            <p className="text-xs text-muted-foreground mt-1">Fastighetsmäklare som publicerar annonser på Bostadsvyn kan ladda upp en profilbild som kommer att synas i annonserna tillsammans med namn och mäklarfirma. Profilbilden ska vara utan logotyp.</p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Fullständigt namn</Label>
            <Input id="full-name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ditt fullständiga namn" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefonnummer</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+46 70 123 45 67" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografi</Label>
            <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Berätta om dig själv, din erfarenhet och specialisering..." rows={6} className="resize-none" />
            <p className="text-xs text-muted-foreground">
              {bio.length} / 1000 tecken
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input id="email" value={user?.email || ''} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">
              E-postadressen kan inte ändras här
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveProfile} disabled={isLoading} className="gap-2">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sparar...
              </> : <>
                <Save className="h-4 w-4" />
                Spara profil
              </>}
          </Button>
        </div>
      </CardContent>
    </Card>;
}