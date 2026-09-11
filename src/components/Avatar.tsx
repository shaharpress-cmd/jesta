"use client";

import { cn } from "@/lib/utils";

export function Avatar({
  src,
  name,
  size = "md",
  online,
  verified,
  className,
}: {
  src: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  verified?: boolean;
  className?: string;
}) {
  const sizes = {
    sm: "h-9 w-9",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };
  const dots = {
    sm: "h-2.5 w-2.5",
    md: "h-3 w-3",
    lg: "h-3.5 w-3.5",
    xl: "h-4 w-4",
  };

  return (
    <div className={cn("relative shrink-0", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover ring-2 ring-white",
          sizes[size]
        )}
      />
      {online && (
        <span
          className={cn(
            "absolute bottom-0 left-0 rounded-full bg-sage ring-2 ring-white",
            dots[size]
          )}
        />
      )}
      {verified && size !== "sm" && (
        <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-white text-[8px]">
          ✓
        </span>
      )}
    </div>
  );
}
