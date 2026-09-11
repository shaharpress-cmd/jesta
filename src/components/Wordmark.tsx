import { cn } from "@/lib/utils";

const SIZE = {
  sm: "text-[1.35rem] sm:text-[1.45rem]",
  md: "text-[1.7rem] sm:text-[1.85rem]",
  lg: "text-[2.15rem] sm:text-[2.4rem]",
} as const;

const DOT = {
  sm: "h-1.5 w-1.5 -top-0.5",
  md: "h-1.5 w-1.5 -top-0.5",
  lg: "h-2 w-2 -top-0.5",
} as const;

/**
 * Latin primary wordmark with a coral accent-dot wink.
 * Optional small Hebrew «ג׳סטה» beside/under — Israeli cue, not the mark.
 */
export function Wordmark({
  size = "md",
  bilingual = false,
  bilingualPlacement = "under",
  className,
}: {
  size?: keyof typeof SIZE;
  bilingual?: boolean;
  bilingualPlacement?: "under" | "beside";
  className?: string;
}) {
  const mark = (
    <span
      dir="ltr"
      lang="en"
      className={cn(
        "relative inline-block font-black tracking-tight text-coral leading-none",
        SIZE[size]
      )}
    >
      Jesta
      <span
        aria-hidden
        className={cn(
          "absolute end-0 translate-x-1/3 rounded-full bg-coral",
          DOT[size]
        )}
      />
    </span>
  );

  const he = bilingual ? (
    <span
      className={cn(
        "font-semibold text-charcoal-muted tracking-wide leading-none",
        bilingualPlacement === "beside"
          ? "inline text-[11px] sm:text-xs"
          : size === "lg"
            ? "text-sm"
            : "text-[11px] sm:text-xs"
      )}
    >
      ג׳סטה
    </span>
  ) : null;

  if (!bilingual) {
    return (
      <span className={cn("inline-flex", className)} aria-label="Jesta">
        {mark}
      </span>
    );
  }

  if (bilingualPlacement === "beside") {
    return (
      <span
        className={cn("inline-flex items-baseline gap-2", className)}
        aria-label="Jesta ג׳סטה"
      >
        {mark}
        {he}
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex flex-col items-center gap-1", className)}
      aria-label="Jesta ג׳סטה"
    >
      {mark}
      {he}
    </span>
  );
}
