"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { type FAQSection } from "@/utils/constants";

interface FaqAccordionProps {
  faqs: FAQSection[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  if (faqs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-muted-foreground text-lg">
          Inga resultat hittades. Försök att söka med andra ord.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl flex flex-col mx-auto gap-8 mb-12">
      {faqs.map((faq) => (
        <Card key={`faqs-${faq.valueKey}`} className="pt-6 pb-2 shadow-xs">
          <CardContent className="px-6">
            <h3 className="text-xl @lg:text-2xl text-primary font-semibold tracking-tight mb-4">
              {faq.title}
            </h3>

            <Accordion type="single" collapsible className="w-full">
              {faq.items.map((item, index) => {
                const itemId = `${faq.valueKey}-${index + 1}`;
                return (
                  <AccordionItem key={itemId} value={itemId}>
                    <AccordionTrigger className="text-base cursor-pointer">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4">
                      <p className="text-muted-foreground">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
