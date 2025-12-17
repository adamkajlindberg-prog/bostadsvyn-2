import { CircleQuestionMarkIcon } from "lucide-react";
import { FAQ_PAGE_CONFIG } from "@/utils/constants";

export function FaqHero() {
  return (
    <>
      <div className="flex items-center justify-center mb-4">
        <div className="inline-flex items-center bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5 gap-1.5">
          <CircleQuestionMarkIcon size={18} />
          {FAQ_PAGE_CONFIG.badge.text}
        </div>
      </div>

      <h1 className="text-4xl @lg:text-5xl text-primary text-center font-semibold tracking-tight leading-tight mb-4">
        {FAQ_PAGE_CONFIG.hero.title}
      </h1>
      <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
        {FAQ_PAGE_CONFIG.hero.description}
      </p>
    </>
  );
}
