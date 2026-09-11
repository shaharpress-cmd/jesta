"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

export type JestiVariant =
  | "idle"
  | "wave"
  | "cheer"
  | "help"
  | "seek"
  | "wait";

type Size = "sm" | "md" | "lg";

const SIZE_PX: Record<Size, number> = {
  sm: 44,
  md: 64,
  lg: 80,
};

/** Default Hebrew captions (≤18 chars). Pass label="" to hide. */
export const JESTI_CAPTIONS: Partial<Record<JestiVariant, string>> = {
  wave: "היי",
  cheer: "כל הכבוד",
  help: "אני פה",
  seek: "מחפשים יחד",
  wait: "עוד רגע",
};

/**
 * Soft cream/coral companion blob «ג׳סטי» — contextual wink-face
 * echoing the Wordmark coral wink-dot. Calm poses; short Hebrew captions.
 */
export function JestiBuddy({
  variant = "idle",
  size = "md",
  className,
  label,
  hold = false,
}: {
  variant?: JestiVariant;
  size?: Size;
  className?: string;
  /** Optional visible caption (≤18 Hebrew chars). undefined = default for variant; "" = none */
  label?: string;
  /** Keep pose animation (don't settle back to idle) — for contextual sticky moods */
  hold?: boolean;
}) {
  const rawId = useId();
  const gid = `jestiBlob-${rawId.replace(/:/g, "")}`;
  const [motion, setMotion] = useState(variant);

  useEffect(() => {
    setMotion(variant);
    if (hold || variant === "idle" || variant === "wait" || variant === "seek" || variant === "help") {
      return;
    }
    const t = window.setTimeout(() => setMotion("idle"), 450);
    return () => window.clearTimeout(t);
  }, [variant, hold]);

  const px = SIZE_PX[size];
  const caption =
    label === undefined
      ? JESTI_CAPTIONS[variant]
      : label.length > 0
        ? label
        : undefined;

  const isHelp = motion === "help";
  const isSeek = motion === "seek";
  const isWait = motion === "wait";
  const isCheer = motion === "cheer";

  // Eyes: seek looks up; wait soft half-lids; help lean slightly via transform on group
  const leftEyeCy = isSeek ? 36 : 40;
  const rightWinkY = isSeek ? 34.5 : 38.5;
  const smileD = isCheer
    ? "M30 51c3.2 5 16.8 5 20 0"
    : isWait
      ? "M34 52c2 2.2 10 2.2 12 0"
      : isSeek
        ? "M33 53c2.4 2.8 11.6 2.8 14 0"
        : "M32 52c2.8 3.6 13.2 3.6 16 0";

  return (
    <div
      className={cn(
        "jesti-buddy pointer-events-none select-none inline-flex flex-col items-center gap-1",
        className
      )}
      aria-hidden={caption ? undefined : true}
      role={caption ? "img" : undefined}
      aria-label={caption ? `ג׳סטי — ${caption}` : undefined}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className={cn(
          "jesti-svg drop-shadow-sm",
          motion === "wave" && "jesti-anim-wave",
          motion === "cheer" && "jesti-anim-cheer",
          motion === "idle" && "jesti-anim-idle",
          motion === "help" && "jesti-anim-help",
          motion === "seek" && "jesti-anim-seek",
          motion === "wait" && "jesti-anim-wait"
        )}
      >
        <g className={cn(isHelp && "jesti-lean")}>
          {/* Soft cream blob body */}
          <ellipse cx="40" cy="44" rx="28" ry="26" fill="#FBF7F2" />
          <ellipse
            cx="40"
            cy="44"
            rx="28"
            ry="26"
            fill={`url(#${gid})`}
            opacity="0.92"
          />
          {/* Soft coral cheek blush */}
          <ellipse cx="24" cy="48" rx="5" ry="3.2" fill="#F4A48C" opacity="0.45" />
          <ellipse cx="56" cy="48" rx="5" ry="3.2" fill="#F4A48C" opacity="0.45" />

          {/* Eyes */}
          {isWait ? (
            <>
              <path
                d="M26 40c1.8 1.4 5.2 1.4 7 0"
                stroke="#3D405B"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M47 40c1.8 1.4 5.2 1.4 7 0"
                stroke="#3D405B"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <>
              <circle cx="30" cy={leftEyeCy} r="3.2" fill="#3D405B" />
              {isSeek && (
                <circle cx="30.8" cy={leftEyeCy - 0.8} r="0.9" fill="#fff" opacity="0.85" />
              )}
              <path
                d={`M50 ${rightWinkY}c2.2 1.6 4.6 1.6 6.8 0`}
                stroke="#3D405B"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {/* Soft smile */}
          <path
            d={smileD}
            stroke="#E07A5F"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Coral wink-dot accent (echoes Wordmark) */}
          <circle
            cx={isSeek ? 56 : 58}
            cy={isSeek ? 18 : 22}
            r="4.5"
            fill="#E07A5F"
            className="jesti-wink-dot"
          />
          <circle
            cx={isSeek ? 54.5 : 56.5}
            cy={isSeek ? 16.5 : 20.5}
            r="1.3"
            fill="#fff"
            opacity="0.7"
          />

          {/* Soft arm bump — wave / cheer / idle */}
          {!isHelp && (
            <ellipse
              cx="14"
              cy="46"
              rx="6"
              ry="5"
              fill="#FCE8E2"
              className="jesti-arm"
              opacity="0.95"
            />
          )}

          {/* Helping hand — outstretched path */}
          {isHelp && (
            <g className="jesti-hand">
              <path
                d="M12 48c-2 1-4 4-3 7 1 2.5 4 3.5 6.5 2.5 1.2-.5 2-1.2 3-2.2"
                stroke="#F4A48C"
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.95"
              />
              <path
                d="M12 48c-2 1-4 4-3 7 1 2.5 4 3.5 6.5 2.5 1.2-.5 2-1.2 3-2.2"
                stroke="#FCE8E2"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* palm hint */}
              <ellipse cx="9.5" cy="56" rx="4.2" ry="3.6" fill="#FCE8E2" />
              <ellipse cx="9.5" cy="56" rx="4.2" ry="3.6" fill="#F4A48C" opacity="0.35" />
            </g>
          )}

          {/* Seek — tiny hopeful sparkle near eyes */}
          {isSeek && (
            <path
              d="M42 28l0.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z"
              fill="#E07A5F"
              opacity="0.7"
              className="jesti-spark"
            />
          )}
        </g>

        <defs>
          <radialGradient id={gid} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#F7F1EA" />
            <stop offset="100%" stopColor="#FCE8E2" />
          </radialGradient>
        </defs>
      </svg>
      {caption ? (
        <span className="text-[10px] font-semibold tracking-wide text-charcoal-muted/80 max-w-[5.5rem] text-center leading-tight">
          {caption}
        </span>
      ) : null}
    </div>
  );
}
