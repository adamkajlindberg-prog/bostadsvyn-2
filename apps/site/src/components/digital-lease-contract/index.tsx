import ContainerWrapper from "@/components/common/container-wrapper"
import { ShieldIcon } from "lucide-react"

const DigitalLeaseContract = () => {
    return (
        <div className="@container">
            <ContainerWrapper className="py-10">
                <div className="flex items-center justify-center mb-4">
                    <div className="inline-flex items-center bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5 gap-1.5">
                        <ShieldIcon size={18} />
                        Säker & Juridiskt bindande
                    </div>
                </div>

                <h1 className="text-4xl @lg:text-5xl text-center font-semibold tracking-tight leading-tight mb-4">Digitala Hyreskontrakt</h1>
                <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-16">
                    Säkra signeringar med BankID och automatiserade juridiska dokument för en smidig uthyrningsprocess
                </p>

                <h2 className="text-2xl @lg:text-3xl font-semibold mb-4 @lg:mb-8">Vad är digitala hyreskontrakt?</h2>
                <p className="text-sm @lg:text-base text-muted-foreground mb-4">
                    Våra digitala hyreskontrakt gör det enkelt, säkert och effektivt att hantera uthyrning. Istället för att träffas fysiskt för att 
                    skriva under papper kan både hyresvärd och hyresgäst signera digitalt med BankID - Sveriges mest betrodda e-legitimation. 
                    Hela processen är juridiskt bindande och följer svensk hyreslagstiftning.
                </p>
                <p className="text-sm @lg:text-base text-muted-foreground mb-16">
                    Systemet skapar automatiskt kompletta hyreskontrakt baserat på din information och gällande lagar. Du får mallar som är granskade 
                    av jurister, anpassningsbara efter dina behov, och automatisk lagring av alla dokument för framtida referens.
                </p>
            </ContainerWrapper>
        </div>
    )
}

export default DigitalLeaseContract