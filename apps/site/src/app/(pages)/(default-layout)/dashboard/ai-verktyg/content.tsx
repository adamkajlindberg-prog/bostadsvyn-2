"use client";

import { Bot, Home, Calculator, History, BarChart3, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserTier } from "@/payments/types";
import { AIPropertyAdvisor } from "@/components/ai-property-advisor";
import { AIHomestyling } from "@/components/ai-homestyling-tool";
import { AIPropertyValuation } from "@/components/ai-property-valuation";
import { AIMarketAnalysis } from "@/components/ai-market-analysis";
import { AIAnalysisHistory } from "@/components/ai-analysis-history";
import { UpgradePrompt } from "@/components/upgrade-prompt";

interface AIVerktygContentProps {
  subscriptionTier: UserTier;
}

export function AIVerktygContent({ subscriptionTier }: AIVerktygContentProps) {
  const isPro = subscriptionTier === "pro" || subscriptionTier === "pro_plus";

  return (
    <div className="space-y-6">
      <Tabs defaultValue="advisor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 gap-1">
          <TabsTrigger value="advisor" className="flex items-center gap-1 text-xs px-2">
            <Bot className="h-3 w-3" />
            <span className="hidden sm:inline">AI-Rådgivare</span>
          </TabsTrigger>
          <TabsTrigger
            value="homestyling"
            className="flex items-center gap-1 text-xs px-2"
            disabled={!isPro}
          >
            {!isPro && <Lock className="h-3 w-3" />}
            <Home className="h-3 w-3" />
            <span className="hidden sm:inline">Homestyling</span>
            {!isPro && <span className="text-xs ml-1">(Pro)</span>}
          </TabsTrigger>
          <TabsTrigger value="valuation" className="flex items-center gap-1 text-xs px-2">
            <Calculator className="h-3 w-3" />
            <span className="hidden sm:inline">Värdering</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex items-center gap-1 text-xs px-2"
            disabled={!isPro}
          >
            {!isPro && <Lock className="h-3 w-3" />}
            <History className="h-3 w-3" />
            <span className="hidden sm:inline">Historik</span>
            {!isPro && <span className="text-xs ml-1">(Pro)</span>}
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1 text-xs px-2">
            <BarChart3 className="h-3 w-3" />
            <span className="hidden sm:inline">Marknadsanalys</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="advisor">
          <AIPropertyAdvisor />
        </TabsContent>

        <TabsContent value="homestyling">
          {isPro ? <AIHomestyling /> : <UpgradePrompt feature="AI Homestyling" />}
        </TabsContent>

        <TabsContent value="valuation">
          <AIPropertyValuation />
        </TabsContent>

        <TabsContent value="analysis">
          <AIMarketAnalysis />
        </TabsContent>

        <TabsContent value="history">
          {isPro ? <AIAnalysisHistory /> : <UpgradePrompt feature="Analyshistorik" />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

