import { CheckIcon, MailIcon, PhoneIcon, ShieldIcon } from "lucide-react"
import Link from "next/link"

const Footer = () => {
    return (
        <footer className="pt-12 pb-4 bg-nordic-midnight @container">
            <div className="container mx-auto px-6 @lg:px-8">
                <div className="flex w-full flex-col justify-between gap-10 @5xl:flex-row @5xl:items-start @5xl:text-left pb-2">
                    <div className="flex w-full @5xl:max-w-xs @8xl:max-w-lg flex-col justify-between gap-6 lg:items-start">
                        <Link href="/">
                            <h2 className="text-lg @lg:text-xl text-nordic-aurora font-semibold">Bostadsvyn.se</h2>
                        </Link>
                        <p className="text-sm text-nordic-mist max-w-[70%]">
                            Sveriges modernaste fastighetsportal med AI-teknologi och digital säkerhet.
                        </p>

                        <div className="flex items-center space-x-2">
                            <ShieldIcon size={20} className="text-nordic-sage" />
                            <p className="text-sm text-neutral-300">BankID-integrerad & GDPR-säker</p>
                        </div>
                    </div>

                    <div className="grid w-full gap-6 grid-cols-1 @lg:grid-cols-2 @5xl:grid-cols-3 lg:gap-10">
                        <div>
                            <h5 className="mb-4 text-nordic-fjord font-semibold">Juridisk Information</h5>
                            <ul className="text-muted-foreground space-y-3 text-sm">
                                <li className="text-neutral-300 hover:text-nordic-aurora font-medium">
                                    <Link href="/privacy">Integritetspolicy</Link>
                                </li>
                                <li className="text-neutral-300 hover:text-nordic-aurora font-medium">
                                    <Link href="/terms">Användarvillkor</Link>
                                </li>
                                <li className="text-neutral-300 hover:text-nordic-aurora font-medium">
                                    <Link href="/cookies">Cookie-policy</Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="mb-4 text-nordic-fjord font-semibold">Regleringar</h5>
                            <ul className="text-muted-foreground space-y-3 text-sm">
                                <li className="text-nordic-mist font-medium">
                                    &#x2713; Marknadsföringslagen (2008:486)
                                </li>
                                <li className="text-nordic-mist font-medium">
                                    &#x2713; GDPR-kompatibel
                                </li>
                                <li className="text-nordic-mist font-medium">
                                    &#x2713; FMI-reglerad marknadsföring
                                </li>
                                <li className="text-nordic-mist font-medium">
                                    &#x2713; EU eIDAS-förordningen
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="mb-4 text-nordic-fjord font-semibold">Kontakt</h5>
                            <ul className="text-muted-foreground space-y-3 text-sm">
                                <li className="text-neutral-300 font-medium">
                                    <Link href="mailto:info@bostadsvyn.se" className="inline-flex items-center gap-x-2 hover:text-nordic-aurora">
                                        <MailIcon size={16} /> info@bostadsvyn.se
                                    </Link>
                                </li>
                                <li className="text-xs text-nordic-mist font-medium">* AI-redigerade bilder är märkta som fotomontage enligt FMI:s riktlinjer</li>
                                <li className="text-xs text-nordic-mist font-medium">* Prisanalys är prognoser och garanterar ej faktiska marknadsvärden</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="text-nordic-mist text-center text-xs mt-6 border-t border-t-nordic-fjord/30 py-8 font-medium">
                    <p className="mb-1">&copy; 2024 Bostadsvyn AB. Alla rättigheter förbehållna. Org.nr: 559000-0000</p>
                    <p>Auktoriserad av Fastighetsmäklarinspektionen (FMI)</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer