"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type JestiVariant = "idle" | "wave" | "cheer";

type Size = "sm" | "md" | "lg";

const SIZE_PX: Record<Size, number> = {
  sm: 44,
  md: 64,
  lg: 80,
};

/**
 * Soft cream/coral companion blob «ג׳סטי» — decorative wink-face
 * echoing the Wordmark coral wink-dot. Calm, no speech balloons.
 */
export function JestiBuddy({
  variant = "idle",
  size = "md",
  className,
  label,
}: {
  variant?: JestiVariant;
  size?: Size;
  className?: string;
  /** Optional visible caption under the buddy (still decorative overall) */
  label?: string;
}) {
  const [motion, setMotion] = useState(variant);

  useEffect(() => {
    setMotion(variant);
    if (variant === "idle") return;
    const t = window.setTimeout(() => setMotion("idle"), 480);
    return () => window.clearTimeout(t);
  }, [variant]);

  const px = SIZE_PX[size];

  return (
    <div
      className={cn(
        "jesti-buddy pointer-events-none select-none inline-flex flex-col items-center gap-1",
        className
      )}
      aria-hidden
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "jesti-svg drop-shadow-sm",
          motion === "wave" && "jesti-anim-wave",
          motion === "cheer" && "jesti-anim-cheer",
          motion === "idle" && "jesti-anim-idle"
        )}
      >
        {/* Soft cream blob body */}
        <ellipse cx="40" cy="44" rx="28" ry="26" fill="#FBF7F2" />
        <ellipse
          cx="40"
          cy="44"
          rx="28"
          ry="26"
          fill="url(#jestiBlob)"
          opacity="0.92"
        />
        {/* Soft coral cheek blush */}
        <ellipse cx="24" cy="48" rx="5" ry="3.2" fill="#F4A48C" opacity="0.45" />
        <ellipse cx="56" cy="48" rx="5" ry="3.2" fill="#F4A48C" opacity="0.45" />
        {/* Eyes — left open, right wink (Israeli wink vibe) */}
        <circle cx="30" cy="40" r="3.2" fill="#3D405B" />
        <path
          d="M50 38.5c2.2 1.6 4.6 1.6 6.8 0"
          stroke="#3D405B"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Soft smile */}
        <path
          d="M32 52c2.8 3.6 13.2 3.6 16 0"
          stroke="#E07A5F"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Coral wink-dot accent (echoes Wordmark) */}
        <circle cx="58" cy="22" r="4.5" fill="#E07A5F" className="jesti-wink-dot" />
        {/* Tiny highlight on wink-dot */}
        <circle cx="56.5" cy="20.5" r="1.3" fill="#fff" opacity="0.7" />
        {/* Soft arm for wave/cheer — decorative bump */}
        <ellipse
          cx="14"
          cy="46"
          rx="6"
          ry="5"
          fill="#FCE8E2"
          className="jesti-arm"
          opacity="0.95"
        />
        <defs>
          <radialGradient id="jestiBlob" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#F7F1EA" />
            <stop offset="100%" stopColor="#FCE8E2" />
          </radialGradient>
        </defs>
      </svg>
      {label ? (
        <span className="text-[10px] font-semibold tracking-wide text-charcoal-muted/80">
          {label}
        </span>
      ) : null}
    </div>
  );
}
