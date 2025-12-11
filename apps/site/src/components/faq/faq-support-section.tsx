import Link from "next/link";
import { MailIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FAQ_PAGE_CONFIG } from "@/utils/constants";

export function FaqSupportSection() {
  return (
    <Card className="py-8 bg-primary/10 shadow-xs max-w-4xl mx-auto">
      <CardContent className="px-6">
        <h2 className="text-2xl @lg:text-3xl text-center font-semibold mb-4">
          {FAQ_PAGE_CONFIG.support.title}
        </h2>
        <p className="text-sm @lg:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          {FAQ_PAGE_CONFIG.support.description}
        </p>
        <div className="flex flex-col @lg:flex-row flex-wrap gap-4 justify-center">
          <Button size="lg" className="w-full @lg:w-52 rounded-full">
            <MessageCircleIcon />
            {FAQ_PAGE_CONFIG.buttons.aiSupport}
          </Button>
          <Link href={`mailto:${FAQ_PAGE_CONFIG.support.contact.email}`} className="max-w-96">
            <Button
              variant="outline"
              size="lg"
              className="w-full @lg:w-64 rounded-full"
            >
              <MailIcon />
              {FAQ_PAGE_CONFIG.support.contact.email}
            </Button>
          </Link>
          <Link href={FAQ_PAGE_CONFIG.support.contact.phoneHref} className="max-w-96">
            <Button
              variant="outline"
              className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-44 rounded-full"
            >
              <PhoneIcon />
              {FAQ_PAGE_CONFIG.support.contact.phone}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
