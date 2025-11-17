import {
  Bell,
  DollarSign,
  Home,
  MapPin,
  Plus,
  Settings,
  Target,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUserPreferences } from "@/hooks/useUserPreferences";

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

export default function PersonalizationPanel() {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [newArea, setNewArea] = useState("");
  const [budgetMin, setBudgetMin] = useState(
    preferences.budgetRange.min?.toString() || "",
  );
  const [budgetMax, setBudgetMax] = useState(
    preferences.budgetRange.max?.toString() || "",
  );

  const handleAddArea = () => {
    if (newArea && !preferences.interestedAreas.includes(newArea)) {
      updatePreferences({
        interestedAreas: [...preferences.interestedAreas, newArea],
      });
      setNewArea("");
      toast({
        title: "Område tillagt",
        description: `${newArea} har lagts till i dina intresserade områden.`,
      });
    }
  };

  const handleRemoveArea = (area: string) => {
    updatePreferences({
      interestedAreas: preferences.interestedAreas.filter((a) => a !== area),
    });
  };

  const handlePropertyTypeToggle = (type: string) => {
    const isSelected = preferences.preferredPropertyTypes.includes(type);
    updatePreferences({
      preferredPropertyTypes: isSelected
        ? preferences.preferredPropertyTypes.filter((t) => t !== type)
        : [...preferences.preferredPropertyTypes, type],
    });
  };

  const handleInvestmentGoalToggle = (goal: string) => {
    const isSelected = preferences.investmentGoals.includes(goal);
    updatePreferences({
      investmentGoals: isSelected
        ? preferences.investmentGoals.filter((g) => g !== goal)
        : [...preferences.investmentGoals, goal],
    });
  };

  const handleBudgetUpdate = () => {
    const min = budgetMin ? parseInt(budgetMin, 10) : null;
    const max = budgetMax ? parseInt(budgetMax, 10) : null;

    updatePreferences({
      budgetRange: { min, max },
    });

    toast({
      title: "Budget uppdaterad",
      description: "Din budgetram har sparats.",
    });
  };

  const handleNotificationUpdate = (
    key: keyof typeof preferences.notifications,
    value: boolean,
  ) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        [key]: value,
      },
    });
  };

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
              onKeyPress={(e) => e.key === "Enter" && handleAddArea()}
              list="areas-list"
            />
            <datalist id="areas-list">
              {swedishAreas.map((area) => (
                <option key={area} value={area} />
              ))}
            </datalist>
            <Button onClick={handleAddArea} size="sm">
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
            />
            <span>-</span>
            <Input
              placeholder="Max budget"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              type="number"
            />
            <Button onClick={handleBudgetUpdate} size="sm">
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
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
