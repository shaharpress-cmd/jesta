import { Info } from "lucide-react";
import { TIPS_DISCLAIMER_BLOCK } from "@/lib/tips";
import { cn } from "@/lib/utils";

/** Mandatory visible disclaimer on every tips page / tip card surface */
export function TipsDisclaimer({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "rounded-3xl safety-amber px-4 py-3.5 text-sm text-charcoal/90 leading-relaxed",
        className
      )}
      role="note"
    >
      <div className="flex items-start gap-2.5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700/70" aria-hidden />
        <p>{TIPS_DISCLAIMER_BLOCK}</p>
      </div>
    </aside>
  );
}
