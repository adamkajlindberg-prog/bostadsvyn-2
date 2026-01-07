"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles } from "lucide-react";

interface UpgradePromptProps {
  feature?: string;
}

export function UpgradePrompt({ feature = "denna funktion" }: UpgradePromptProps) {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60">
          <Crown className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">Uppgradera till Pro</CardTitle>
        <CardDescription className="text-base">
          För att använda {feature} behöver du ett Pro-konto
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Obegränsad tillgång till AI-verktyg</p>
              <p className="text-sm text-muted-foreground">
                Använd homestyling, bildredigering och alla AI-funktioner
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Prioriterad support</p>
              <p className="text-sm text-muted-foreground">
                Få snabbare hjälp när du behöver det
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Avancerade funktioner</p>
              <p className="text-sm text-muted-foreground">
                Få tillgång till nya funktioner först
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button asChild className="w-full">
            <Link href="/upgrade">
              <Crown className="h-4 w-4 mr-2" />
              Uppgradera till Pro
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

