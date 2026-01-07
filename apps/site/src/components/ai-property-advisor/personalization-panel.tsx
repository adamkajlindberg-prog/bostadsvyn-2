"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Settings,
  MapPin,
  DollarSign,
  Home,
  Target,
  Bell,
  Plus,
  X,
} from "lucide-react";
import { getAIPreferences, updateAIPreferences } from "@/lib/actions/profile";
import type { AIPreferences, UpdateAIPreferencesInput } from "@/lib/actions/profile";

const swedishAreas = [
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Västerås",
  "Örebro",
  "Linköping",
  "Helsingborg",
  "Jönköping",
  "Norrköping",
  "Lund",
  "Umeå",
  "Gävle",
  "Borås",
  "Sundsvall",
  "Täby",
  "Danderyd",
  "Nacka",
  "Solna",
  "Lidingö",
];

const propertyTypes = [
  "Lägenhet",
  "Villa",
  "Radhus",
  "Townhouse",
  "Fritidshus",
  "Tomt",
];

const investmentGoals = [
  "Eget boende",
  "Uthyrning",
  "Kapitalväxt",
  "Kortsiktig vinst",
  "Långsiktig investering",
];

export function PersonalizationPanel() {
  const [preferences, setPreferences] = useState<AIPreferences>({
    interestedAreas: [],
    budgetRange: { min: null, max: null },
    preferredPropertyTypes: [],
    investmentGoals: [],
    notifications: {
      priceAlerts: false,
      marketUpdates: false,
      newListings: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newArea, setNewArea] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    setBudgetMin(preferences.budgetRange.min?.toString() || "");
    setBudgetMax(preferences.budgetRange.max?.toString() || "");
  }, [preferences.budgetRange]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const result = await getAIPreferences();
      if (result.success && result.preferences) {
        setPreferences(result.preferences);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
      toast.error("Fel", {
        description: "Kunde inte ladda inställningar",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (updates: UpdateAIPreferencesInput) => {
    try {
      setSaving(true);
      const result = await updateAIPreferences(updates);
      if (result.success) {
        toast.success("Inställningar sparade", {
          description: "Dina personliga inställningar har uppdaterats",
        });
        await loadPreferences();
      } else {
        throw new Error(result.error || "Kunde inte spara inställningar");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Fel", {
        description:
          error instanceof Error
            ? error.message
            : "Kunde inte spara inställningar",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddArea = () => {
    if (newArea && !preferences.interestedAreas.includes(newArea)) {
      const updatedAreas = [...preferences.interestedAreas, newArea];
      setPreferences({ ...preferences, interestedAreas: updatedAreas });
      savePreferences({ interestedAreas: updatedAreas });
      setNewArea("");
      toast.success("Område tillagt", {
        description: `${newArea} har lagts till i dina intresserade områden.`,
      });
    }
  };

  const handleRemoveArea = (area: string) => {
    const updatedAreas = preferences.interestedAreas.filter((a) => a !== area);
    setPreferences({ ...preferences, interestedAreas: updatedAreas });
    savePreferences({ interestedAreas: updatedAreas });
  };

  const handlePropertyTypeToggle = (type: string) => {
    const isSelected = preferences.preferredPropertyTypes.includes(type);
    const updatedTypes = isSelected
      ? preferences.preferredPropertyTypes.filter((t) => t !== type)
      : [...preferences.preferredPropertyTypes, type];
    setPreferences({ ...preferences, preferredPropertyTypes: updatedTypes });
    savePreferences({ preferredPropertyTypes: updatedTypes });
  };

  const handleInvestmentGoalToggle = (goal: string) => {
    const isSelected = preferences.investmentGoals.includes(goal);
    const updatedGoals = isSelected
      ? preferences.investmentGoals.filter((g) => g !== goal)
      : [...preferences.investmentGoals, goal];
    setPreferences({ ...preferences, investmentGoals: updatedGoals });
    savePreferences({ investmentGoals: updatedGoals });
  };

  const handleBudgetUpdate = () => {
    const min = budgetMin ? parseInt(budgetMin, 10) : null;
    const max = budgetMax ? parseInt(budgetMax, 10) : null;
    const budgetRange = { min, max };
    setPreferences({ ...preferences, budgetRange });
    savePreferences({ budgetRange });
  };

  const handleNotificationUpdate = (
    key: keyof typeof preferences.notifications,
    value: boolean,
  ) => {
    const updatedNotifications = {
      ...preferences.notifications,
      [key]: value,
    };
    setPreferences({ ...preferences, notifications: updatedNotifications });
    savePreferences({ notifications: updatedNotifications });
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Laddar inställningar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Personliga inställningar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Intresserade områden */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-medium">
            <MapPin className="h-4 w-4 text-primary" />
            Intresserade områden
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Lägg till område..."
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddArea();
                }
              }}
              list="areas-list"
              disabled={saving}
            />
            <datalist id="areas-list">
              {swedishAreas.map((area) => (
                <option key={area} value={area} />
              ))}
            </datalist>
            <Button
              onClick={handleAddArea}
              size="sm"
              disabled={saving || !newArea.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.interestedAreas.map((area) => (
              <Badge
                key={area}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleRemoveArea(area)}
              >
                {area}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Budget */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-medium">
            <DollarSign className="h-4 w-4 text-primary" />
            Budgetram (SEK)
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Min budget"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              type="number"
              disabled={saving}
            />
            <span>-</span>
            <Input
              placeholder="Max budget"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              type="number"
              disabled={saving}
            />
            <Button onClick={handleBudgetUpdate} size="sm" disabled={saving}>
              Spara
            </Button>
          </div>
        </div>

        <Separator />

        {/* Fastighetstyper */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Home className="h-4 w-4 text-primary" />
            Föredragna fastighetstyper
          </Label>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <Badge
                key={type}
                variant={
                  preferences.preferredPropertyTypes.includes(type)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => handlePropertyTypeToggle(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Investeringsmål */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Target className="h-4 w-4 text-primary" />
            Investeringsmål
          </Label>
          <div className="flex flex-wrap gap-2">
            {investmentGoals.map((goal) => (
              <Badge
                key={goal}
                variant={
                  preferences.investmentGoals.includes(goal)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => handleInvestmentGoalToggle(goal)}
              >
                {goal}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Notifieringar */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Bell className="h-4 w-4 text-primary" />
            Notifieringar
          </Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="price-alerts">Prisalarmer</Label>
              <Switch
                id="price-alerts"
                checked={preferences.notifications.priceAlerts}
                onCheckedChange={(checked) =>
                  handleNotificationUpdate("priceAlerts", checked)
                }
                disabled={saving}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="market-updates">Marknadsuppdateringar</Label>
              <Switch
                id="market-updates"
                checked={preferences.notifications.marketUpdates}
                onCheckedChange={(checked) =>
                  handleNotificationUpdate("marketUpdates", checked)
                }
                disabled={saving}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-listings">Nya annonser</Label>
              <Switch
                id="new-listings"
                checked={preferences.notifications.newListings}
                onCheckedChange={(checked) =>
                  handleNotificationUpdate("newListings", checked)
                }
                disabled={saving}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

