"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Home,
  Zap,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface PropertyData {
  address: string;
  propertyType: string;
  livingArea: number;
  rooms: number;
  yearBuilt: number;
  plotArea?: number;
  condition: string;
  location: string;
}

interface ValuationResult {
  estimatedValue: number;
  valuationRange: {
    low: number;
    high: number;
  };
  confidence: number;
  marketTrend: "up" | "down" | "stable";
  trendPercentage: number;
  comparableProperties: Array<{
    address: string;
    soldPrice: number;
    soldDate: string;
    similarity: number;
  }>;
  factors: Array<{
    factor: string;
    impact: "positive" | "negative" | "neutral";
    description: string;
  }>;
  recommendation: string;
}

export function AIPropertyValuation() {
  const [propertyData, setPropertyData] = useState<PropertyData>({
    address: "",
    propertyType: "",
    livingArea: 0,
    rooms: 0,
    yearBuilt: 0,
    plotArea: 0,
    condition: "",
    location: "",
  });
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (field: keyof PropertyData, value: string | number) => {
    setPropertyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return propertyData.address.length > 0 && propertyData.location.length > 0;
      case 2:
        return propertyData.propertyType.length > 0 && propertyData.livingArea > 0;
      case 3:
        return propertyData.rooms > 0 && propertyData.yearBuilt > 0;
      default:
        return true;
    }
  };

  const getValuation = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call to /api/ai/property-valuation
      const response = await fetch("/api/ai/property-valuation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyData }),
      });

      if (!response.ok) {
        throw new Error("Kunde inte genomföra värderingen");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Kunde inte genomföra värderingen");
      }

      // Transform the AI response to match our interface
      const aiValuation = data.valuation;
      const result: ValuationResult = {
        estimatedValue:
          aiValuation.estimatedValue || aiValuation.estimated_value || 0,
        valuationRange: {
          low:
            aiValuation.valuationRange?.low ||
            aiValuation.valuation_range?.low ||
            (aiValuation.estimatedValue || 0) * 0.95,
          high:
            aiValuation.valuationRange?.high ||
            aiValuation.valuation_range?.high ||
            (aiValuation.estimatedValue || 0) * 1.05,
        },
        confidence: aiValuation.confidence || aiValuation.confidence_level || 75,
        marketTrend: (aiValuation.marketTrend?.direction ||
          aiValuation.market_trend ||
          "stable") as "up" | "down" | "stable",
        trendPercentage:
          aiValuation.marketTrend?.percentage || aiValuation.trend_percentage || 0,
        comparableProperties: (
          aiValuation.comparableProperties || aiValuation.comparable_properties || []
        ).map((prop: any) => ({
          address: prop.address || prop.location || "Okänd adress",
          soldPrice: prop.soldPrice || prop.sold_price || prop.price || 0,
          soldDate:
            prop.soldDate || prop.sold_date || prop.date || new Date().toISOString(),
          similarity: prop.similarity || 80,
        })),
        factors: (aiValuation.factors || aiValuation.value_factors || []).map(
          (factor: any) => ({
            factor: factor.factor || factor.name || factor.title || "Okänd faktor",
            impact: (factor.impact || "neutral") as
              | "positive"
              | "negative"
              | "neutral",
            description: factor.description || factor.details || "",
          }),
        ),
        recommendation:
          aiValuation.recommendation ||
          aiValuation.recommendations ||
          "Kontakta en mäklare för mer detaljerad rådgivning.",
      };
      setValuationResult(result);
      toast.success("Värdering genomförd!");
    } catch (error) {
      console.error("Värderingsfel:", error);
      toast.error("Ett fel uppstod vid värderingen");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "down":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <BarChart3 className="h-5 w-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "text-green-600 bg-green-50";
      case "negative":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (valuationResult) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Fastighetsvärdering</h2>
          </div>
          <p className="text-muted-foreground">
            AI-genererad värdering baserad på marknadsdata
          </p>
        </div>

        {/* Main Valuation Card */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Uppskattat marknadsvärde
                </h3>
                <p className="text-4xl font-bold text-primary">
                  {formatPrice(valuationResult.estimatedValue)}
                </p>
                <p className="text-muted-foreground">
                  Intervall: {formatPrice(valuationResult.valuationRange.low)} -{" "}
                  {formatPrice(valuationResult.valuationRange.high)}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">
                    Säkerhet: {valuationResult.confidence}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(valuationResult.marketTrend)}
                  <span className="text-sm font-medium">
                    Trend: +{valuationResult.trendPercentage}%
                  </span>
                </div>
              </div>

              <Progress
                value={valuationResult.confidence}
                className="w-full max-w-md mx-auto"
              />
            </div>
          </CardContent>
        </Card>

        {/* Comparable Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Jämförbara fastigheter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {valuationResult.comparableProperties.map((property, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{property.address}</p>
                    <p className="text-sm text-muted-foreground">
                      Såld:{" "}
                      {new Date(property.soldDate).toLocaleDateString("sv-SE")}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold">{formatPrice(property.soldPrice)}</p>
                    <Badge variant="secondary">{property.similarity}% likhet</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Value Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Värdefaktorer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {valuationResult.factors.map((factor, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${getImpactColor(factor.impact)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{factor.factor}</h4>
                    <Badge
                      variant={
                        factor.impact === "positive"
                          ? "default"
                          : factor.impact === "negative"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {factor.impact === "positive"
                        ? "Positiv"
                        : factor.impact === "negative"
                          ? "Negativ"
                          : "Neutral"}
                    </Badge>
                  </div>
                  <p className="text-sm">{factor.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendation */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Zap className="h-5 w-5" />
              AI-rekommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800">{valuationResult.recommendation}</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => {
              setValuationResult(null);
              setStep(1);
            }}
            variant="outline"
          >
            Ny värdering
          </Button>
          <Button onClick={() => window.print()}>Skriv ut rapport</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calculator className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">AI Fastighetsvärdering</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          Få en professionell värdering av din fastighet med hjälp av AI och
          marknadsdata
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Steg 1: Grundläggande information"}
            {step === 2 && "Steg 2: Fastighetens egenskaper"}
            {step === 3 && "Steg 3: Detaljer och skick"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Fastighetsadress *</Label>
                <Input
                  id="address"
                  value={propertyData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="T.ex. Storgatan 1, Stockholm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Område/Kommun *</Label>
                <Input
                  id="location"
                  value={propertyData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="T.ex. Södermalm, Stockholm"
                />
              </div>
            </div>
          )}

          {/* Step 2: Property Type and Size */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Fastighetstyp *</Label>
                <Select
                  value={propertyData.propertyType}
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj fastighetstyp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lägenhet">Lägenhet</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="radhus">Radhus</SelectItem>
                    <SelectItem value="kedjehus">Kedjehus</SelectItem>
                    <SelectItem value="fritidshus">Fritidshus</SelectItem>
                    <SelectItem value="tomt">Tomt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="livingArea">Boarea (m²) *</Label>
                <Input
                  id="livingArea"
                  type="number"
                  value={propertyData.livingArea || ""}
                  onChange={(e) =>
                    handleInputChange("livingArea", Number(e.target.value))
                  }
                  placeholder="T.ex. 85"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plotArea">Tomtarea (m²)</Label>
                <Input
                  id="plotArea"
                  type="number"
                  value={propertyData.plotArea || ""}
                  onChange={(e) =>
                    handleInputChange("plotArea", Number(e.target.value))
                  }
                  placeholder="T.ex. 600 (valfritt)"
                />
              </div>
            </div>
          )}

          {/* Step 3: Details and Condition */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rooms">Antal rum *</Label>
                  <Input
                    id="rooms"
                    type="number"
                    value={propertyData.rooms || ""}
                    onChange={(e) =>
                      handleInputChange("rooms", Number(e.target.value))
                    }
                    placeholder="T.ex. 3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Byggår *</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    value={propertyData.yearBuilt || ""}
                    onChange={(e) =>
                      handleInputChange("yearBuilt", Number(e.target.value))
                    }
                    placeholder="T.ex. 1985"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Skick</Label>
                <Select
                  value={propertyData.condition}
                  onValueChange={(value) => handleInputChange("condition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj skick" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nyskick">Nyskick</SelectItem>
                    <SelectItem value="mycket-bra">Mycket bra</SelectItem>
                    <SelectItem value="bra">Bra</SelectItem>
                    <SelectItem value="normalt">Normalt</SelectItem>
                    <SelectItem value="renoveringsbehov">Renoveringsbehov</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Tillbaka
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!validateStep(step)}
              >
                Nästa
              </Button>
            ) : (
              <Button
                onClick={getValuation}
                disabled={loading || !validateStep(step)}
                className="gap-2"
              >
                {loading ? "Beräknar..." : "Få värdering"}
                <Calculator className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

