import ChatSidebar from "@/components/chat-sidebar";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import SkipToContent from "@/components/common/skip-to-content";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <SkipToContent />
      <ChatSidebar />
      <main id="main-content" className="w-full" role="main">
        <Header />
        {children}
        <Footer />
      </main>
    </SidebarProvider>
  );
}
