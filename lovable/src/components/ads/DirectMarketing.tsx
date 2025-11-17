import { CheckCircle2, Clock, Mail, Send, Target, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";

const DirectMarketing = () => {
  const [campaign, setCampaign] = useState({
    subject: "",
    message: "",
    targetAudience: "all",
  });

  const handleSendCampaign = () => {
    if (!campaign.subject || !campaign.message) {
      toast.error("Vänligen fyll i ämne och meddelande");
      return;
    }

    toast.success(
      "Kampanj skickad! Mottagare kommer att få ditt meddelande inom 24 timmar.",
    );
    setCampaign({ subject: "", message: "", targetAudience: "all" });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Totala mottagare
                </p>
                <p className="text-2xl font-bold">12,458</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Öppningsfrekvens
                </p>
                <p className="text-2xl font-bold">68%</p>
              </div>
              <Mail className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Klickfrekvens</p>
                <p className="text-2xl font-bold">24%</p>
              </div>
              <Target className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Aktiva kampanjer
                </p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-premium" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Campaign */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Skapa direktmarknadsföring
          </CardTitle>
          <CardDescription>
            Skicka personliga meddelanden direkt till intresserade köpare
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Ämnesrad</Label>
            <Input
              id="subject"
              placeholder="Ny fastighet som matchar dina sökkriterier"
              value={campaign.subject}
              onChange={(e) =>
                setCampaign({ ...campaign, subject: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Meddelande</Label>
            <Textarea
              id="message"
              placeholder="Hej! Vi har en ny fastighet som vi tror kan passa dig..."
              rows={6}
              value={campaign.message}
              onChange={(e) =>
                setCampaign({ ...campaign, message: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Målgrupp</Label>
            <div className="flex gap-2">
              <Button
                variant={
                  campaign.targetAudience === "all" ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  setCampaign({ ...campaign, targetAudience: "all" })
                }
              >
                Alla intresserade (12,458)
              </Button>
              <Button
                variant={
                  campaign.targetAudience === "matched" ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  setCampaign({ ...campaign, targetAudience: "matched" })
                }
              >
                Matchade köpare (3,241)
              </Button>
              <Button
                variant={
                  campaign.targetAudience === "recent" ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  setCampaign({ ...campaign, targetAudience: "recent" })
                }
              >
                Senaste besökare (892)
              </Button>
            </div>
          </div>

          <Button onClick={handleSendCampaign} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Skicka kampanj
          </Button>
        </CardContent>
      </Card>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Senaste kampanjer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Nytt pris - Villa i Vasastan",
                sent: "2 dagar sedan",
                opened: "72%",
                clicked: "28%",
                status: "active",
              },
              {
                title: "Öppet hus i helgen - Lägenhet Södermalm",
                sent: "5 dagar sedan",
                opened: "68%",
                clicked: "22%",
                status: "completed",
              },
              {
                title: "Exklusiv fastighet nu tillgänglig",
                sent: "1 vecka sedan",
                opened: "65%",
                clicked: "19%",
                status: "completed",
              },
            ].map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{campaign.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {campaign.sent}
                    </span>
                    <span>Öppnad: {campaign.opened}</span>
                    <span>Klickad: {campaign.clicked}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    campaign.status === "active" ? "default" : "secondary"
                  }
                >
                  {campaign.status === "active" ? "Aktiv" : "Avslutad"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectMarketing;
