import { Card, CardContent } from "@/components/ui/card"
import { RocketIcon, TargetIcon } from "lucide-react"

const Hero = () => {
    return (
        <>
            <div className="flex items-center justify-center mb-4">
                <div className="bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5">Grundat 2024</div>
            </div>

            <h1 className="text-4xl @lg:text-5xl text-primary text-center font-semibold tracking-tight leading-tight mb-4">Framtidens fastighetsplattform</h1>
            <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
                Vi revolutionerar fastighetsmarknaden genom att kombinera avancerad AI-teknik med användarvänlig design för att skapa Sveriges mest innovativa bostadsportal.
            </p>

            <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-8 mb-14">
                <Card  className="py-6 shadow-xs">
                    <CardContent className="px-6">
                        <div className="flex flex-wrap items-center gap-2.5 mb-4">
                            <TargetIcon className="text-primary"/>
                            <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">Vår Mission</h3>
                        </div>
                        <p className="text-sm @lg:text-base text-muted-foreground">
                            Att demokratisera fastighetsmarknaden genom att göra avancerad teknik och marknadsdata 
                            tillgänglig för alla. Vi vill att varje person ska kunna fatta välgrundade beslut när 
                            det gäller sitt hem - oavsett om man köper, säljer eller hyr.
                        </p>
                    </CardContent>
                </Card>

                <Card  className="py-6 shadow-xs">
                    <CardContent className="px-6">
                        <div className="flex flex-wrap items-center gap-2.5 mb-4">
                            <RocketIcon className="text-primary"/>
                            <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">Vår Vision</h3>
                        </div>
                        <p className="text-sm @lg:text-base text-muted-foreground">
                            Att bli Nordens ledande fastighetsplattform där AI-driven innovation möter mänsklig expertis. En plattform som förenar köpare, säljare, mäklare 
                            och investerare i ett transparent och effektivt ekosystem.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default Hero