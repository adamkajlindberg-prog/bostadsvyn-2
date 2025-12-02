"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Euro,
  FileText,
  Key,
  Scale,
  Shield,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyTypeInformationProps {
  propertyType: string;
  status: string;
}

export function PropertyTypeInformation({
  propertyType,
  status,
}: PropertyTypeInformationProps) {
  const isRental = status === "FOR_RENT";

  // Rental-specific information for apartments
  if (isRental && propertyType === "APARTMENT") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Viktig information vid hyra av lägenhet</CardTitle>
          <p className="text-sm text-muted-foreground">
            Allt du behöver veta om att hyra en lägenhet
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hyresavtal & Regler */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Hyresavtal & Regler
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>
                  Kontrakt: Förstahand ger besittningsskydd, andrahand begränsat
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>
                  Uppsägningstid: 3 månader för hyresgäst, 9 mån för hyresvärd
                </span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>
                  Andrahandsuthyrning: Kräver hyresvärdens skriftliga tillstånd
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>
                  Besittningsskydd: Stark rätt att bo kvar vid
                  förstahandskontrakt
                </span>
              </div>
            </div>
          </div>

          {/* Kostnader & Avgifter */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Euro className="h-5 w-5 text-primary" />
              Kostnader & Avgifter
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Euro className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Hyra: Inkluderar ofta värme och vatten</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Deposition: Max 1 månadshyra vid privatuthyrning</span>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>
                  El: Separat kostnad, ca 300-1000 kr/mån beroende på
                  förbrukning
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Wifi className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Bredband: Ofta inkluderat, annars 200-400 kr/månad</span>
              </div>
            </div>
          </div>

          {/* Rättigheter & Skyldigheter */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Rättigheter & Skyldigheter
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>
                  Hyresgästens rättigheter: Besittningsskydd, rätt till
                  underhåll
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Scale className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>
                  Hyresvärdens skyldigheter: Underhåll, reparationer, säkerhet
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default information for other property types
  return (
    <Card>
      <CardHeader>
        <CardTitle>Information om {propertyType}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Ytterligare information kommer snart.
        </p>
      </CardContent>
    </Card>
  );
}
