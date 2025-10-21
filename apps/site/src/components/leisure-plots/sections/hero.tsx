import { TreePalmIcon } from "lucide-react"

const Hero = () => {
    return (
        <>
            <div className="flex items-center justify-center flex-wrap gap-4 mb-4">
                <div className="bg-primary text-primary-foreground rounded-md p-3">
                    <TreePalmIcon className="h-6 w-6 @lg:h-8 @lg:w-8" />
                </div>
                <div className="bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5">Över 15,000 objekt</div>
            </div>

            <h1 className="text-4xl @lg:text-5xl text-primary text-center font-semibold tracking-tight leading-tight mb-4">Fritidshus & Tomter</h1>
            <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
                Upptäck din perfekta tillflyktsort. Från charmiga sommarstugor vid havet till skogsgläntor och fjälltomter där du kan bygga ditt drömhus för avkoppling och rekreation.
            </p>
        </>
    )
}

export default Hero