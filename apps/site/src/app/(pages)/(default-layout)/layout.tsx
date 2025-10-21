import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatSidebar from "@/components/chat-sidebar";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bostadsvyn",
  description: "Bostadsvyn - Framtidens bostadsportal | AI-Homestyling & Prisanalys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <SidebarProvider defaultOpen={false}>
          <ChatSidebar />
          <main className="w-full">
            <Header />
            {children}
            <Footer />
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
