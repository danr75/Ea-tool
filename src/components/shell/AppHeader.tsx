import Link from "next/link";
import { Compass } from "lucide-react";
import { PrimaryNav } from "./PrimaryNav";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-ink-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-ink-900 text-white grid place-items-center shadow-card">
            <Compass size={16} strokeWidth={2.2} />
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
              Enterprise Architecture
            </span>
            <span className="text-sm font-semibold text-ink-900">
              Intelligence Platform
            </span>
          </span>
        </Link>
        <PrimaryNav />
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden md:inline text-xs text-ink-400">
            Current state · v2026.05
          </span>
          <span className="w-8 h-8 rounded-full bg-ink-100 text-ink-600 text-xs font-medium grid place-items-center">
            CIO
          </span>
        </div>
      </div>
    </header>
  );
}
