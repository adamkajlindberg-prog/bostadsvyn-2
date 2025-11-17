import {
  BotIcon,
  ChartColumnIcon,
  HomeIcon,
  LockIcon,
  SparklesIcon,
  WandSparklesIcon,
} from "lucide-react";
import Link from "next/link";
import ContainerWrapper from "@/components/common/container-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";

const tools = [
  {
    icon: <BotIcon size={32} />,
    title: "AI Fastighetrådgivare",
    description: "Få expertråd om fastighetsmarknaden dygnet runt",
    isComingSoon: false,
  },
  {
    icon: <WandSparklesIcon size={32} />,
    title: "AI Bildredigering",
    description:
      "Redigera fastighetsbilder med AI - ändra färger, möbler och mer",
    isComingSoon: false,
  },
  {
    icon: <HomeIcon size={32} />,
    title: "AI Homestyling",
    description: "Visualisera olika inredningsstilar för dina rum med AI",
    isComingSoon: false,
  },
  {
    icon: <ChartColumnIcon size={32} />,
    title: "Marknadsanalys",
    description: "AI-drivna marknadsinsikter och prognoser",
    isComingSoon: true,
  },
];

const Tools = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <h1 className="text-4xl @lg:text-5xl text-primary text-center font-semibold tracking-tight leading-tight mb-4">
          AI-Verktyg för Fastigheter
        </h1>
        <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
          Använd avancerad AI-teknik för att förbättra din fastighetsupplevelse
          - från bildredigering till marknadsanalyser
        </p>

        <div className="flex justify-center mb-10">
          <div className="flex items-center space-x-1.5 bg-primary py-2 px-4 rounded-full">
            <SparklesIcon size={16} className="text-primary-foreground" />
            <div className="text-xs font-semibold text-primary-foreground">
              Powered by OpenAI
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-4 gap-6 mb-8">
          {tools.map((tool) => (
            <Card key={tool.title} className="py-6 shadow-xs">
              <CardContent className="px-6">
                <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                  <div className="text-primary">{tool.icon}</div>

                  {tool.isComingSoon && (
                    <div className="flex items-center space-x-1.5 bg-yellow-50 border border-yellow-300 text-yellow-800 py-0.5 px-2 rounded-full">
                      <SparklesIcon size={12} />
                      <div className="text-xs font-semibold">Kommer snart</div>
                    </div>
                  )}
                </div>

                <h5 className="text-lg font-semibold mb-2">{tool.title}</h5>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="py-8 shadow-xs">
          <CardContent className="px-6">
            <div className="flex justify-center mb-4">
              <LockIcon size={36} className="text-muted-foreground" />
            </div>
            <h3 className="tezt-xl @lg:text-2xl text-center font-semibold mb-2">
              Logga in för att använda AI-verktyg
            </h3>
            <p className="text-sm @lg:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Skapa ett konto eller logga in för att få tillgång till våra
              AI-drivna verktyg.
            </p>
            <div className="flex justify-center">
              <Link href="/login">
                <Button className="py-5 hover:border-transparent w-full @lg:w-auto">
                  Logga in / Registrera
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </ContainerWrapper>
    </div>
  );
};

export default Tools;
