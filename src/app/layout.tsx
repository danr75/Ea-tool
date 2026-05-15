import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "@/components/shell/AppHeader";

export const metadata: Metadata = {
  title: "Enterprise Architecture Intelligence",
  description:
    "Navigate, evolve and assess the impact of emerging capabilities on your enterprise architecture.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:rounded-md focus:bg-ink-900 focus:text-white focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <div className="app-grid">
          <AppHeader />
          <main
            id="main"
            className="px-4 sm:px-6 md:px-10 pb-16 pt-6 sm:pt-8 max-w-[1400px] w-full mx-auto"
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
