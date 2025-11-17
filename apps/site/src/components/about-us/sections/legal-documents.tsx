import { Card, CardContent } from "@/components/ui/card"
import { CircleCheckIcon, ExternalLinkIcon, EyeIcon, FileTextIcon, ShieldIcon, UsersIcon } from "lucide-react"
import Link from "next/link"

const documents = [
  {
    icon: <FileTextIcon size={20} className="text-primary" />,
    title: "Allmänna villkor",
    description: "Användarvillkor och regler för plattformen",
    link: "/terms"
  },
  {
    icon: <EyeIcon size={20} className="text-primary" />,
    title: "Integritetspolicy",
    description: "Hur vi hanterar dina personuppgifter",
    link: "/privacy"
  },
  {
    icon: <ShieldIcon size={20} className="text-primary" />,
    title: "Cookie-policy",
    description: "Information om cookies och spårning",
    link: "/cookies"
  },
  {
    icon: <UsersIcon size={20} className="text-primary" />,
    title: "Support & Tvistlösning",
    description: "Kontakta oss eller rapportera problem",
    link: "/support"
  },
]

const compliances = [
  "Marknadsföringslagen (2008:486)",
  "GDPR (EU 2016/679)",
  "DAC7-direktivet",
  "EU eIDAS-förordningen",
  "Fastighetsmäklarlagen",
  "Bokföringslagen",
]

const LegalDocuments = () => {
    return (
        <Card className="py-6 mt-8 shadow-xs mb-14">
            <CardContent className="px-6">
                <div className="flex @lg:items-center flex-wrap mb-2 gap-4 @lg:gap-2">
                    <FileTextIcon className="text-primary" />
                    <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">Juridiska dokument & policyer</h3>
                </div>
                <p className="text-sm @lg:text-base text-muted-foreground mb-8">
                    Läs våra policyer och villkor för att förstå hur vi hanterar dina uppgifter och vilka rättigheter du har som användare.
                </p>
                

                <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-6 mb-8">
                    {documents.map((document, index) => (
                        <Card key={`document-${index}`} className="py-4">
                            <CardContent className="px-4">
                                <div className="flex @4xl:items-center justify-between">
                                    <div className="flex flex-col @4xl:flex-row @4xl:items-center gap-3">
                                        {document.icon}
                                        <div>
                                            <div className="text-base font-semibold mb-1 @4xl:mb-0">{document.title}</div>
                                            <div className="text-sm text-muted-foreground">{document.description}</div>
                                        </div>
                                    </div>

                                    <Link href={document.link}>
                                        <ExternalLinkIcon size={20} className="text-muted-foreground hover:text-primary" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                    <div className="text-base font-semibold mb-2">Regelefterlevnad</div>
                    <div className="grid grid-cols-1 @lg:grid-cols-2 gap-2">
                        {compliances.map((compliance, index) => (
                            <div key={`compliance-${index}`} className="flex items-center gap-2">
                                <CircleCheckIcon size={18} className="text-primary shrink-0" />
                                <div className="text-sm text-muted-foreground">{compliance}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default LegalDocuments