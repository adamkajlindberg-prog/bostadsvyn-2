import {
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const documents = [
  {
    icon: FileText,
    title: "Allmänna villkor",
    description: "Användarvillkor och regler för plattformen",
    link: "/terms",
    iconColor: "text-primary",
  },
  {
    icon: Eye,
    title: "Integritetspolicy",
    description: "Hur vi hanterar dina personuppgifter",
    link: "/privacy",
    iconColor: "text-premium",
  },
  {
    icon: Shield,
    title: "Cookie-policy",
    description: "Information om cookies och spårning",
    link: "/cookies",
    iconColor: "text-success",
  },
  {
    icon: Users,
    title: "Support & Tvistlösning",
    description: "Kontakta oss eller rapportera problem",
    link: "/support",
    iconColor: "text-accent",
  },
];

const compliances = [
  "Marknadsföringslagen (2008:486)",
  "GDPR (EU 2016/679)",
  "DAC7-direktivet",
  "EU eIDAS-förordningen",
  "Fastighetsmäklarlagen",
  "Bokföringslagen",
];

const LegalDocuments = () => {
  return (
    <div className="mb-16">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            Juridiska dokument & policyer
          </CardTitle>
          <p className="text-sm text-foreground">
            Läs våra policyer och villkor för att förstå hur vi hanterar dina
            uppgifter och vilka rättigheter du har som användare.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((document, index) => {
              const IconComponent = document.icon;
              return (
                <Link
                  key={`document-${index}`}
                  href={document.link}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 hover:bg-accent/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`h-5 w-5 ${document.iconColor}`} />
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {document.title}
                      </h4>
                      <p className="text-xs text-foreground">
                        {document.description}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-foreground/60 group-hover:text-primary transition-colors" />
                </Link>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Regelefterlevnad
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-foreground">
              {compliances.map((compliance, index) => (
                <div
                  key={`compliance-${index}`}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>{compliance}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalDocuments;
