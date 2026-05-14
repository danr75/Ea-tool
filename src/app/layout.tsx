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
        <div className="app-grid">
          <AppHeader />
          <main className="px-6 md:px-10 pb-16 pt-8 max-w-[1400px] w-full mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
