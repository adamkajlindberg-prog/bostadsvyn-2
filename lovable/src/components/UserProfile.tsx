import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Bell,
  Globe,
  Palette,
  Save,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const profileSchema = z.object({
  full_name: z.string().min(2, "Namn måste vara minst 2 tecken"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().optional(),
});

const preferencesSchema = z.object({
  email_notifications: z.boolean(),
  sms_notifications: z.boolean(),
  marketing_emails: z.boolean(),
  preferred_currency: z.string(),
  preferred_language: z.string(),
  theme: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PreferencesFormData = z.infer<typeof preferencesSchema>;

interface UserPreferences {
  id?: string;
  user_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  preferred_currency: string;
  preferred_language: string;
  theme: string;
}

export const UserProfile: React.FC = () => {
  const { user, profile, userRoles, refetchProfile, deleteAccount } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      email: user?.email || "",
      phone: profile?.phone || "",
    },
  });

  const preferencesForm = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      email_notifications: true,
      sms_notifications: false,
      marketing_emails: false,
      preferred_currency: "SEK",
      preferred_language: "sv",
      theme: "system",
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        full_name: profile.full_name || "",
        email: user?.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, user, profileForm]);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user, loadUserPreferences]);

  const loadUserPreferences = async () => {
    try {
      setPreferencesLoading(true);
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setPreferences(data);
        preferencesForm.reset({
          email_notifications: data.email_notifications,
          sms_notifications: data.sms_notifications,
          marketing_emails: data.marketing_emails,
          preferred_currency: data.preferred_currency,
          preferred_language: data.preferred_language,
          theme: data.theme,
        });
      }
    } catch (error: any) {
      console.error("Error loading user preferences:", error);
    } finally {
      setPreferencesLoading(false);
    }
  };

  const onSubmitProfile = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          phone: data.phone,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      await refetchProfile();

      toast({
        title: "Profil uppdaterad",
        description: "Dina profiluppgifter har sparats",
      });
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Kunde inte uppdatera profilen",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPreferences = async (data: PreferencesFormData) => {
    if (!user) return;

    try {
      setLoading(true);

      const preferenceData = {
        user_id: user.id,
        ...data,
      };

      if (preferences?.id) {
        // Update existing preferences
        const { error } = await supabase
          .from("user_preferences")
          .update(preferenceData)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Create new preferences
        const { error } = await supabase
          .from("user_preferences")
          .insert([preferenceData]);

        if (error) throw error;
      }

      await loadUserPreferences();

      toast({
        title: "Inställningar sparade",
        description: "Dina preferenser har uppdaterats",
      });
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Kunde inte spara inställningar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      const { error } = await deleteAccount();

      if (error) {
        console.error("Delete account error:", error);
      }
      // If successful, user will be redirected automatically due to signout
    } catch (error) {
      console.error("Delete account error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "AN";
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "buyer":
        return "Köpare";
      case "seller":
        return "Säljare";
      case "broker":
        return "Mäklare";
      case "admin":
        return "Admin";
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "broker":
        return "bg-nordic-ice text-primary";
      case "seller":
        return "bg-green-100 text-green-800";
      case "buyer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Profil & Inställningar
            </h1>
            <p className="font-medium text-foreground">
              Hantera ditt konto och personliga inställningar
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="preferences">Preferenser</TabsTrigger>
            <TabsTrigger value="security">Säkerhet</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personlig information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="full_name">Fullständigt namn</Label>
                      <Input
                        id="full_name"
                        {...profileForm.register("full_name")}
                        className="mt-2"
                      />
                      {profileForm.formState.errors.full_name && (
                        <p className="text-sm text-destructive mt-1">
                          {profileForm.formState.errors.full_name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">E-postadress</Label>
                      <Input
                        id="email"
                        type="email"
                        {...profileForm.register("email")}
                        disabled
                        className="mt-2"
                      />
                      <p className="text-xs font-medium text-foreground mt-1">
                        E-postadressen kan inte ändras
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefonnummer</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...profileForm.register("phone")}
                        placeholder="+46 70 123 45 67"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Användarroller</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {userRoles.map((role) => (
                          <Badge key={role} className={getRoleColor(role)}>
                            {getRoleLabel(role)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>Sparar...</>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Spara ändringar
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            {preferencesLoading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Laddar inställningar...</p>
                </CardContent>
              </Card>
            ) : (
              <form
                onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifieringar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email_notifications">
                          E-postnotifieringar
                        </Label>
                        <p className="text-sm font-medium text-foreground">
                          Få meddelanden om nya fastigheter och uppdateringar
                        </p>
                      </div>
                      <Switch
                        id="email_notifications"
                        {...preferencesForm.register("email_notifications")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms_notifications">
                          SMS-notifieringar
                        </Label>
                        <p className="text-sm font-medium text-foreground">
                          Få viktiga meddelanden via SMS
                        </p>
                      </div>
                      <Switch
                        id="sms_notifications"
                        {...preferencesForm.register("sms_notifications")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing_emails">Marknadsföring</Label>
                        <p className="text-sm font-medium text-foreground">
                          Få e-post om erbjudanden och nyheter
                        </p>
                      </div>
                      <Switch
                        id="marketing_emails"
                        {...preferencesForm.register("marketing_emails")}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Lokalisering
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="preferred_currency">Valuta</Label>
                        <Select
                          value={preferencesForm.watch("preferred_currency")}
                          onValueChange={(value) =>
                            preferencesForm.setValue(
                              "preferred_currency",
                              value,
                            )
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Välj valuta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SEK">SEK (kr)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="preferred_language">Språk</Label>
                        <Select
                          value={preferencesForm.watch("preferred_language")}
                          onValueChange={(value) =>
                            preferencesForm.setValue(
                              "preferred_language",
                              value,
                            )
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Välj språk" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sv">Svenska</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Utseende
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="theme">Tema</Label>
                      <Select
                        value={preferencesForm.watch("theme")}
                        onValueChange={(value) =>
                          preferencesForm.setValue("theme", value)
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Välj tema" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">Följ system</SelectItem>
                          <SelectItem value="light">Ljust</SelectItem>
                          <SelectItem value="dark">Mörkt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>Sparar...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Spara inställningar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Kontosäkerhet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Lösenordsändringar och andra säkerhetsinställningar hanteras
                    via Supabase Auth. Kontakta support för hjälp med
                    kontosäkerhet.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Lösenord</h4>
                      <p className="text-sm text-muted-foreground">
                        Senast ändrat: Okänt
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      Ändra lösenord
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Tvåfaktorsautentisering</h4>
                      <p className="text-sm text-muted-foreground">
                        Lägg till extra säkerhet till ditt konto
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      Konfigurera
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Aktiva sessioner</h4>
                      <p className="text-sm text-muted-foreground">
                        Hantera dina inloggade enheter
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      Visa sessioner
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Account Deletion Section */}
                <div className="space-y-4">
                  <div className="text-red-600">
                    <h4 className="font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Farlig zon
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      När du raderar ditt konto försvinner all data permanent
                    </p>
                  </div>

                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Varning:</strong> Denna åtgärd kan inte ångras.
                      Alla dina fastigheter, meddelanden, sparade sökningar och
                      annan data kommer att raderas permanent.
                    </AlertDescription>
                  </Alert>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full bg-red-600 hover:bg-red-700"
                        disabled={deleteLoading}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deleteLoading
                          ? "Raderar konto..."
                          : "Radera mitt konto permanent"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">
                          Radera konto permanent?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Denna åtgärd kan inte ångras. Genom att radera ditt
                          konto kommer följande data att förloras permanent:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Alla dina fastighetsannonser</li>
                            <li>Meddelanden och konversationer</li>
                            <li>Sparade sökningar och bevakningar</li>
                            <li>Användarinställningar och preferenser</li>
                            <li>AI-genererade bilder och data</li>
                            {userRoles.includes("broker") && (
                              <li>Mäklardata och statistik</li>
                            )}
                          </ul>
                          <p className="mt-4 text-red-600 font-medium">
                            Skriv "RADERA" nedan för att bekräfta:
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-2">
                        <Input
                          placeholder="Skriv RADERA här"
                          onChange={(e) => {
                            const button = document.querySelector(
                              "[data-confirm-delete]",
                            ) as HTMLButtonElement;
                            if (button) {
                              button.disabled = e.target.value !== "RADERA";
                            }
                          }}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Avbryt</AlertDialogCancel>
                        <AlertDialogAction
                          data-confirm-delete
                          disabled={true}
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleDeleteAccount}
                        >
                          Ja, radera mitt konto permanent
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
