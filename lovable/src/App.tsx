import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AITools from "./pages/AITools";
import PropertyManagement from "./pages/PropertyManagement";
import PropertyDetails from "./pages/PropertyDetails";
import BrokerPropertyDetails from "./pages/BrokerPropertyDetails";
import RentalDetails from "./pages/RentalDetails";
import Search from "./pages/Search";
import SearchResults from "./pages/SearchResults";
import Rentals from "./pages/Rentals";
import Dashboard from "./pages/Dashboard";
import AdManagement from "./pages/AdManagement";
import RentalAdManagement from "./pages/RentalAdManagement";
import SalesAdManagement from "./pages/SalesAdManagement";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Tools from "./pages/Tools";
import CreateRental from "./pages/CreateRental";
import EditRentalAd from "./pages/EditRentalAd";
import Map from "./pages/Map";
import AIImageEditor from "./pages/AIImageEditor";
import Advertising from "./pages/Advertising";
import EnhancedSearch from "./pages/EnhancedSearch";
import BrokerLogin from "./pages/BrokerLogin";
import PrivateLogin from "./pages/PrivateLogin";
import BrokerPortal from "./pages/BrokerPortal";
import EditAd from "./pages/EditAd";
import MarketShareStats from "./pages/MarketShareStats";
import Kop from "./pages/Kop";
import Salj from "./pages/Salj";
import Nyproduktion from "./pages/Nyproduktion";
import NyproduktionDetail from "./pages/NyproduktionDetail";
import FritidTomter from "./pages/FritidTomter";
import Kommersiellt from "./pages/Kommersiellt";
import OmOss from "./pages/OmOss";
import TillSalu from "./pages/TillSalu";
import SnartTillSalu from "./pages/SnartTillSalu";
import KommersiellFastighet from "./pages/KommersiellFastighet";
import FamilyGroups from "./pages/FamilyGroups";
import PropertyAd from "./pages/PropertyAd";
import NotFound from "./pages/NotFound";
import AIHomestyling from "./pages/AIHomestyling";
import Prisanalys from "./pages/Prisanalys";
import DigitalaHyreskontrakt from "./pages/DigitalaHyreskontrakt";
import Kostnadskalkylator from "./pages/Kostnadskalkylator";
import AISokassistent from "./pages/AISokassistent";
import LogoPreview from "./pages/LogoPreview";
import LogoVariantsPreview from "./pages/LogoVariantsPreview";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import BankIdInfo from "./pages/BankIdInfo";
import GdprInfo from "./pages/GdprInfo";
import Cookies from "./pages/Cookies";
import DAC7Compliance from "./pages/DAC7Compliance";
import AdminModeration from "./pages/AdminModeration";
import Support from "./pages/Support";
import FragorSvar from "./pages/FragorSvar";
import BrokerProfile from "./pages/BrokerProfile";
import OfficeProfile from "./pages/OfficeProfile";
import Upgrade from "./pages/Upgrade";
import PaymentSuccess from "./pages/PaymentSuccess";
import ChatSidebar from "@/components/ChatSidebar";
import ScrollToTop from "@/components/ScrollToTop";
import { ChatSidebarProvider, useChatSidebar } from "@/hooks/useChatSidebar";
 
function AppContent() {
  const { isExpanded } = useChatSidebar();
  
  return (
    <>
      <ScrollToTop />
      <ChatSidebar />
      <div className={`transition-all duration-300 ${isExpanded ? 'pl-80' : 'pl-14'}`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/kop" element={<Kop />} />
          <Route path="/salj" element={<Salj />} />
          <Route path="/nyproduktion" element={<Nyproduktion />} />
          <Route path="/nyproduktion/:projectId" element={<NyproduktionDetail />} />
          <Route path="/fritid-tomter" element={<FritidTomter />} />
          <Route path="/kommersiellt" element={<Kommersiellt />} />
          <Route path="/om-oss" element={<OmOss />} />
          <Route path="/familjekonton" element={<FamilyGroups />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/annonsering" element={<Advertising />} />
          <Route path="/smart-sokning" element={<EnhancedSearch />} />
          <Route path="/property-management" element={<PropertyManagement />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/broker/property/:id" element={<BrokerPropertyDetails />} />
          <Route path="/rental/:id" element={<RentalDetails />} />
          <Route path="/annons/:id" element={<PropertyAd />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/till-salu" element={<TillSalu />} />
          <Route path="/snart-till-salu" element={<SnartTillSalu />} />
          <Route path="/kommersiella-fastigheter" element={<KommersiellFastighet />} />
          <Route path="/hyresbostader" element={<Rentals />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hantera-annons/:id" element={<AdManagement />} />
          <Route path="/hantera-uthyrning/:id" element={<RentalAdManagement />} />
          <Route path="/hantera-forsaljning/:id" element={<SalesAdManagement />} />
          <Route path="/redigera-annons/:adId" element={<EditAd />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/skapa-hyresannons" element={<CreateRental />} />
          <Route path="/redigera-hyresannons/:adId" element={<EditRentalAd />} />
          <Route path="/map" element={<Map />} />
          <Route path="/ai-bildredigering" element={<AIImageEditor />} />
          <Route path="/maklare-login" element={<BrokerLogin />} />
          <Route path="/login" element={<PrivateLogin />} />
          <Route path="/mäklarportal" element={<BrokerPortal />} />
          <Route path="/andelsstatistik" element={<MarketShareStats />} />
          <Route path="/ai-homestyling" element={<AIHomestyling />} />
          <Route path="/prisanalys" element={<Prisanalys />} />
          <Route path="/digitala-hyreskontrakt" element={<DigitalaHyreskontrakt />} />
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
