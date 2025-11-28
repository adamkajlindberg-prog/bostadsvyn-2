import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  feature?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ feature = 'denna funktion' }) => {
  const navigate = useNavigate();

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
              <p className="text-sm text-muted-foreground">Använd homestyling, bildredigering och alla AI-funktioner</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Prioriterad support</p>
              <p className="text-sm text-muted-foreground">Få snabbare hjälp när du behöver det</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Avancerade funktioner</p>
              <p className="text-sm text-muted-foreground">Få tillgång till nya funktioner först</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold mb-2">299 kr/mån</p>
          <p className="text-sm text-muted-foreground mb-4">Avsluta när som helst</p>
          <Button 
            size="lg" 
            className="w-full"
            onClick={() => navigate('/upgrade')}
          >
            <Crown className="h-4 w-4 mr-2" />
            Uppgradera nu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const LockedFeatureBanner: React.FC<{ feature: string }> = ({ feature }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{feature} är låst</h3>
            <p className="text-sm text-muted-foreground">Uppgradera till Pro för att använda denna funktion</p>
          </div>
        </div>
        <Button onClick={() => navigate('/upgrade')}>
          <Crown className="h-4 w-4 mr-2" />
          Uppgradera
        </Button>
      </div>
    </div>
  );
};
