"use client";

import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertCircle,
  Bell,
  Check,
  Globe,
  Palette,
  Save,
  Shield,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { toast } from "sonner";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import type { ProfileData } from "@/lib/actions/profile";
import {
  updatePreferencesAction,
  updateProfileAction,
  uploadAvatarAction,
} from "@/lib/actions/profile";

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Namn måste vara minst 2 tecken"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Max 500 tecken").optional(),
  companyName: z.string().optional(),
});

const preferencesFormSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  preferredCurrency: z.enum(["SEK", "EUR", "USD"]),
  preferredLanguage: z.enum(["sv", "en"]),
  theme: z.enum(["system", "light", "dark"]),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

const roleLabels: Record<string, string> = {
  admin: "Admin",
  broker: "Mäklare",
  seller: "Säljare",
  buyer: "Köpare",
};

const roleClassNames: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  broker: "bg-nordic-ice text-primary",
  seller: "bg-green-100 text-green-800",
  buyer: "bg-gray-100 text-gray-800",
};

export function DashboardProfile({ user, profile, preferences, roles }: ProfileData) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatarUrl || user.image || null,
  );
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isProfileSaving, startProfileSaving] = useTransition();
  const [isPreferencesSaving, startPreferencesSaving] = useTransition();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: profile.fullName ?? "",
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
      companyName: profile.companyName ?? "",
    },
  });

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: preferences,
  });

  const initials = useMemo(() => {
    if (profile.fullName) {
      return profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) return user.email.slice(0, 2).toUpperCase();
    return "AN";
  }, [profile.fullName, user.email]);

  const handleAvatarUpload = async (file?: File) => {
    if (!file) return;
    try {
      setIsAvatarUploading(true);
      const result = await uploadAvatarAction(file);
      setAvatarPreview(result.url);
      toast.success("Bild uppladdad");
    } catch (error: any) {
      toast.error(error?.message ?? "Kunde inte ladda upp bild");
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const onSubmitProfile = (values: ProfileFormValues) => {
    startProfileSaving(async () => {
      try {
        await updateProfileAction({
          fullName: values.fullName,
          phone: values.phone || undefined,
          bio: values.bio || undefined,
          companyName: values.companyName || undefined,
        });
        toast.success("Profil uppdaterad");
      } catch (error: any) {
        toast.error(error?.message ?? "Kunde inte uppdatera profilen");
      }
    });
  };

  const onSubmitPreferences = (values: PreferencesFormValues) => {
    startPreferencesSaving(async () => {
      try {
        await updatePreferencesAction(values);
        toast.success("Inställningar sparade");
      } catch (error: any) {
        toast.error(error?.message ?? "Kunde inte spara inställningar");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          {avatarPreview ? (
            <AvatarImage src={avatarPreview} alt={profile.fullName} />
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Profil & Inställningar</h1>
          <p className="font-medium text-muted-foreground">
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
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl font-semibold">
                <User className="h-5 w-5" />
                Personlig information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt={profile.fullName} />
                    ) : (
                      <AvatarFallback>
                        <User className="h-10 w-10" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-2">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        asChild
                        disabled={isAvatarUploading}
                      >
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {isAvatarUploading ? "Laddar upp..." : "Ladda upp profilbild"}
                        </span>
                      </Button>
                    </Label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleAvatarUpload(event.target.files?.[0])}
                      disabled={isAvatarUploading}
                    />
                    <p className="text-sm text-muted-foreground">JPG, PNG eller GIF. Max 5MB.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Fullständigt namn</Label>
                    <Input
                      id="fullName"
                      {...profileForm.register("fullName")}
                      className="mt-2"
                      placeholder="Ditt namn"
                      disabled={isProfileSaving}
                    />
                    {profileForm.formState.errors.fullName && (
                      <p className="text-sm text-destructive mt-1">
                        {profileForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">E-postadress</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="mt-2"
                    />
                    <p className="text-xs font-medium text-muted-foreground mt-1">
                      E-postadressen kan inte ändras
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefonnummer</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+46 70 123 45 67"
                      {...profileForm.register("phone")}
                      className="mt-2"
                      disabled={isProfileSaving}
                    />
                  </div>

                  <div>
                    <Label>Roller</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(roles?.length ? roles : ["buyer"]).map((role) => (
                        <Badge
                          key={role}
                          className={roleClassNames[role] ?? "bg-gray-100 text-gray-800"}
                        >
                          {roleLabels[role] ?? role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Om mig</Label>
                  <Textarea
                    id="bio"
                    rows={5}
                    placeholder="Beskriv dig själv och vad du erbjuder..."
                    {...profileForm.register("bio")}
                    className="mt-2 resize-none"
                    disabled={isProfileSaving}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Denna information kan visas på dina annonser och din profil.
                  </p>
                </div>

                <div>
                  <Label htmlFor="companyName">Företag (valfritt)</Label>
                  <Input
                    id="companyName"
                    placeholder="Företagsnamn"
                    {...profileForm.register("companyName")}
                    className="mt-2"
                    disabled={isProfileSaving}
                  />
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isProfileSaving}>
                    {isProfileSaving ? (
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
          <form onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl font-semibold">
                  <Bell className="h-5 w-5" />
                  Notifieringar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <PreferenceRow
                  id="emailNotifications"
                  label="E-postnotifieringar"
                  description="Få meddelanden om nya fastigheter och uppdateringar"
                  checked={preferencesForm.watch("emailNotifications")}
                  onCheckedChange={(value) =>
                    preferencesForm.setValue("emailNotifications", value)
                  }
                />
                <PreferenceRow
                  id="smsNotifications"
                  label="SMS-notifieringar"
                  description="Få viktiga meddelanden via SMS"
                  checked={preferencesForm.watch("smsNotifications")}
                  onCheckedChange={(value) => preferencesForm.setValue("smsNotifications", value)}
                />
                <PreferenceRow
                  id="marketingEmails"
                  label="Marknadsföring"
                  description="Få e-post om erbjudanden och nyheter"
                  checked={preferencesForm.watch("marketingEmails")}
                  onCheckedChange={(value) => preferencesForm.setValue("marketingEmails", value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl font-semibold">
                  <Globe className="h-5 w-5" />
                  Lokalisering
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="preferredCurrency">Valuta</Label>
                    <Select
                      value={preferencesForm.watch("preferredCurrency")}
                      onValueChange={(value) =>
                        preferencesForm.setValue(
                          "preferredCurrency",
                          value as PreferencesFormValues["preferredCurrency"],
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
                    <Label htmlFor="preferredLanguage">Språk</Label>
                    <Select
                      value={preferencesForm.watch("preferredLanguage")}
                      onValueChange={(value) =>
                        preferencesForm.setValue(
                          "preferredLanguage",
                          value as PreferencesFormValues["preferredLanguage"],
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
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl font-semibold">
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
                      preferencesForm.setValue(
                        "theme",
                        value as PreferencesFormValues["theme"],
                      )
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
              <Button type="submit" disabled={isPreferencesSaving}>
                {isPreferencesSaving ? (
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
                  Lösenordsändringar och andra säkerhetsinställningar hanteras via autentiseringstjänsten.
                  Kontakta support för hjälp med kontosäkerhet.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <SecurityRow title="Lösenord" description="Senast ändrat: Okänt" />
                <SecurityRow
                  title="Tvåfaktorsautentisering"
                  description="Lägg till extra säkerhet till ditt konto"
                />
                <SecurityRow title="Aktiva sessioner" description="Hantera dina inloggade enheter" />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="text-red-600">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Farlig zon
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    När du raderar ditt konto försvinner all data permanent.
                  </p>
                </div>

                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Varning:</strong> Denna åtgärd kan inte ångras. Alla dina fastigheter,
                    meddelanden, sparade sökningar och annan data kommer att raderas permanent.
                  </AlertDescription>
                </Alert>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Radera mitt konto permanent
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-600">
                        Radera konto permanent?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Denna åtgärd kan inte ångras. Genom att radera ditt konto kommer följande data
                        att förloras permanent:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Alla dina fastighetsannonser</li>
                          <li>Meddelanden och konversationer</li>
                          <li>Sparade sökningar och bevakningar</li>
                          <li>Användarinställningar och preferenser</li>
                          <li>AI-genererade bilder och data</li>
                        </ul>
                        <p className="mt-4 text-red-600 font-medium">
                          Denna funktion är ännu inte aktiverad.
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Stäng</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700" disabled>
                        Avaktiverad
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
  );
}

function PreferenceRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="text-sm font-medium text-muted-foreground">{description}</p>
      </div>
      <Toggle
        id={id}
        aria-label={label}
        pressed={checked}
        onPressedChange={onCheckedChange}
      >
        <Check className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

function SecurityRow({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button variant="outline" disabled>
        <Check className="h-4 w-4 mr-2" />
        Hanteras av support
      </Button>
    </div>
  );
}

