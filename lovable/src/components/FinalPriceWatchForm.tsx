import { Bell } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FinalPriceWatchFormProps {
  propertyId: string;
  propertyTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FinalPriceWatchForm({
  propertyId,
  propertyTitle,
  open,
  onOpenChange,
}: FinalPriceWatchFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    notify_via_email: true,
    notify_via_sms: false,
    reasonForInterest: "",
    planningToSell: false,
    estimatedSaleTimeframe: "",
    currentLivingSituation: "",
    budgetRange: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.reasonForInterest) {
      toast({
        title: "Fyll i alla obligatoriska fält",
        description:
          "Namn, e-post och anledning till intresse är obligatoriska",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("property_final_price_watchers")
        .insert({
          property_id: propertyId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message || null,
          notify_via_email: formData.notify_via_email,
          notify_via_sms: formData.notify_via_sms,
          reason_for_interest: formData.reasonForInterest || null,
          planning_to_sell: formData.planningToSell,
          estimated_sale_timeframe: formData.estimatedSaleTimeframe || null,
          current_living_situation: formData.currentLivingSituation || null,
          budget_range: formData.budgetRange || null,
        });

      if (error) throw error;

      toast({
        title: "Tack för din anmälan!",
        description: "Du kommer att få ett meddelande när slutpriset är klart.",
      });

      // Reset form and close dialog
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        notify_via_email: true,
        notify_via_sms: false,
        reasonForInterest: "",
        planningToSell: false,
        estimatedSaleTimeframe: "",
        currentLivingSituation: "",
        budgetRange: "",
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Fel",
        description: "Kunde inte registrera din bevakning. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Bevaka slutpriset
          </DialogTitle>
          <DialogDescription>
            Få ett meddelande när slutpriset för{" "}
            <strong>{propertyTitle}</strong> är klart
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Namn <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ditt för- och efternamn"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              E-post <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="din@email.se"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefonnummer (valfritt)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="070-123 45 67"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Meddelande (valfritt)</Label>
            <Textarea
              id="message"
              placeholder="T.ex. Jag är intresserad av liknande objekt i området..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reasonForInterest">
              Varför vill du veta slutpriset?{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reasonForInterest"
              placeholder="T.ex. Jag funderar på att köpa i området, vill värdera min egen bostad, etc."
              value={formData.reasonForInterest}
              onChange={(e) =>
                setFormData({ ...formData, reasonForInterest: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Planerar du att sälja din bostad i framtiden?</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="planningToSell"
                checked={formData.planningToSell}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    planningToSell: checked as boolean,
                  })
                }
              />
              <label
                htmlFor="planningToSell"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Ja, jag planerar att sälja
              </label>
            </div>
          </div>

          {formData.planningToSell && (
            <div className="space-y-2">
              <Label htmlFor="estimatedSaleTimeframe">
                När planerar du att sälja?
              </Label>
              <select
                id="estimatedSaleTimeframe"
                value={formData.estimatedSaleTimeframe}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedSaleTimeframe: e.target.value,
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Välj tidsram</option>
                <option value="within_3_months">Inom 3 månader</option>
                <option value="3_6_months">3-6 månader</option>
                <option value="6_12_months">6-12 månader</option>
                <option value="1_2_years">1-2 år</option>
                <option value="over_2_years">Över 2 år</option>
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentLivingSituation">
              Nuvarande boendesituation
            </Label>
            <select
              id="currentLivingSituation"
              value={formData.currentLivingSituation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currentLivingSituation: e.target.value,
                })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Välj alternativ</option>
              <option value="owner">Bor i egen bostad</option>
              <option value="renter">Hyr bostad</option>
              <option value="living_with_parents">Bor hos föräldrar</option>
              <option value="other">Annat</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetRange">Budgetram (om köpintresserad)</Label>
            <select
              id="budgetRange"
              value={formData.budgetRange}
              onChange={(e) =>
                setFormData({ ...formData, budgetRange: e.target.value })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Välj budgetram</option>
              <option value="under_2m">Under 2 miljoner kr</option>
              <option value="2m_4m">2-4 miljoner kr</option>
              <option value="4m_6m">4-6 miljoner kr</option>
              <option value="6m_8m">6-8 miljoner kr</option>
              <option value="8m_10m">8-10 miljoner kr</option>
              <option value="over_10m">Över 10 miljoner kr</option>
            </select>
          </div>

          <div className="space-y-3">
            <Label>Hur vill du bli notifierad?</Label>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify_email"
                checked={formData.notify_via_email}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    notify_via_email: checked as boolean,
                  })
                }
              />
              <label
                htmlFor="notify_email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Via e-post
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify_sms"
                checked={formData.notify_via_sms}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    notify_via_sms: checked as boolean,
                  })
                }
              />
              <label
                htmlFor="notify_sms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Via SMS (om telefonnummer angivet)
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Skickar..." : "Bevaka slutpris"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
