import bgImage from "@/images/bg-image.webp"
import ProjectCard, { Project } from "@/components/new-production/project-card"

const properties: Project[] = [
    {
        image: bgImage,
        badgeOneText: "Prime Location",
        badgeTwoText: "Uthyres",
        name: "Prestigekontorer City",
        location: "Östermalm, Stockholm",
        description: "Exklusiva kontorslokaler i hjärtat av Stockholm. Representativa ytor med modern teknik och service.",
        price: "15,500 kr/m²",
        otherInfo: "450 m² • 8 rum",
        button: {
            text: "Boka visning",
            variant: "outline",
        }
    },
    {
        image: bgImage,
        badgeOneText: "Butik",
        badgeTwoText: "Till salu",
        name: "Butikslokal Avenyn",
        location: "Centrum, Göteborg",
        description: "Strategiskt placerad butik på Avenyn med högt fotgängarflöde. Perfekt för detaljhandel.",
        price: "12,5M kr",
        otherInfo: "180 m² • Gatuplan",
        button: {
            text: "Kontakta mäklare",
            variant: "outline",
        }
    },
    {
        image: bgImage,
        badgeOneText: "Logistik",
        badgeTwoText: "Ny byggnad",
        name: "Ny byggnad",
        location: "Arlanda, Stockholm",
        description: "Modern logistikfastighet med optimal anslutning till E4 och Arlanda. Flexibla lösningar för distribution.",
        price: "2,800 kr/m²",
        otherInfo: "8,500 m² • Lager",
        button: {
            text: "Begär information",
            variant: "outline",
        }
    }
]

const CommercialProperties = () => {
    return (
        <>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">Utvalda kommersiella fastigheter</h3>
                <div className="text-xs text-center font-semibold rounded-full border px-3 py-1">Exklusiva objekt</div>
            </div>

            <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-6 mb-12">
                {
                    properties.map((property) => (
                        <ProjectCard key={property.name} project={property} />
                    ))
                }
            </div>  
        </>
    )
}

export default CommercialProperties