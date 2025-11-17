import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatSidebar from "@/components/ChatSidebar";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ChatSidebarProvider, useChatSidebar } from "@/hooks/useChatSidebar";
import AdManagement from "./pages/AdManagement";
import AdminModeration from "./pages/AdminModeration";
import Advertising from "./pages/Advertising";
import AIHomestyling from "./pages/AIHomestyling";
import AIImageEditor from "./pages/AIImageEditor";
import AISokassistent from "./pages/AISokassistent";
import AITools from "./pages/AITools";
import Auth from "./pages/Auth";
import BankIdInfo from "./pages/BankIdInfo";
import BrokerLogin from "./pages/BrokerLogin";
import BrokerPortal from "./pages/BrokerPortal";
import BrokerProfile from "./pages/BrokerProfile";
import BrokerPropertyDetails from "./pages/BrokerPropertyDetails";
import Cookies from "./pages/Cookies";
import CreateRental from "./pages/CreateRental";
import DAC7Compliance from "./pages/DAC7Compliance";
import Dashboard from "./pages/Dashboard";
import DigitalaHyreskontrakt from "./pages/DigitalaHyreskontrakt";
import EditAd from "./pages/EditAd";
import EditRentalAd from "./pages/EditRentalAd";
import EnhancedSearch from "./pages/EnhancedSearch";
import FamilyGroups from "./pages/FamilyGroups";
import FragorSvar from "./pages/FragorSvar";
import FritidTomter from "./pages/FritidTomter";
import GdprInfo from "./pages/GdprInfo";
import Index from "./pages/Index";
import KommersiellFastighet from "./pages/KommersiellFastighet";
import Kommersiellt from "./pages/Kommersiellt";
import Kop from "./pages/Kop";
import Kostnadskalkylator from "./pages/Kostnadskalkylator";
import LogoPreview from "./pages/LogoPreview";
import LogoVariantsPreview from "./pages/LogoVariantsPreview";
import Map from "./pages/Map";
import MarketShareStats from "./pages/MarketShareStats";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Nyproduktion from "./pages/Nyproduktion";
import NyproduktionDetail from "./pages/NyproduktionDetail";
import OfficeProfile from "./pages/OfficeProfile";
import OmOss from "./pages/OmOss";
import PaymentSuccess from "./pages/PaymentSuccess";
import Prisanalys from "./pages/Prisanalys";
import Privacy from "./pages/Privacy";
import PrivateLogin from "./pages/PrivateLogin";
import Profile from "./pages/Profile";
import PropertyAd from "./pages/PropertyAd";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyManagement from "./pages/PropertyManagement";
import RentalAdManagement from "./pages/RentalAdManagement";
import RentalDetails from "./pages/RentalDetails";
import Rentals from "./pages/Rentals";
import SalesAdManagement from "./pages/SalesAdManagement";
import Salj from "./pages/Salj";
import Search from "./pages/Search";
import SearchResults from "./pages/SearchResults";
import SnartTillSalu from "./pages/SnartTillSalu";
import Support from "./pages/Support";
import Terms from "./pages/Terms";
import TillSalu from "./pages/TillSalu";
import Tools from "./pages/Tools";
import Upgrade from "./pages/Upgrade";

function AppContent() {
  const { isExpanded } = useChatSidebar();

  return (
    <>
      <ScrollToTop />
      <ChatSidebar />
      <div
        className={`transition-all duration-300 ${isExpanded ? "pl-80" : "pl-14"}`}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/kop" element={<Kop />} />
          <Route path="/salj" element={<Salj />} />
          <Route path="/nyproduktion" element={<Nyproduktion />} />
          <Route
            path="/nyproduktion/:projectId"
            element={<NyproduktionDetail />}
          />
          <Route path="/fritid-tomter" element={<FritidTomter />} />
          <Route path="/kommersiellt" element={<Kommersiellt />} />
          <Route path="/om-oss" element={<OmOss />} />
          <Route path="/familjekonton" element={<FamilyGroups />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/annonsering" element={<Advertising />} />
          <Route path="/smart-sokning" element={<EnhancedSearch />} />
          <Route path="/property-management" element={<PropertyManagement />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route
            path="/broker/property/:id"
            element={<BrokerPropertyDetails />}
          />
          <Route path="/rental/:id" element={<RentalDetails />} />
          <Route path="/annons/:id" element={<PropertyAd />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/till-salu" element={<TillSalu />} />
          <Route path="/snart-till-salu" element={<SnartTillSalu />} />
          <Route
            path="/kommersiella-fastigheter"
            element={<KommersiellFastighet />}
          />
          <Route path="/hyresbostader" element={<Rentals />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hantera-annons/:id" element={<AdManagement />} />
          <Route
            path="/hantera-uthyrning/:id"
            element={<RentalAdManagement />}
          />
          <Route
            path="/hantera-forsaljning/:id"
            element={<SalesAdManagement />}
          />
          <Route path="/redigera-annons/:adId" element={<EditAd />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/skapa-hyresannons" element={<CreateRental />} />
          <Route
            path="/redigera-hyresannons/:adId"
            element={<EditRentalAd />}
          />
          <Route path="/map" element={<Map />} />
          <Route path="/ai-bildredigering" element={<AIImageEditor />} />
          <Route path="/maklare-login" element={<BrokerLogin />} />
          <Route path="/login" element={<PrivateLogin />} />
          <Route path="/mäklarportal" element={<BrokerPortal />} />
          <Route path="/andelsstatistik" element={<MarketShareStats />} />
          <Route path="/ai-homestyling" element={<AIHomestyling />} />
          <Route path="/prisanalys" element={<Prisanalys />} />
          <Route
            path="/digitala-hyreskontrakt"
            element={<DigitalaHyreskontrakt />}
          />
          <Route path="/kostnadskalkylator" element={<Kostnadskalkylator />} />
          <Route path="/ai-sokassistent" element={<AISokassistent />} />
          <Route path="/logo-preview" element={<LogoPreview />} />
          <Route path="/logo-variants" element={<LogoVariantsPreview />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/bankid" element={<BankIdInfo />} />
          <Route path="/gdpr" element={<GdprInfo />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/dac7-compliance" element={<DAC7Compliance />} />
          <Route path="/admin/moderation" element={<AdminModeration />} />
          <Route path="/support" element={<Support />} />
          <Route path="/fragor-svar" element={<FragorSvar />} />
          <Route path="/maklare/:brokerId" element={<BrokerProfile />} />
          <Route path="/kontor/:officeId" element={<OfficeProfile />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={300}>
          <AuthProvider>
            <ChatSidebarProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </ChatSidebarProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
