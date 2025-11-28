import React from 'react';
import { Shield, FileText, Eye, Phone } from 'lucide-react';
const LegalFooter = () => {
  return <footer className="bg-nordic-midnight text-nordic-snow py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-nordic-aurora">Bostadsvyn.se</h3>
            <p className="text-sm text-nordic-mist">
              Sveriges modernaste fastighetsportal med AI-teknologi och digital säkerhet.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-nordic-sage" />
              <span>BankID-integrerad & GDPR-säker</span>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-nordic-fjord">Juridisk Information</h4>
            <div className="space-y-2 text-sm">
              <a href="/privacy" className="flex items-center gap-2 hover:text-nordic-aurora transition-colors">
                <Eye className="h-3 w-3" />
                Integritetspolicy
              </a>
              <a href="/terms" className="flex items-center gap-2 hover:text-nordic-aurora transition-colors">
                <FileText className="h-3 w-3" />
                Användarvillkor
              </a>
              <a href="/cookies" className="flex items-center gap-2 hover:text-nordic-aurora transition-colors">
                <FileText className="h-3 w-3" />
                Cookie-policy
              </a>
            </div>
          </div>

          {/* Regulatory Compliance */}
          <div className="space-y-3">
            <h4 className="font-semibold text-nordic-fjord">Regleringar</h4>
            <div className="space-y-2 text-sm text-nordic-mist">
              <p>✓ Marknadsföringslagen (2008:486)</p>
              <p>✓ GDPR-kompatibel</p>
              <p>✓ FMI-reglerad marknadsföring</p>
              <p>✓ EU eIDAS-förordningen</p>
            </div>
          </div>

          {/* Contact & Disclaimers */}
          <div className="space-y-3">
            <h4 className="font-semibold text-nordic-fjord">Kontakt</h4>
            <div className="space-y-2 text-sm">
              <a href="mailto:info@bostadsvyn.se" className="flex items-center gap-2 hover:text-nordic-aurora transition-colors">
                <Phone className="h-3 w-3" />
                info@bostadsvyn.se
              </a>
            </div>
            <div className="text-xs text-nordic-mist space-y-1 mt-4">
              <p>* AI-redigerade bilder är märkta som fotomontage enligt FMI:s riktlinjer</p>
              <p>* Prisanalys är prognoser och garanterar ej faktiska marknadsvärden</p>
            </div>
          </div>
        </div>

        <div className="border-t border-nordic-mist/20 mt-8 pt-6 text-center text-xs text-nordic-mist">
          <p>© 2025 Bostadsvyn Sverige AB. Alla rättigheter förbehållna. Org.nr: 559551-3176</p>
          
        </div>
      </div>
    </footer>;
};
export default LegalFooter;