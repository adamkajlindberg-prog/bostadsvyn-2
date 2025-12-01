import ChatSidebar from "@/components/chat-sidebar";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <ChatSidebar />
      <main className="w-full">
        <Header />
        {children}
        <Footer />
      </main>
    </SidebarProvider>
  );
}
