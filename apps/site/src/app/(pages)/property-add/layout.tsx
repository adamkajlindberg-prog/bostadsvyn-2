import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/auth/server-session";
import ChatSidebar from "@/components/chat-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Bostadsvyn",
  description:
    "Bostadsvyn - Framtidens bostadsportal | AI-Homestyling & Prisanalys",
};

export default async function PropertyAddLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <ChatSidebar />
      <main className="w-full bg-neutral-200/30 min-h-svh">
        <Toaster position="top-center" />
        {children}
      </main>
    </SidebarProvider>
  );
}
