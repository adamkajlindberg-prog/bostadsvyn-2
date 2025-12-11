import {
  CircleQuestionMarkIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import ContainerWrapper from "@/components/common/container-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { faqs } from "@/utils/constants";

const Faq = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <div className="flex items-center justify-center mb-4">
          <div className="inline-flex items-center bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5 gap-1.5">
            <CircleQuestionMarkIcon size={18} />
            Support & Hjälp
          </div>
        </div>

        <h1 className="text-4xl @lg:text-5xl text-primary text-center font-semibold tracking-tight leading-tight mb-4">
          Frågor & Svar
        </h1>
        <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
          Hittar du inte svaret du söker? Chatta med vår AI-supportbot som kan
          hjälpa dig direkt!
        </p>

        <div className="flex justify-center mb-10">
          <InputGroup className="max-w-2xl text-sm h-12">
            <InputGroupInput placeholder="Sök efter frågor..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex justify-center mb-14">
          <Button size="lg" className="rounded-full py-6 w-full max-w-72">
            <MessageCircleIcon />
            Chatta med AI-supportbot
            <SparklesIcon />
          </Button>
        </div>

        <div className="max-w-4xl flex flex-col mx-auto gap-8 mb-12">
          {faqs.map((faq) => (
            <Card key={`faqs-${faq.valueKey}`} className="pt-6 pb-2 shadow-xs">
              <CardContent className="px-6">
                <h3 className="text-xl @lg:text-2xl text-primary font-semibold tracking-tight mb-4">
                  {faq.title}
                </h3>

                <Accordion type="single" collapsible className="w-full">
                  {faq.items.map((item, index) => (
                    <AccordionItem
                      value={`${faq.valueKey}-${index + 1}`}
                      key={`${faq.valueKey}-${index}`}
                    >
                      <AccordionTrigger className="text-base cursor-pointer">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4">
                        <p className="text-muted-foreground">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="py-8 bg-primary/10 shadow-xs max-w-4xl mx-auto">
          <CardContent className="px-6">
            <h2 className="text-2xl @lg:text-3xl text-center font-semibold mb-4">
              Behöver du mer hjälp?
            </h2>
            <p className="text-sm @lg:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Vår AI-supportbot är tillgänglig dygnet runt för att svara på dina
              frågor. För komplexa ärenden kan du också kontakta vår mänskliga
              support.
            </p>
            <div className="flex flex-col @lg:flex-row flex-wrap gap-4 justify-center">
              <Button size="lg" className="w-full @lg:w-52 rounded-full">
                <MessageCircleIcon />
                AI-Support (24/7)
              </Button>
              <Link href="mailto:support@bostadsvyn.se" className="max-w-96">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full @lg:w-64 rounded-full"
                >
                  <MailIcon />
                  support@bostadsvyn.se
                </Button>
              </Link>
              <Link href="tel:+461234567" className="max-w-96">
                <Button
                  variant="outline"
                  className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-44 rounded-full"
                >
                  <PhoneIcon />
                  08-123 45 67
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </ContainerWrapper>
    </div>
  );
};

export default Faq;
