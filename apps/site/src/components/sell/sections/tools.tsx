import { Card, CardContent } from "@/components/ui/card"
import { BrainIcon, CameraIcon, ChartColumnIcon, FileTextIcon, MessageSquareIcon, SparklesIcon } from "lucide-react"

const tools = [
    {
        icon: <CameraIcon />,
        title: "AI-Homestyling",
        description: "Transformera tomma eller tråkiga rum till inspirerande bostäder med AI-genererad möblering och styling som får köpare att drömma."
    },
    {
        icon: <SparklesIcon />,
        title: "AI-Bildredigering",
        description: "Förbättra bilder automatiskt med professionell belysning, färgkorrigering och bildförbättringar som lyfter din fastighet."
    },
    {
        icon: <FileTextIcon />,
        title: "AI-Textgenerering",
        description: "Skapa säljande annonstexter som fångar köparnas intresse och framhäver fastighetens unika kvaliteter på ett professionellt sätt."
    },
    {
        icon: <ChartColumnIcon />,
        title: "AI-Prisanalys",
        description: "Få datadriven prisvärdering baserad på marknadstrender, jämförbara objekt och lokala faktorer för optimal prissättning."
    },
    {
        icon: <MessageSquareIcon />,
        title: "AI-Sökassistent",
        description: "Hjälp potentiella köpare att hitta din fastighet genom intelligent matchning och automatiska rekommendationer."
    },
]

const Tools = () => {
    return (
        <Card className="py-6 bg-gradient-to-br from-accent/5 to-success/5 mt-8 shadow-xs">
            <CardContent className="px-6">
                <div className="flex @lg:items-center flex-wrap mb-4 gap-4 @lg:gap-2">
                    <BrainIcon className="text-primary" />
                    <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">Alla AI-verktyg som ökar ditt slutpris</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-8">
                    Våra AI-drivna verktyg är designade för att hjälpa dig presentera din fastighet på bästa möjliga sätt
                </p>

                <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <Card key={tool.title} className="py-6 shadow-xs">
                            <CardContent className="px-6">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <div className="inline-flex bg-accent/10 rounded-md p-2 text-primary">
                                        {tool.icon}
                                    </div>
                                    <div className="text-base @lg:text-lg font-semibold">{tool.title}</div>
                                </div>
                                <p className="text-sm @lg:text-base text-muted-foreground">{tool.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default Tools