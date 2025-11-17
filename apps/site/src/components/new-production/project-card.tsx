import { JSX } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import bgImage from "@/images/bg-image.webp"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { MapPinIcon } from "lucide-react"

export type Project = {
    image: typeof bgImage
    badgeOneText: string
    badgeTwoText: string
    name: string
    location: string
    description: string
    price: string
    otherIcon?: JSX.Element
    otherInfo: string
    button: {
        icon?: JSX.Element
        text: string
        variant: React.ComponentProps<typeof Button>["variant"]
        className?: string
    }
}

const ProjectCard = ({project}: {project: Project}) => {
    return (
        <Card className="py-0 shadow-xs overflow-hidden">
            <CardContent className="px-0">
                <div className="relative h-48 bg-gray-100">
                    <Image src={project.image} alt="New production image" fill className="object-cover" />
                    <div className="bg-primary-deep absolute top-3.5 left-3.5 text-xs text-primary-foreground font-medium rounded-full px-3 py-1">{project.badgeOneText}</div>
                    <div className="bg-primary absolute top-3.5 right-3.5 text-xs text-primary-foreground font-medium rounded-full px-3 py-1">{project.badgeTwoText}</div>
                </div>

                <div className="py-6 px-6">
                    <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <MapPinIcon size={18} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div className="text-base text-muted-foreground">{project.location}</div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">{project.description}</p>

                    <div className="flex flex-wrap gap-2 items-center justify-between mb-6">
                        <div className="text-lg font-semibold">{project.price}</div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {project.otherIcon}
                            <div className="text-sm">{project.otherInfo}</div>
                        </div>
                    </div>

                    <Button size="lg" variant={project.button.variant} className={cn("w-full", project.button.className)}>
                        {project.button.icon} {project.button.text}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectCard