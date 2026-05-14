import type { MaturityLevel } from "@/lib/types";
import { maturityLabel } from "@/lib/format";

const colors: Record<MaturityLevel, string> = {
  emerging: "bg-signal-replace",
  developing: "bg-signal-enhance",
  established: "bg-signal-new",
  core: "bg-ink-700",
};

export function MaturityDot({ level }: { level: MaturityLevel }) {
  return (
    <span
      title={`${maturityLabel[level]} maturity`}
      className={`inline-block w-1.5 h-1.5 rounded-full ${colors[level]}`}
    />
  );
}
