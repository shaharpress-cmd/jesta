import { cn } from "@/lib/utils";

export function FeedSkeleton({
  cards = 3,
  className,
}: {
  cards?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("feed-grid", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="טוען…"
    >
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          className="card-soft p-5 sm:p-6 space-y-3 animate-pulse"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="h-7 w-24 rounded-full bg-charcoal/[0.08]" />
            <div className="h-6 w-14 rounded-full bg-charcoal/[0.06]" />
          </div>
          <div className="h-5 w-[88%] rounded-lg bg-charcoal/[0.1]" />
          <div className="h-4 w-[62%] rounded-lg bg-charcoal/[0.07]" />
          <div className="flex items-center gap-2.5 border-t border-charcoal/[0.05] pt-3 mt-1">
            <div className="h-8 w-8 rounded-full bg-charcoal/[0.08]" />
            <div className="h-3.5 w-28 rounded bg-charcoal/[0.07]" />
          </div>
        </div>
      ))}
      <span className="sr-only">טוען תוכן…</span>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div
      className="page-pad space-y-5 pb-28 max-w-2xl mx-auto anim-page"
      role="status"
      aria-busy="true"
      aria-label="טוען ג׳סטה…"
    >
      <div className="flex justify-center">
        <div className="h-8 w-28 rounded-full bg-charcoal/[0.08] animate-pulse" />
      </div>
      <div className="mx-auto h-8 w-[80%] rounded-xl bg-charcoal/[0.1] animate-pulse" />
      <div className="flex justify-center gap-4">
        <div className="h-11 w-40 rounded-2xl bg-charcoal/[0.07] animate-pulse" />
        <div className="h-11 w-24 rounded-2xl bg-charcoal/[0.06] animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-charcoal/[0.07] animate-pulse" />
        <div className="h-4 w-[92%] rounded bg-charcoal/[0.06] animate-pulse" />
        <div className="h-4 w-[70%] rounded bg-charcoal/[0.05] animate-pulse" />
      </div>
      <div className="h-44 w-full rounded-3xl bg-charcoal/[0.06] animate-pulse" />
      <span className="sr-only">טוען…</span>
    </div>
  );
}

export function PageSpinner({ label = "מסנכרנים…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
      <div
        className="h-10 w-10 rounded-full border-2 border-coral/30 border-t-coral animate-spin"
        aria-hidden
      />
      <p className="text-sm font-medium text-charcoal">{label}</p>
    </div>
  );
}
