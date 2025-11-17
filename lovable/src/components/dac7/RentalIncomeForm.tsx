import { Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RentalIncomeFormProps {
  landlordInfoId: string;
  onSuccess: () => void;
}

const RentalIncomeForm: React.FC<RentalIncomeFormProps> = ({
  landlordInfoId,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    propertyAddress: "",
    propertyType: "apartment",
    rentalIncome: "",
    reportingPeriodStart: "",
    reportingPeriodEnd: "",
    rentalDays: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("dac7_rental_income").insert({
        landlord_info_id: landlordInfoId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        property_address: formData.propertyAddress,
        property_type: formData.propertyType,
        rental_income: parseFloat(formData.rentalIncome),
        reporting_period_start: formData.reportingPeriodStart,
        reporting_period_end: formData.reportingPeriodEnd,
        rental_days: parseInt(formData.rentalDays, 10),
      });

      if (error) throw error;

      toast({
        title: "Hyresintäkt tillagd",
        description: "Din hyresintäkt har sparats",
      });

      setFormData({
        propertyAddress: "",
        propertyType: "apartment",
        rentalIncome: "",
        reportingPeriodStart: "",
        reportingPeriodEnd: "",
        rentalDays: "",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Lägg till hyresintäkt
        </CardTitle>
        <CardDescription>
          Registrera hyresintäkter för DAC7-rapportering
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyAddress">Fastighetens adress *</Label>
              <Input
                id="propertyAddress"
                value={formData.propertyAddress}
                onChange={(e) =>
                  setFormData({ ...formData, propertyAddress: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Fastighetstyp *</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) =>
                  setFormData({ ...formData, propertyType: value })
                }
              >
                <SelectTrigger id="propertyType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Lägenhet</SelectItem>
                  <SelectItem value="house">Villa</SelectItem>
                  <SelectItem value="vacation_home">Fritidshus</SelectItem>
                  <SelectItem value="commercial">Kommersiell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rentalIncome">Hyresintäkt (SEK) *</Label>
              <Input
                id="rentalIncome"
                type="number"
                step="0.01"
                value={formData.rentalIncome}
                onChange={(e) =>
                  setFormData({ ...formData, rentalIncome: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rentalDays">Antal hyresdagar *</Label>
              <Input
                id="rentalDays"
                type="number"
                value={formData.rentalDays}
                onChange={(e) =>
                  setFormData({ ...formData, rentalDays: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportingPeriodStart">Period start *</Label>
              <Input
                id="reportingPeriodStart"
                type="date"
                value={formData.reportingPeriodStart}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reportingPeriodStart: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportingPeriodEnd">Period slut *</Label>
              <Input
                id="reportingPeriodEnd"
                type="date"
                value={formData.reportingPeriodEnd}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reportingPeriodEnd: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sparar..." : "Lägg till hyresintäkt"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RentalIncomeForm;
