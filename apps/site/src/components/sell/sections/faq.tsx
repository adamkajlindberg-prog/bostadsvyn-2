import { Card, CardContent } from "@/components/ui/card"

const faqs = [
    {
        question: "Kan jag byta paket när som helst?",
        answer: "Ja, du kan uppgradera eller nedgradera ditt paket när som helst. Ändringar träder i kraft omedelbart."
    },
    {
        question: "Vad händer med mina annonser när jag nedgraderar?",
        answer: "Dina annonser fortsätter att köras men med funktionerna från din nya nivå. Premiumfunktioner kommer att inaktiveras."
    },
    {
        question: "Erbjuder ni återbetalning?",
        answer: "Vi erbjuder 30 dagars pengarna-tillbaka-garanti för alla premiumpaket om du inte är nöjd."
    }
]

const FAQ = () => {
    return (
        <Card className="py-6 shadow-xs mt-8">
            <CardContent className="px-6">
                <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight mb-6">Vanliga frågor</h3>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={`faq-${index}`}>
                            <div className="font-medium mb-1">{faq.question}</div>
                            <div className="text-sm text-muted-foreground">{faq.answer}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default FAQ