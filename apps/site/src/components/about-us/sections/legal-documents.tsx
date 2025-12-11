import { CheckCircle2, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { legalDocuments, complianceItems } from "../data/legal-documents";
import { legalDocumentsHeader } from "../data/content";
import { getIcon } from "../utils/icon-map";

const LegalDocuments = () => {
  return (
    <section className="mb-16" aria-labelledby="legal-documents-title">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle
            id="legal-documents-title"
            className="flex items-center gap-3"
          >
            <FileText className="h-6 w-6 text-primary" />
            {legalDocumentsHeader.title}
          </CardTitle>
          <p className="text-sm text-foreground">
            {legalDocumentsHeader.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legalDocuments.map((document) => {
              const IconComponent = getIcon(document.iconName);
              return (
                <Link
                  key={document.id}
                  href={document.link}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 hover:bg-accent/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <IconComponent
                      className={`h-5 w-5 ${document.iconColor}`}
                    />
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
              {complianceItems.map((compliance) => (
                <div key={compliance.id} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>{compliance.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default LegalDocuments;
