import { CalendarIcon, CircleCheckBigIcon, ClockIcon, StarIcon, UsersIcon, ZapIcon } from "lucide-react"
import bgImage from "@/images/bg-image.webp"
import ProjectCard, { Project } from "../project-card"

const projects: Project[] = [
    {
        image: bgImage,
        badgeOneText: "Lanseras Q2 2025",
        badgeTwoText: "15% sålt",
        name: "Nya Kajen",
        location: "Hammarby Sjöstad, Stockholm",
        description: "127 moderna lägenheter med spektakulär sjöutsikt. Från 2-5 rum med egen balkong eller terrass.",
        price: "Från 4,2M kr",
        otherIcon: <StarIcon size={16} fill="currentColor" className="fill-primary-light stroke-primary-light" />,
        otherInfo: "A+ energiklass",
        button: {
            icon: <CalendarIcon />,
            text: "Boka visning",
            variant: "default",
            className: ""
        }
    },
    {
        image: bgImage,
        badgeOneText: "Bygger nu",
        badgeTwoText: "68% sålt",
        name: "Villastad Syd",
        location: "Nacka, Stockholm",
        description: "45 exklusiva villor i naturnära miljö. Moderna arkitektoniska lösningar med hållbarhetsfokus.",
        price: "Från 8,9M kr",
        otherIcon: <ZapIcon size={16} className="text-primary-light" />,
        otherInfo: "Solceller inkl.",
        button: {
            icon: <UsersIcon />,
            text: "Intresseanmälan",
            variant: "outline",
            className: "border border-primary text-primary hover:border-transparent"
        }
    },
    {
        image: bgImage,
        badgeOneText: "Inflyttning 2025",
        badgeTwoText: "42% sålt",
        name: "Centrum Park",
        location: "Centrum, Göteborg",
        description: "89 lägenheter i hjärtat av Göteborg. Närhet till kollektivtrafik och stadens alla faciliteter.",
        price: "Från 3,1M kr",
        otherIcon: <CircleCheckBigIcon size={16} className="text-primary-light" />,
        otherInfo: "BRF bildad",
        button: {
            icon: <ClockIcon />,
            text: "Se tillgängliga",
            variant: "default",
        }
    }
]

const Projects = () => {
    return (
        <>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">Utvalda projekt</h3>
                <div className="text-xs text-primary-foreground text-center font-semibold bg-primary rounded-full px-3 py-1">Lanseras snart</div>
            </div>

            <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-6 mb-12">
                {
                    projects.map((project) => (
                        <ProjectCard key={project.name} project={project} />
                    ))
                }
            </div>        
        </>
    )
}

export default Projects