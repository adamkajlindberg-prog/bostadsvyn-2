import ContainerWrapper from "@/components/common/container-wrapper"
import { Card, CardContent } from "@/components/ui/card"
import { LockIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const BrokerPortal = () => {
    return (
        <div className="@container">
            <ContainerWrapper className="py-48">
                <Card className="py-8 shadow-xs max-w-2xl mx-auto">
                    <CardContent className="px-6">
                        <div className="flex justify-center mb-4">
                            <LockIcon size={36} className="text-muted-foreground" />
                        </div>
                        <h3 className="tezt-xl @lg:text-2xl text-center font-semibold mb-2">Logga in för mäklarportalen</h3>
                        <p className="text-sm @lg:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8">
                            Du behöver vara inloggad för att komma åt mäklarportalen.
                        </p>
                        <div className="flex justify-center">
                            <Link href="/login">
                                <Button className="py-5 hover:border-transparent w-full @lg:w-auto">Mäklarinloggning</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </ContainerWrapper>
        </div>
    )
}

export default BrokerPortal