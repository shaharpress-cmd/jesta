import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { JestiBuddy, type JestiVariant, type JestiCostume } from "@/components/JestiBuddy";

export function EmptyState({
  emoji,
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  className,
  buddyVariant = "cheer",
  buddyLabel,
  buddyCategory,
}: {
  emoji: string;
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
  buddyVariant?: JestiVariant;
  buddyLabel?: string;
  buddyCategory?: JestiCostume;
}) {
  const isCategory = buddyCategory && buddyCategory !== "brand";
  return (
    <div
      className={cn(
        "empty-state-wide card-soft anim-enter p-8 sm:p-10 text-center md:col-span-2 xl:col-span-3",
        className
      )}
    >
      <div className="mb-3 flex flex-col items-center gap-1">
        <JestiBuddy
          role={isCategory ? "category" : "brand"}
          category={buddyCategory}
          variant={buddyVariant}
          size="lg"
          hold
          label={buddyLabel}
        />
        <p className="text-3xl leading-none" aria-hidden>
          {emoji}
        </p>
      </div>
      <p className="font-bold text-charcoal">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-charcoal-muted">{body}</p>
      {(primaryHref || secondaryHref) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {primaryHref && primaryLabel && (
            <Link href={primaryHref} className="btn-pressable cta-coral !w-auto min-w-[10rem] px-5 !py-3 text-sm">
              {primaryLabel}
            </Link>
          )}
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="btn-pressable btn-outline-coral !w-auto min-w-[8rem] px-5 !py-3 text-sm"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export function PageFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("page-frame anim-page", className)}>{children}</div>;
}
