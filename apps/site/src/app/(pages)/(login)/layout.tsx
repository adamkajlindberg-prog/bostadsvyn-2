import type { Metadata } from "next";
import ChatSidebar from "@/components/chat-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Bostadsvyn",
  description:
    "Bostadsvyn - Framtidens bostadsportal | AI-Homestyling & Prisanalys",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <ChatSidebar />
      <main className="w-full bg-neutral-200/30 min-h-svh">{children}</main>
    </SidebarProvider>
  );
}
