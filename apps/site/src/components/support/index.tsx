"use client";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CircleQuestionMarkIcon,
  MailIcon,
  PhoneIcon,
  SendIcon,
  TriangleAlertIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ContainerWrapper from "@/components/common/container-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const topItems = [
  {
    icon: <CircleQuestionMarkIcon />,
    title: "Vanliga frågor",
    description: "Hitta svar på de vanligaste frågorna om plattformen",
    link: {
      text: "Se FAQ",
      href: "#",
    },
  },
  {
    icon: <MailIcon />,
    title: "E-post",
    description: "Kontakta oss via e-post för icke-brådskande ärenden",
    link: {
      text: "support@bostadsvyn.se",
      href: "mailto:support@bostadsvyn.se",
    },
  },
  {
    icon: <PhoneIcon />,
    title: "Telefon",
    description: "Ring oss vardagar 09:00-17:00",
    link: {
      text: "010-123 45 67",
      href: "tel:+46101234567",
    },
  },
];

const reportTypes = [
  { value: "property", label: "Fastighet/Annons" },
  { value: "user", label: "Användare" },
  { value: "paid_ad", label: "Betalannons" },
  { value: "other", label: "Annat" },
];

const severityLevels = [
  { value: "low", label: "Låg" },
  { value: "medium", label: "Medel" },
  { value: "high", label: "Hög" },
  { value: "critical", label: "Kritisk" },
];

const Support = () => {
  const router = useRouter();

  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <div className="flex flex-col @2xl:flex-row @2xl:justify-between mb-10 gap-6">
          <div className="order-2 @2xl:order-1">
            <h2 className="text-2xl @lg:text-3xl font-semibold mb-2">
              Support & Hjälp
            </h2>
            <div className="text-sm @lg:text-base text-muted-foreground">
              Vi finns här för att hjälpa dig
            </div>
          </div>

          <Button
            variant="outline"
            className="order-1 @2xl:order-2 self-start"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon />
            Tillbaka
          </Button>
        </div>

        <div className="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-6 mb-8">
          {topItems.map((item) => (
            <Card key={item.title} className="py-6 shadow-xs">
              <CardContent className="px-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-6">
                    {item.icon}
                    <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    {item.description}
                  </p>
                </div>
                <Link href={item.link.href}>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-primary hover:border-transparent"
                  >
                    {item.link.text}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-6">
          <Card className="py-6 shadow-xs">
            <CardContent className="px-6">
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <TriangleAlertIcon />
                <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">
                  Rapportera problem
                </h3>
              </div>
              <p className="text-sm mb-6 text-muted-foreground">
                Hjälp oss hålla plattformen säker genom att rapportera missbruk
                eller problem
              </p>

              <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6 @lg:gap-4 mb-6">
                <div>
                  <Label className="text-sm font-medium mb-2">
                    Typ av rapport
                  </Label>
                  <Select defaultValue="property">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Välj minimiår" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2">
                    Allvarlighetsgrad
                  </Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Välj minimiår" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {severityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-6">
                <Label className="text-sm font-medium mb-2">Kategori</Label>
                <Input
                  type="text"
                  className="text-sm"
                  placeholder="t.ex. Bedrägeri, Vilseledande information, Spam"
                />
              </div>

              <div className="mb-6">
                <Label className="text-sm font-medium mb-2">
                  ID (valfritt)
                </Label>
                <Input
                  type="text"
                  className="text-sm"
                  placeholder="ID för fastighet, användare eller annons"
                />
              </div>

              <div className="mb-6">
                <Label className="text-sm font-medium mb-2">
                  Beskrivning *
                </Label>
                <Textarea
                  placeholder="Beskriv problemet i detalj..."
                  className="min-h-32 text-sm"
                />
              </div>

              <Button className="w-full mb-4">
                <SendIcon />
                Skicka rapport
              </Button>

              <p className="text-xs text-muted-foreground">
                Din rapport behandlas konfidentiellt och granskas av vårt
                moderationsteam.
              </p>
            </CardContent>
          </Card>

          <Card className="py-6 shadow-xs">
            <CardContent className="px-6">
              <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight mb-2">
                Tvistlösning
              </h3>
              <p className="text-sm mb-6 text-muted-foreground">
                Information om hur tvister hanteras
              </p>

              <div className="font-medium mb-2">
                Mellan hyresvärdar och hyresgäster
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Tvister mellan hyresvärd och hyresgäst hanteras enligt gällande
                hyreslagstiftning. Vi rekommenderar att först försöka lösa
                konflikten genom dialog.
              </p>

              <div className="font-medium mb-2">
                Allmänna reklamationsnämnden
              </div>
              <p className="text-sm text-muted-foreground mb-1.5">
                Om dialog inte fungerar kan du vända dig till Allmänna
                reklamationsnämnden (ARN) för hjälp med tv
              </p>
              <Link
                href="https://www.arn.se/"
                target="_blank"
                className="flex items-center gap-1 text-sm text-primary hover:underline underline-offset-2 mb-6"
              >
                Besök ARN:s webbplats
                <ArrowRightIcon size={14} />
              </Link>

              <div className="font-medium mb-2">Hyresnämnden</div>
              <p className="text-sm text-muted-foreground mb-1.5">
                För hyrestvister kan Hyresnämnden medla och hjälpa till att
                hitta en lösning.
              </p>
              <Link
                href="https://www.hyresnamnden.se/"
                target="_blank"
                className="flex items-center gap-1 text-sm text-primary hover:underline underline-offset-2 pb-4 border-b"
              >
                Besök Hyresnämndens webbplats
                <ArrowRightIcon size={14} />
              </Link>

              <p className="text-xs text-muted-foreground mt-4">
                Bostadsvyn AB fungerar som en plattform och ansvarar inte för
                transaktioner mellan användare. Alla försäljningar sker via
                licensierad fastighetsmäklare.
              </p>
            </CardContent>
          </Card>
        </div>
      </ContainerWrapper>
    </div>
  );
};

export default Support;
