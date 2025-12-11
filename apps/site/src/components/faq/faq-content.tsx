"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FAQ_PAGE_CONFIG, faqs, type FAQSection } from "@/utils/constants";
import { FaqAccordion } from "./faq-accordion";

export function FaqContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqs;
    }

    const query = searchQuery.toLowerCase().trim();

    return faqs
      .map((section) => {
        const filteredItems = section.items.filter(
          (item) =>
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query),
        );

        if (filteredItems.length === 0) {
          return null;
        }

        return {
          ...section,
          items: filteredItems,
        };
      })
      .filter((section): section is FAQSection => section !== null);
  }, [searchQuery]);

  return (
    <>
      <div className="flex justify-center mb-10">
        <InputGroup className="max-w-2xl text-sm h-12">
          <InputGroupInput
            placeholder={FAQ_PAGE_CONFIG.search.placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <FaqAccordion faqs={filteredFaqs} />
    </>
  );
}
