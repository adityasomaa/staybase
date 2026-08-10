import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "STAYBASE — Property Management System",
    template: "%s · STAYBASE",
  },
  description:
    "STAYBASE is a modern property management system for independent hotels and villas, with native Channex channel-manager connectivity.",
  applicationName: "STAYBASE",
  keywords: ["PMS", "hotel software", "channel manager", "Channex", "revenue management"],
};

/** One canvas — the app has no dark theme, so the browser chrome matches it. */
export const viewport: Viewport = { themeColor: "#f7f9fa" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
