"use client";

import {
  Heart,
  Home,
  MessageSquare,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@/auth/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/dashboard";

interface DashboardOverviewProps {
  user: User;
  stats: DashboardStats;
}

export function DashboardOverview({ user, stats }: DashboardOverviewProps) {
  const router = useRouter();

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Översikt över dina sektioner
        </h2>
        <p className="text-muted-foreground">
          Välj en sektion nedan för att komma igång med att hantera dina
          annonser, favoriter och inställningar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Favoriter Card */}
        <Card className="hover:border-primary transition-colors cursor-pointer">
          <Link href="/dashboard/favoriter">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-red-500/10">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle>Favoriter</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Se och hantera alla dina sparade favoritbostäder på ett ställe.
              </p>
              <div className="flex items-center text-sm font-medium text-primary">
                {stats.favoriteCount} favoriter
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Mina Annonser Card */}
        <Card className="hover:border-primary transition-colors cursor-pointer">
          <Link href="/dashboard/mina-annonser">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Home className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Mina Annonser</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {user?.role === "broker"
                  ? "Hantera försäljningsannonser och mäklaruppdrag via Mäklarportalen."
                  : "Skapa och hantera hyresannonser för uthyrning."}
              </p>
              <div className="flex items-center text-sm font-medium text-primary">
                Se annonser och statistik
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Grupp Card */}
        <Card className="hover:border-primary transition-colors cursor-pointer">
          <Link href="/dashboard/gruppkonton">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle>Gruppkonton</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Samarbeta med familj och vänner för att hitta och rösta på
                bostäder.
              </p>
              <div className="flex items-center text-sm font-medium text-primary">
                Gå till gruppkonton
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* AI-bilder Card */}
        <Card className="hover:border-primary transition-colors cursor-pointer">
          <Link href="/dashboard/ai-bildgalleri">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-pink-500/10">
                  <Sparkles className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle>AI-bildgalleri</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Se och hantera dina AI-genererade bilder för fastighetsannonser.
              </p>
              <div className="flex items-center text-sm font-medium text-primary">
                Öppna bildgalleri
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* AI-verktyg Card */}
        <Card className="hover:border-primary transition-colors cursor-pointer">
          <Link href="/dashboard/ai-verktyg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Wand2 className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle>AI-verktyg</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Använd AI för att förbättra dina annonser och analysera
                marknaden.
              </p>
              <div className="flex items-center text-sm font-medium text-primary">
                Öppna AI-verktyg
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Meddelanden Card */}
        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <MessageSquare className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle>Meddelanden</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Se alla dina chatkonversationer och obesvarade meddelanden.
            </p>
            <Button
              onClick={() => router.push("/dashboard/meddelanden")}
              variant="default"
              className="mt-2"
            >
              Öppna meddelanden
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
