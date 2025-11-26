import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Loader2, Upload, User } from 'lucide-react';
export const ProfileEditor = () => {
  const {
    user,
    userRoles
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    bio: '',
    avatar_url: '',
    company_name: ''
  });
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);
  const loadProfile = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('user_id', user?.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          company_name: data.company_name || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Kunde inte ladda profil');
    }
  };
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Math.random()}.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from('avatars').upload(fileName, file, {
        upsert: true
      });
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setProfile({
        ...profile,
        avatar_url: publicUrl
      });
      toast.success('Bild uppladdad!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Kunde inte ladda upp bild');
    } finally {
      setUploading(false);
    }
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const {
        error
      } = await supabase.from('profiles').upsert({
        id: user?.id,
        user_id: user?.id,
        email: user?.email || '',
        full_name: profile.full_name,
        phone: profile.phone,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        company_name: profile.company_name,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
      if (error) throw error;
      toast.success('Profil uppdaterad!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Kunde inte spara profil');
    } finally {
      setLoading(false);
    }
  };
  return <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
          <User className="h-5 w-5" />
          Min Profil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" disabled={uploading} asChild>
                  <span>
                    {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Ladda upp profilbild
                  </span>
                </Button>
              </div>
            </Label>
            <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            <p className="text-sm font-medium text-foreground mt-2">
              JPG, PNG eller GIF. Max 5MB.
            </p>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name">
            {userRoles.includes('company') ? 'Företagsnamn' : 'Fullständigt namn'}
          </Label>
          <Input id="full_name" value={profile.full_name} onChange={e => setProfile({
          ...profile,
          full_name: e.target.value
        })} placeholder={userRoles.includes('company') ? 'Företagets namn' : 'Ditt namn'} />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Telefonnummer</Label>
          <Input id="phone" type="tel" value={profile.phone} onChange={e => setProfile({
          ...profile,
          phone: e.target.value
        })} placeholder="+46 70 123 45 67" />
        </div>

        {/* Company Name */}
        

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">{userRoles.includes('company') ? 'Om företaget' : 'Om mig'}</Label>
          <Textarea id="bio" value={profile.bio} onChange={e => setProfile({
          ...profile,
          bio: e.target.value
        })} placeholder={userRoles.includes('company') ? 'Beskriv företaget och vad ni söker och erbjuder...' : 'Beskriv dig själv och vad du erbjuder...'} rows={6} className="resize-none" />
          <p className="text-sm font-medium text-foreground">Denna information kommer att synas på dina hyresobjekt och när andra går in på din profil</p>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sparar...
            </> : 'Spara profil'}
        </Button>
      </CardContent>
    </Card>;
};