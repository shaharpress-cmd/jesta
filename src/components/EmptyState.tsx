import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  emoji,
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  className,
}: {
  emoji: string;
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card-soft anim-enter p-8 text-center md:col-span-2 xl:col-span-3",
        className
      )}
    >
      <p className="mb-2 text-4xl" aria-hidden>
        {emoji}
      </p>
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
