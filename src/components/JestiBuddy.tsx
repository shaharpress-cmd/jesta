"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
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
  sm: 56,
  md: 88,
  lg: 112,
};

/** Default Hebrew captions (≤18 chars). Pass label="" to hide. */
export const JESTI_CAPTIONS: Partial<Record<JestiVariant, string>> = {
  wave: "היי",
  cheer: "כל הכבוד",
  help: "אני פה",
  seek: "מחפשים יחד",
  wait: "עוד רגע",
};

const CORAL = "#E07A5F";
const CORAL_DEEP = "#C96A50";
const CHARCOAL = "#3D405B";
const CREAM = "#F7F1E8";
const WHITE = "#FFFFFF";

/**
 * «ג׳סטי» — calm adult-warm helper person (Concept B).
 * Coral sweater, cream face, charcoal pants/outlines, white sticker rim.
 * Distinct arm poses per variant — not a blob.
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
  const uid = rawId.replace(/:/g, "");
  const sweaterGrad = `jestiSweater-${uid}`;
  const [motion, setMotion] = useState(variant);

  useEffect(() => {
    setMotion(variant);
    if (
      hold ||
      variant === "idle" ||
      variant === "wait" ||
      variant === "seek" ||
      variant === "help"
    ) {
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
  const isWave = motion === "wave";

  // Face: seek looks slightly up; cheer a touch wider smile
  const eyeCy = isSeek ? 30 : 33;
  const winkY = isSeek ? 29 : 32;
  const smileD = isCheer
    ? "M52 42c1.8 2.4 12.4 2.4 14.2 0"
    : isWait
      ? "M54 42.5c1.2 1.2 9.6 1.2 10.8 0"
      : "M53 42c1.6 1.9 11 1.9 12.6 0";

  return (
    <div
      className={cn(
        "jesti-buddy pointer-events-none select-none inline-flex flex-col items-center gap-1.5",
        className
      )}
      aria-hidden={caption ? undefined : true}
      role={caption ? "img" : undefined}
      aria-label={caption ? `ג׳סטי — ${caption}` : undefined}
    >
      <svg
        width={px}
        height={Math.round(px * 1.18)}
        viewBox="0 0 120 142"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className={cn(
          "jesti-svg",
          motion === "wave" && "jesti-anim-wave",
          motion === "cheer" && "jesti-anim-cheer",
          motion === "idle" && "jesti-anim-idle",
          motion === "help" && "jesti-anim-help",
          motion === "seek" && "jesti-anim-seek",
          motion === "wait" && "jesti-anim-wait"
        )}
      >
        <defs>
          <linearGradient id={sweaterGrad} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F08A6F" />
            <stop offset="55%" stopColor={CORAL} />
            <stop offset="100%" stopColor={CORAL_DEEP} />
          </linearGradient>
        </defs>

        <g className={cn(isHelp && "jesti-lean")}>
          {/* Legs + feet (under torso) */}
          <Legs />

          {/* Back / side arms that sit behind torso */}
          <PoseArmsBack motion={motion} />

          {/* Pants */}
          <StickerPath
            d="M44 96c0-1.5 1.2-2.5 3-2.5h26c1.8 0 3 1 3 2.5v16c0 2.2-1.6 4-4 4H48c-2.4 0-4-1.8-4-4V96Z"
            fill={CHARCOAL}
            strokeW={2.6}
            rim={5.5}
          />
          {/* Pant crease hint */}
          <path
            d="M60 95.5v18"
            stroke={WHITE}
            strokeWidth="1.2"
            opacity="0.22"
            strokeLinecap="round"
          />

          {/* Sweater torso */}
          <StickerPath
            d="M38 58c0-3 2.5-5.5 6-5.5h32c3.5 0 6 2.5 6 5.5v38c0 3.2-2.4 5.5-5.5 5.5H43.5c-3.1 0-5.5-2.3-5.5-5.5V58Z"
            fill={`url(#${sweaterGrad})`}
            strokeW={2.8}
            rim={6}
          />
          {/* Ribbed hem */}
          <path
            d="M40 96.5h40"
            stroke={CORAL_DEEP}
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M42 94.2h36M42 98.5h36"
            stroke={CORAL_DEEP}
            strokeWidth="1.1"
            opacity="0.35"
          />

          {/* Turtleneck */}
          <StickerPath
            d="M48 50c0-3.5 2.8-6 12-6s12 2.5 12 6v8.5H48V50Z"
            fill={CORAL}
            strokeW={2.6}
            rim={5.5}
          />
          <path
            d="M50 54h20M50 57.5h20"
            stroke={CORAL_DEEP}
            strokeWidth="1.15"
            opacity="0.4"
            strokeLinecap="round"
          />

          {/* Head — cream face */}
          <StickerCircle cx={60} cy={34} r={22} fill={CREAM} strokeW={2.8} rim={6} />

          {/* Soft blush — restrained */}
          <ellipse cx={48} cy={40} rx={4.2} ry={2.2} fill="#E8C4B0" opacity="0.55" />
          <ellipse cx={72} cy={40} rx={4.2} ry={2.2} fill="#E8C4B0" opacity="0.55" />

          {/* Face */}
          {isWait ? (
            <>
              <path
                d="M49 33c1.4 1.2 5 1.2 6.4 0"
                stroke={CHARCOAL}
                strokeWidth="2.3"
                strokeLinecap="round"
              />
              <path
                d="M64.6 33c1.4 1.2 5 1.2 6.4 0"
                stroke={CHARCOAL}
                strokeWidth="2.3"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              {/* Open eye (viewer's left) */}
              <ellipse cx={51} cy={eyeCy} rx={4.2} ry={4.6} fill={CHARCOAL} />
              <circle cx={49.6} cy={eyeCy - 1.5} r={1.45} fill={WHITE} />
              {/* Wink (viewer's right) */}
              <path
                d={`M64 ${winkY}c1.9 1.55 5.6 1.55 7.5 0`}
                stroke={CHARCOAL}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Small calm smile */}
          <path
            d={smileD}
            stroke={CHARCOAL}
            strokeWidth="2.1"
            strokeLinecap="round"
          />

          {isSeek && (
            <path
              d="M74 18l0.75 1.7 1.7.75-1.7.75-.75 1.7-.75-1.7-1.7-.75 1.7-.75z"
              fill={CHARCOAL}
              className="jesti-spark"
            />
          )}

          {isCheer && (
            <circle
              cx={86}
              cy={16}
              r={2.6}
              fill={WHITE}
              stroke={CHARCOAL}
              strokeWidth="1.7"
              className="jesti-wink-dot"
            />
          )}

          {/* Front arms / hands that read above body */}
          <PoseArmsFront motion={motion} />
        </g>
      </svg>
      {caption ? <span className="jesti-caption">{caption}</span> : null}
    </div>
  );
}

/* ── Sticker primitives ─────────────────────────────────────────────── */

function StickerPath({
  d,
  fill,
  strokeW = 2.6,
  rim = 5.5,
}: {
  d: string;
  fill: string;
  strokeW?: number;
  rim?: number;
}) {
  return (
    <>
      <path d={d} fill={WHITE} stroke={WHITE} strokeWidth={rim} strokeLinejoin="round" />
      <path
        d={d}
        fill={fill}
        stroke={CHARCOAL}
        strokeWidth={strokeW}
        strokeLinejoin="round"
      />
    </>
  );
}

function StickerCircle({
  cx,
  cy,
  r,
  fill,
  strokeW = 2.6,
  rim = 5.5,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  strokeW?: number;
  rim?: number;
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r + rim * 0.42} fill={WHITE} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke={CHARCOAL}
        strokeWidth={strokeW}
      />
    </>
  );
}

function Legs() {
  return (
    <g>
      {/* Left shoe */}
      <ellipse cx={50} cy={124} rx={11} ry={5.5} fill={WHITE} />
      <ellipse
        cx={50}
        cy={123.2}
        rx={9}
        ry={4.4}
        fill={CHARCOAL}
        stroke={CHARCOAL}
        strokeWidth="1.5"
      />
      <path
        d="M42 124.5h16"
        stroke={WHITE}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Right shoe */}
      <ellipse cx={70} cy={124} rx={11} ry={5.5} fill={WHITE} />
      <ellipse
        cx={70}
        cy={123.2}
        rx={9}
        ry={4.4}
        fill={CHARCOAL}
        stroke={CHARCOAL}
        strokeWidth="1.5"
      />
      <path
        d="M62 124.5h16"
        stroke={WHITE}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
    </g>
  );
}

/** Cream hand with optional fingers + white rim */
function CreamHand({
  cx,
  cy,
  rot = 0,
  scale = 1,
  fingers = false,
  palmUp = false,
}: {
  cx: number;
  cy: number;
  rot?: number;
  scale?: number;
  fingers?: boolean;
  palmUp?: boolean;
}) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${scale})`}>
      <ellipse cx={0} cy={0} rx={7.2} ry={6} fill={WHITE} />
      <ellipse
        cx={0}
        cy={0}
        rx={5.6}
        ry={4.6}
        fill={CREAM}
        stroke={CHARCOAL}
        strokeWidth="2.2"
      />
      {(fingers || palmUp) && (
        <>
          {[-4, -1.3, 1.3, 4].map((x, i) => (
            <g key={i}>
              <ellipse
                cx={x}
                cy={palmUp ? -6.8 : -6.4}
                rx={2}
                ry={3.1}
                fill={WHITE}
              />
              <ellipse
                cx={x}
                cy={palmUp ? -6.4 : -6}
                rx={1.45}
                ry={2.45}
                fill={CREAM}
                stroke={CHARCOAL}
                strokeWidth="1.5"
              />
            </g>
          ))}
          {palmUp && (
            <>
              <ellipse cx={-6.2} cy={-1.5} rx={2.1} ry={2.8} fill={WHITE} />
              <ellipse
                cx={-6}
                cy={-1.2}
                rx={1.5}
                ry={2.1}
                fill={CREAM}
                stroke={CHARCOAL}
                strokeWidth="1.4"
              />
            </>
          )}
        </>
      )}
    </g>
  );
}

/** Coral sleeve stroke stack (rim → fill → outline) */
function Sleeve({
  d,
  w = 11,
  className,
}: {
  d: string;
  w?: number;
  className?: string;
}) {
  return (
    <g className={className}>
      <path d={d} stroke={WHITE} strokeWidth={w + 4} strokeLinecap="round" fill="none" />
      <path d={d} stroke={CORAL} strokeWidth={w} strokeLinecap="round" fill="none" />
      <path
        d={d}
        stroke={CHARCOAL}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function ArmHang({ side }: { side: "left" | "right" }) {
  const L = side === "left";
  // Start just outside torso so coral sleeve reads clearly
  const d = L
    ? "M40 66c-9 6-12 16-11 26"
    : "M80 66c9 6 12 16 11 26";
  const hx = L ? 28 : 92;
  const hy = 94;
  return (
    <g>
      <Sleeve d={d} w={10} />
      <ellipse
        cx={hx}
        cy={hy - 5}
        rx={4.5}
        ry={3.2}
        fill={CORAL_DEEP}
        opacity="0.45"
      />
      <CreamHand cx={hx} cy={hy} rot={L ? -12 : 12} scale={0.9} />
    </g>
  );
}

function PoseArmsBack({ motion }: { motion: JestiVariant }): ReactNode {
  // Only arms that tuck behind the torso silhouette
  switch (motion) {
    case "wave":
      return (
        <g className="jesti-arm">
          <Sleeve d="M42 64c-10-8-14-20-8-28" w={10} />
        </g>
      );
    case "cheer":
      return (
        <g className="jesti-arm">
          <Sleeve d="M42 64c-8-12-6-24 2-32" w={10} />
          <Sleeve d="M78 64c8-12 6-24-2-32" w={10} />
        </g>
      );
    case "help":
      return (
        <g className="jesti-hand">
          <Sleeve d="M80 70c14 2 24 8 28 16" w={11} />
        </g>
      );
    case "seek":
      return (
        <g className="jesti-arm">
          <Sleeve d="M42 66c-4-10 2-18 12-22" w={10} />
        </g>
      );
    default:
      return null;
  }
}

function PoseArmsFront({ motion }: { motion: JestiVariant }): ReactNode {
  switch (motion) {
    case "idle":
      return (
        <g className="jesti-arm">
          <ArmHang side="left" />
          <ArmHang side="right" />
        </g>
      );
    case "wave":
      return (
        <g className="jesti-arm">
          <ArmHang side="right" />
          <CreamHand cx={28} cy={28} rot={-30} fingers scale={1.05} />
        </g>
      );
    case "cheer":
      return (
        <g className="jesti-arm">
          <CreamHand cx={30} cy={24} rot={-25} fingers scale={1.05} />
          <CreamHand cx={90} cy={24} rot={25} fingers scale={1.05} />
        </g>
      );
    case "help":
      return (
        <g className="jesti-hand">
          <ArmHang side="left" />
          <CreamHand cx={108} cy={90} rot={-40} palmUp scale={1.12} />
        </g>
      );
    case "seek":
      return (
        <g className="jesti-arm">
          <ArmHang side="right" />
          <CreamHand cx={52} cy={22} rot={-50} scale={0.95} />
        </g>
      );
    case "wait":
      return (
        <g className="jesti-arm">
          <Sleeve d="M38 74c10 5 16 7 22 5" w={10} />
          <Sleeve d="M82 74c-10 5-16 7-22 5" w={10} />
          <CreamHand cx={40} cy={80} rot={-18} scale={0.85} />
          <CreamHand cx={80} cy={80} rot={18} scale={0.85} />
        </g>
      );
    default:
      return null;
  }
}
