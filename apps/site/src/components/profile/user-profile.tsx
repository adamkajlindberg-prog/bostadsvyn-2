"use client";

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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/auth/client";
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
import {
  deleteUserAccount,
  getUserPreferences,
  updateUserPreferences,
  updateUserProfile,
} from "@/lib/actions/profile";

const profileSchema = z.object({
  name: z.string().min(2, "Namn måste vara minst 2 tecken"),
  phone: z.string().optional(),
});

const preferencesSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  preferredCurrency: z.string(),
  preferredLanguage: z.string(),
  theme: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PreferencesFormData = z.infer<typeof preferencesSchema>;

export function UserProfile() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: "",
    },
  });

  const preferencesForm = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      preferredCurrency: "SEK",
      preferredLanguage: "sv",
      theme: "system",
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: [TYPE_TEMP_FIX]
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        phone: (user as { phone?: string }).phone || "",
      });
      loadUserPreferences();
    }
  }, [user, profileForm]);

  const loadUserPreferences = async () => {
    try {
      setPreferencesLoading(true);
      const result = await getUserPreferences();

      if (result.success && result.preferences) {
        preferencesForm.reset({
          emailNotifications: result.preferences.emailNotifications,
          smsNotifications: result.preferences.smsNotifications,
          marketingEmails: result.preferences.marketingEmails,
          preferredCurrency: result.preferences.preferredCurrency,
          preferredLanguage: result.preferences.preferredLanguage,
          theme: result.preferences.theme,
        });
      }
    } catch (error) {
      console.error("Error loading user preferences:", error);
    } finally {
      setPreferencesLoading(false);
    }
  };

  const onSubmitProfile = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await updateUserProfile({
        name: data.name,
        phone: data.phone,
      });

      if (!result.success) {
        throw new Error(result.error || "Kunde inte uppdatera profilen");
      }

      toast.success("Profil uppdaterad", {
        description: "Dina profiluppgifter har sparats",
      });
    } catch (error) {
      toast.error("Fel", {
        description:
          error instanceof Error
            ? error.message
            : "Kunde inte uppdatera profilen",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPreferences = async (data: PreferencesFormData) => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await updateUserPreferences({
        emailNotifications: data.emailNotifications,
        smsNotifications: data.smsNotifications,
        marketingEmails: data.marketingEmails,
        preferredCurrency: data.preferredCurrency as "SEK" | "EUR" | "USD",
        preferredLanguage: data.preferredLanguage as "sv" | "en",
        theme: data.theme as "system" | "light" | "dark",
      });

      if (!result.success) {
        throw new Error(result.error || "Kunde inte spara inställningar");
      }

      toast.success("Inställningar sparade", {
        description: "Dina preferenser har uppdaterats",
      });
    } catch (error) {
      toast.error("Fel", {
        description:
          error instanceof Error
            ? error.message
            : "Kunde inte spara inställningar",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      const result = await deleteUserAccount();

      if (!result.success) {
        throw new Error(result.error || "Kunde inte radera kontot");
      }

      toast.success("Konto raderat", {
        description: "Ditt konto har tagits bort permanent",
      });

      // Sign out and redirect
      await authClient.signOut();
      window.location.href = "/";
    } catch (error) {
      toast.error("Fel vid kontoradering", {
        description:
          error instanceof Error ? error.message : "Kunde inte radera kontot",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
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
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "broker":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "seller":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "buyer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  if (!user) {
    return null;
  }

  const userRole = user.role || "free";
  const userRoles = userRole ? [userRole] : [];

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
                      <Label htmlFor="name">Fullständigt namn</Label>
                      <Input
                        id="name"
                        {...profileForm.register("name")}
                        className="mt-2"
                      />
                      {profileForm.formState.errors.name && (
                        <p className="text-sm text-destructive mt-1">
                          {profileForm.formState.errors.name.message}
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
                        checked={preferencesForm.watch("emailNotifications")}
                        onCheckedChange={(checked: boolean) =>
                          preferencesForm.setValue(
                            "emailNotifications",
                            checked,
                          )
                        }
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
                        checked={preferencesForm.watch("smsNotifications")}
                        onCheckedChange={(checked: boolean) =>
                          preferencesForm.setValue("smsNotifications", checked)
                        }
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
                        checked={preferencesForm.watch("marketingEmails")}
                        onCheckedChange={(checked: boolean) =>
                          preferencesForm.setValue("marketingEmails", checked)
                        }
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
                          value={preferencesForm.watch("preferredCurrency")}
                          onValueChange={(value) =>
                            preferencesForm.setValue("preferredCurrency", value)
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
                          value={preferencesForm.watch("preferredLanguage")}
                          onValueChange={(value) =>
                            preferencesForm.setValue("preferredLanguage", value)
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
                    via better-auth. Kontakta support för hjälp med
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

                  <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
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
                          value={deleteConfirmText}
                          onChange={(e) => {
                            setDeleteConfirmText(e.target.value);
                          }}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Avbryt</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={deleteConfirmText !== "RADERA"}
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
}
