import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { RootProviders } from "@/components/root-providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bostadsvyn",
  description:
    "Bostadsvyn - Framtidens bostadsportal | AI-Homestyling & Prisanalys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
