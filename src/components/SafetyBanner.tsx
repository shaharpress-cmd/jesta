import { ShieldAlert, Heart } from "lucide-react";
import { SAFETY } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function SafetyBanner({
  variant = "tip",
  className,
}: {
  variant?: "tip" | "chat" | "footer";
  className?: string;
}) {
  if (variant === "footer") {
    return (
      <p
        className={cn(
          "flex items-start justify-center gap-2 text-center text-[11px] text-charcoal-light leading-relaxed px-2",
          className
        )}
      >
        <Heart className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral/60" />
        <span>
          {SAFETY.tipsDisclaimer} {SAFETY.intermediary}
        </span>
      </p>
    );
  }

  if (variant === "chat") {
    return (
      <div
        className={cn(
          "flex items-start gap-2 rounded-2xl safety-amber px-3.5 py-2.5 text-xs text-charcoal/90",
          className
        )}
      >
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700/70" />
        <p>
          אל תשתפו{" "}
          <strong className="text-coral-dark font-semibold">כתובת מדויקת</strong> עד שאתם
          מרגישים בנוח • דווח/חסום זמינים
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-3xl safety-amber px-4 py-3.5 text-sm text-charcoal/90",
        className
      )}
    >
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700/70" />
      <p>{SAFETY.publicPlace}</p>
    </div>
  );
}
