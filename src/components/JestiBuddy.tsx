"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/lib/types";

export type JestiVariant =
  | "idle"
  | "wave"
  | "cheer"
  | "help"
  | "seek"
  | "wait";

export type JestiRole = "brand" | "category";
export type JestiCostume = CategoryId | "brand";

type Size = "sm" | "md" | "lg";

const SIZE_PX: Record<Size, number> = {
  sm: 64,
  md: 96,
  lg: 120,
};

/** Default Hebrew mood captions (≤18 chars). */
export const JESTI_CAPTIONS: Partial<Record<JestiVariant, string>> = {
  wave: "היי",
  cheer: "כל הכבוד",
  help: "אני פה",
  seek: "מחפשים יחד",
  wait: "עוד רגע",
};

/** Short category-aware nudges (≤18 chars). */
export const JESTI_CATEGORY_CAPTIONS: Partial<
  Record<CategoryId, Partial<Record<JestiVariant, string>>>
> = {
  fuel: {
    help: "בדרך איתך",
    seek: "מחפשים דלק",
    cheer: "בטוח בדרך",
    wave: "היי בדרך",
  },
  moving: {
    help: "באתי לשאת",
    seek: "צריך ידיים?",
    cheer: "זה זז!",
    wave: "היי הובלה",
  },
  home: {
    help: "באתי לתקן",
    seek: "צריך כלי?",
    cheer: "מסודר!",
    wave: "היי בבית",
  },
  errands: {
    help: "אביא בשבילך",
    seek: "סיבוב קניות?",
    cheer: "סגור!",
  },
  garden: {
    help: "באתי להשקות",
    seek: "גינה צריכה?",
    cheer: "פורח!",
  },
  pets: {
    help: "עם החיות",
    seek: "טיול לכלב?",
    cheer: "ווף!",
  },
  digital: {
    help: "איתך אונליין",
    seek: "תקלה דיגיטלית?",
    cheer: "עובד!",
  },
  neighborhood: {
    help: "שכנים פה",
    seek: "מי בקרבת מקום?",
    cheer: "שכונתי!",
  },
  other: {
    help: "אני פה",
    seek: "מחפשים יחד",
  },
};

const CORAL = "#E07A5F";
const CORAL_LIGHT = "#EE8F74";
const CORAL_MID = "#E07A5F";
const CORAL_DEEP = "#C96A50";
const CORAL_SHADOW = "#B85A42";
const CHARCOAL = "#3D405B";
const CREAM = "#F7F1E8";
const CREAM_WARM = "#FFF8F0";
const WHITE = "#FFFFFF";
const HI_VIS = "#F4D35E";
const HI_VIS_DEEP = "#E0B83A";
const NAVY = "#2F3A5F";
const SAGE = "#81B29A";
const BOX = "#C4A574";
const STEEL = "#7A8499";

function resolveCostume(
  role: JestiRole,
  category?: JestiCostume
): JestiCostume {
  if (role === "brand") return "brand";
  if (!category || category === "brand") return "brand";
  return category;
}

function resolveCaption(
  variant: JestiVariant,
  costume: JestiCostume,
  label: string | undefined
): string | undefined {
  if (label === "") return undefined;
  if (label !== undefined) return label;
  if (costume !== "brand") {
    const cat = JESTI_CATEGORY_CAPTIONS[costume]?.[variant];
    if (cat) return cat;
  }
  return JESTI_CAPTIONS[variant];
}

/**
 * «ג׳סטי» — Concept 3 geometric coral owl + category costume language.
 * Brand owl = master companion. Category = same DNA + outfit/prop layers.
 */
export function JestiBuddy({
  variant = "idle",
  size = "md",
  className,
  label,
  hold = false,
  role = "brand",
  category,
}: {
  variant?: JestiVariant;
  size?: Size;
  className?: string;
  /** Optional visible caption (≤18 Hebrew chars). undefined = default; "" = none */
  label?: string;
  /** Keep pose (don't settle back to idle) — for contextual sticky moods */
  hold?: boolean;
  /** brand = Wordmark/hero; category = create/detail/tips/filters/empty */
  role?: JestiRole;
  /** Costume id. Ignored when role=brand. */
  category?: JestiCostume;
}) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");
  const bodyGrad = `jestiBody-${uid}`;
  const wingGrad = `jestiWing-${uid}`;
  const [motion, setMotion] = useState(variant);
  const costume = resolveCostume(role, category);

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
  const caption = resolveCaption(variant, costume, label);
  const isHelp = motion === "help";
  const isSeek = motion === "seek";
  const isWait = motion === "wait";
  const isCheer = motion === "cheer";

  return (
    <div
      className={cn(
        "jesti-buddy pointer-events-none select-none inline-flex flex-col items-center gap-1.5",
        className
      )}
      aria-hidden={caption ? undefined : true}
      role={caption ? "img" : undefined}
      aria-label={
        caption
          ? `ג׳סטי${costume !== "brand" ? ` · ${costume}` : ""} — ${caption}`
          : undefined
      }
      data-jesti-role={role}
      data-jesti-costume={costume}
    >
      <svg
        width={px}
        height={Math.round(px * 1.2)}
        viewBox="0 0 120 144"
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
          <linearGradient id={bodyGrad} x1="25%" y1="5%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={CORAL_LIGHT} />
            <stop offset="50%" stopColor={CORAL_MID} />
            <stop offset="100%" stopColor={CORAL_DEEP} />
          </linearGradient>
          <linearGradient id={wingGrad} x1="0%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor={CORAL_LIGHT} />
            <stop offset="55%" stopColor={CORAL} />
            <stop offset="100%" stopColor={CORAL_SHADOW} />
          </linearGradient>
        </defs>

        <g className={cn(isHelp && "jesti-lean")}>
          <Feet />
          <Wing side="left" motion={motion} fill={`url(#${wingGrad})`} />
          <Wing side="right" motion={motion} fill={`url(#${wingGrad})`} />
          <Body fill={`url(#${bodyGrad})`} />
          <CostumeLayers costume={costume} motion={motion} />
          <Head isWait={isWait} isSeek={isSeek} isCheer={isCheer} />
          <CostumeHat costume={costume} />

          {isCheer && (
            <>
              <path
                d="M94 20l1.15 2.5 2.5 1.15-2.5 1.15-1.15 2.5-1.15-2.5-2.5-1.15 2.5-1.15z"
                fill={CHARCOAL}
                className="jesti-spark"
              />
              <path
                d="M26 24l0.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z"
                fill={CORAL_DEEP}
                className="jesti-spark"
              />
              <circle
                cx={100}
                cy={38}
                r={2.5}
                fill={WHITE}
                stroke={CHARCOAL}
                strokeWidth="1.6"
                className="jesti-wink-dot"
              />
            </>
          )}

          {isSeek && (
            <path
              d="M90 14l0.95 2.1 2.1.95-2.1.95-.95 2.1-.95-2.1-2.1-.95 2.1-.95z"
              fill={CHARCOAL}
              className="jesti-spark"
            />
          )}
        </g>
      </svg>
      {caption ? <span className="jesti-caption">{caption}</span> : null}
    </div>
  );
}

/* ── Base geometry ──────────────────────────────────────────────────── */

function Feet() {
  return (
    <g>
      <path
        d="M46 122 L39 136 L44 136 L48 128 L52 136 L57 136 Z"
        fill={WHITE}
        stroke={WHITE}
        strokeWidth="2.8"
        strokeLinejoin="miter"
      />
      <path
        d="M46 122 L39 136 L44 136 L48 128 L52 136 L57 136 Z"
        fill={CHARCOAL}
        stroke={CHARCOAL}
        strokeWidth="1.3"
        strokeLinejoin="miter"
      />
      <path
        d="M74 122 L67 136 L72 136 L76 128 L80 136 L85 136 Z"
        fill={WHITE}
        stroke={WHITE}
        strokeWidth="2.8"
        strokeLinejoin="miter"
      />
      <path
        d="M74 122 L67 136 L72 136 L76 128 L80 136 L85 136 Z"
        fill={CHARCOAL}
        stroke={CHARCOAL}
        strokeWidth="1.3"
        strokeLinejoin="miter"
      />
      <path
        d="M50 112 L46 122 L58 122 Z"
        fill={CORAL_DEEP}
        stroke={CHARCOAL}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
      <path
        d="M70 112 L62 122 L78 122 Z"
        fill={CORAL_DEEP}
        stroke={CHARCOAL}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
    </g>
  );
}

function Body({ fill }: { fill: string }) {
  const torso =
    "M34 56 L46 46 L74 46 L86 56 L90 88 L82 116 L38 116 L30 88 Z";
  const belly =
    "M48 62 L60 56 L72 62 L74 106 L60 112 L46 106 Z";

  return (
    <g>
      <path d={torso} fill={WHITE} stroke={WHITE} strokeWidth="6.5" strokeLinejoin="miter" />
      <path d={torso} fill={fill} stroke={CHARCOAL} strokeWidth="2.35" strokeLinejoin="miter" />
      <path d="M34 56 L30 88 L38 116 L48 68 Z" fill={CORAL_SHADOW} opacity="0.38" />
      <path d="M86 56 L90 88 L82 116 L72 68 Z" fill={CORAL_LIGHT} opacity="0.3" />
      <path d="M46 46 L60 52 L74 46 L60 70 Z" fill={CORAL_LIGHT} opacity="0.22" />
      <path d={belly} fill={WHITE} stroke={WHITE} strokeWidth="3.8" strokeLinejoin="miter" />
      <path d={belly} fill={CREAM_WARM} stroke={CHARCOAL} strokeWidth="1.9" strokeLinejoin="miter" />
      <path d="M60 58 V108" stroke={CORAL} strokeWidth="1.15" opacity="0.32" />
      <path d="M50 74 L60 70 L70 74" stroke={CORAL} strokeWidth="1.05" opacity="0.28" fill="none" />
      <path
        d="M47 76 L73 76 L72 84 L48 84 Z"
        fill={CORAL}
        stroke={CHARCOAL}
        strokeWidth="1.55"
        strokeLinejoin="miter"
      />
      <path d="M48 80 H72" stroke={CORAL_DEEP} strokeWidth="1.15" opacity="0.55" />
    </g>
  );
}

function Head({
  isWait,
  isSeek,
  isCheer,
}: {
  isWait: boolean;
  isSeek: boolean;
  isCheer: boolean;
}) {
  const eyeY = isSeek ? 33 : 37;
  const beakY = isCheer ? 47.5 : 46;

  return (
    <g>
      <path
        d="M32 40 L40 16 L60 8 L80 16 L88 40 L80 56 L60 62 L40 56 Z"
        fill={WHITE}
        stroke={WHITE}
        strokeWidth="6.5"
        strokeLinejoin="miter"
      />
      <path
        d="M32 40 L40 16 L60 8 L80 16 L88 40 L80 56 L60 62 L40 56 Z"
        fill={CORAL}
        stroke={CHARCOAL}
        strokeWidth="2.35"
        strokeLinejoin="miter"
      />
      <path d="M32 40 L40 16 L46 42 Z" fill={CORAL_SHADOW} opacity="0.42" />
      <path d="M88 40 L80 16 L74 42 Z" fill={CORAL_LIGHT} opacity="0.34" />
      <path d="M40 16 L33 4 L48 14 Z" fill={CORAL_DEEP} stroke={CHARCOAL} strokeWidth="1.9" strokeLinejoin="miter" />
      <path d="M80 16 L87 4 L72 14 Z" fill={CORAL_DEEP} stroke={CHARCOAL} strokeWidth="1.9" strokeLinejoin="miter" />
      <path
        d="M44 20 L60 14 L76 20 L66 28 L60 24 L54 28 Z"
        fill={CREAM}
        stroke={CHARCOAL}
        strokeWidth="1.6"
        strokeLinejoin="miter"
      />
      <path
        d="M42 32 L52 26 L68 26 L78 32 L76 50 L60 56 L44 50 Z"
        fill={WHITE}
        stroke={WHITE}
        strokeWidth="3.2"
        strokeLinejoin="miter"
      />
      <path
        d="M42 32 L52 26 L68 26 L78 32 L76 50 L60 56 L44 50 Z"
        fill={CREAM_WARM}
        stroke={CHARCOAL}
        strokeWidth="1.9"
        strokeLinejoin="miter"
      />

      {isWait ? (
        <>
          <path d="M47 37c1.7 1.35 6.4 1.35 8.1 0" stroke={CHARCOAL} strokeWidth="2.55" strokeLinecap="round" />
          <path d="M65 37c1.7 1.35 6.4 1.35 8.1 0" stroke={CHARCOAL} strokeWidth="2.55" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx={52} cy={eyeY} rx={6.4} ry={7} fill={WHITE} stroke={CHARCOAL} strokeWidth="1.75" />
          <ellipse cx={52} cy={eyeY} rx={4.5} ry={5} fill={CHARCOAL} />
          <circle cx={50.1} cy={eyeY - 1.9} r={1.6} fill={WHITE} />
          <path
            d={`M65 ${eyeY - 0.8}c2.3 1.85 7.6 1.85 9.9 0`}
            stroke={CHARCOAL}
            strokeWidth="2.75"
            strokeLinecap="round"
          />
        </>
      )}

      <path
        d={`M56 ${beakY} L60 ${beakY + 8} L64 ${beakY} Z`}
        fill={CORAL}
        stroke={CHARCOAL}
        strokeWidth="1.7"
        strokeLinejoin="miter"
      />
    </g>
  );
}

function Wing({
  side,
  motion,
  fill,
}: {
  side: "left" | "right";
  motion: JestiVariant;
  fill: string;
}): ReactNode {
  const L = side === "left";
  const ox = L ? 38 : 82;
  const oy = 60;
  const pose = wingPose(side, motion);
  if (!pose) return null;
  const { rot, tx, ty, scaleX = 1, scaleY = 1, className } = pose;
  const mirror = L ? 1 : -1;
  const outline = "M0 2 L-12 16 L-14 36 L-6 56 L8 60 L16 40 L14 14 Z";

  return (
    <g
      className={cn("jesti-wing", className)}
      transform={`translate(${ox + tx} ${oy + ty}) rotate(${rot}) scale(${mirror * scaleX} ${scaleY})`}
    >
      <path d={outline} fill={WHITE} stroke={WHITE} strokeWidth="5" strokeLinejoin="miter" />
      <path d={outline} fill={fill} stroke={CHARCOAL} strokeWidth="2.05" strokeLinejoin="miter" />
      <path d="M0 2 L-12 16 L-4 28 L12 18 Z" fill={CORAL_LIGHT} stroke={CHARCOAL} strokeWidth="1.25" strokeLinejoin="miter" opacity="0.95" />
      <path d="M-12 16 L-14 36 L-2 46 L-4 28 Z" fill={CORAL} stroke={CHARCOAL} strokeWidth="1.25" strokeLinejoin="miter" opacity="0.95" />
      <path d="M-14 36 L-6 56 L8 60 L16 40 L-2 46 Z" fill={CORAL_DEEP} stroke={CHARCOAL} strokeWidth="1.25" strokeLinejoin="miter" opacity="0.95" />
      <path d="M-4 28 L12 18 L16 40 L-2 46 Z" fill={CORAL_MID} stroke={CHARCOAL} strokeWidth="1.15" strokeLinejoin="miter" opacity="0.85" />
    </g>
  );
}

type WingPose = {
  rot: number;
  tx: number;
  ty: number;
  scaleX?: number;
  scaleY?: number;
  className?: string;
} | null;

function wingPose(side: "left" | "right", motion: JestiVariant): WingPose {
  const L = side === "left";
  switch (motion) {
    case "idle":
      return { rot: L ? 6 : -6, tx: L ? -1 : 1, ty: 4 };
    case "wait":
      return { rot: L ? 12 : -12, tx: L ? 2 : -2, ty: 8, scaleY: 0.9 };
    case "wave":
      if (L) return { rot: 8, tx: -1, ty: 4 };
      return { rot: -120, tx: 2, ty: -6, className: "jesti-wing-wave" };
    case "cheer":
      return { rot: L ? 128 : -128, tx: L ? -8 : 8, ty: -10, className: "jesti-wing-cheer" };
    case "help":
      if (L) return { rot: 48, tx: -16, ty: 10, scaleX: 1.06, className: "jesti-wing-help" };
      return { rot: -10, tx: 2, ty: 6 };
    case "seek":
      if (L) return { rot: 158, tx: -4, ty: -20, scaleY: 0.86, className: "jesti-wing-seek" };
      return { rot: -8, tx: 2, ty: 4 };
    default:
      return null;
  }
}

/* ── Category costume layers (same DNA, different props) ────────────── */

function CostumeLayers({
  costume,
  motion,
}: {
  costume: JestiCostume;
  motion: JestiVariant;
}): ReactNode {
  switch (costume) {
    case "fuel":
      return <FuelVest />;
    case "moving":
      return <MovingProps motion={motion} />;
    case "home":
      return <HomeHandy />;
    case "errands":
      return <ErrandsBag />;
    case "garden":
      return <GardenProp />;
    case "pets":
      return <PetsProp />;
    case "digital":
      return <DigitalProp />;
    case "neighborhood":
      return <NeighborhoodProp />;
    case "other":
    case "brand":
    default:
      return null;
  }
}

function CostumeHat({ costume }: { costume: JestiCostume }): ReactNode {
  if (costume === "fuel") {
    // Tiny cone cue beside head
    return (
      <g transform="translate(92 28)">
        <path d="M0 18 L6 0 L12 18 Z" fill={HI_VIS} stroke={CHARCOAL} strokeWidth="1.4" strokeLinejoin="miter" />
        <rect x={1} y={14} width={10} height={3} fill={WHITE} stroke={CHARCOAL} strokeWidth="1.1" />
      </g>
    );
  }
  if (costume === "digital") {
    return (
      <g>
        {/* headset band */}
        <path d="M38 28 Q60 8 82 28" stroke={STEEL} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <rect x={30} y={30} width={8} height={12} rx={2} fill={STEEL} stroke={CHARCOAL} strokeWidth="1.3" />
        <rect x={82} y={30} width={8} height={12} rx={2} fill={STEEL} stroke={CHARCOAL} strokeWidth="1.3" />
      </g>
    );
  }
  if (costume === "neighborhood") {
    return (
      <g>
        {/* soft scarf under chin */}
        <path
          d="M44 58 Q60 68 76 58 L74 64 Q60 72 46 64 Z"
          fill="#8E6BA8"
          stroke={CHARCOAL}
          strokeWidth="1.4"
          strokeLinejoin="miter"
          opacity="0.95"
        />
      </g>
    );
  }
  return null;
}

/** Fuel — hi-vis reflective vest + stripe */
function FuelVest() {
  return (
    <g>
      <path
        d="M40 58 L48 52 L72 52 L80 58 L78 100 L42 100 Z"
        fill={HI_VIS}
        stroke={CHARCOAL}
        strokeWidth="1.8"
        strokeLinejoin="miter"
        opacity="0.92"
      />
      <path d="M48 52 L60 70 L72 52" fill="none" stroke={CHARCOAL} strokeWidth="1.5" />
      {/* reflective bands */}
      <path d="M44 72 H76" stroke={WHITE} strokeWidth="3.2" strokeLinecap="square" />
      <path d="M44 72 H76" stroke={NAVY} strokeWidth="1.4" />
      <path d="M44 86 H76" stroke={WHITE} strokeWidth="3.2" strokeLinecap="square" />
      <path d="M44 86 H76" stroke={NAVY} strokeWidth="1.4" />
      <path d="M42 58 L48 64 L48 100 L42 100 Z" fill={HI_VIS_DEEP} opacity="0.45" />
      <path d="M78 58 L72 64 L72 100 L78 100 Z" fill={HI_VIS_DEEP} opacity="0.35" />
    </g>
  );
}

/** Moving — work gloves cue + cardboard box prop */
function MovingProps({ motion }: { motion: JestiVariant }) {
  const offer = motion === "help" || motion === "cheer";
  return (
    <g>
      {/* gloves on wing tips area (body-side accent) */}
      <ellipse cx={34} cy={94} rx={7} ry={5.5} fill="#E8D5B7" stroke={CHARCOAL} strokeWidth="1.5" />
      <ellipse cx={86} cy={94} rx={7} ry={5.5} fill="#E8D5B7" stroke={CHARCOAL} strokeWidth="1.5" />
      {/* box */}
      <g transform={offer ? "translate(88 78) rotate(-8)" : "translate(86 92)"}>
        <path d="M0 8 L14 0 L28 8 L28 24 L14 32 L0 24 Z" fill={BOX} stroke={CHARCOAL} strokeWidth="1.6" strokeLinejoin="miter" />
        <path d="M0 8 L14 16 L28 8" fill="none" stroke={CHARCOAL} strokeWidth="1.3" />
        <path d="M14 16 V32" stroke={CHARCOAL} strokeWidth="1.3" />
        <path d="M6 12 H22" stroke="#8B6914" strokeWidth="2" opacity="0.5" />
      </g>
    </g>
  );
}

/** Home — tool belt + hammer */
function HomeHandy() {
  return (
    <g>
      {/* tool belt */}
      <path
        d="M38 96 H82"
        stroke="#5C4033"
        strokeWidth="7"
        strokeLinecap="square"
      />
      <path d="M38 96 H82" stroke={CHARCOAL} strokeWidth="1.6" />
      <rect x={44} y={90} width={10} height={12} rx={1} fill="#6B5344" stroke={CHARCOAL} strokeWidth="1.3" />
      <rect x={66} y={90} width={10} height={12} rx={1} fill="#6B5344" stroke={CHARCOAL} strokeWidth="1.3" />
      {/* hammer */}
      <g transform="translate(88 70) rotate(25)">
        <rect x={-2} y={0} width={4} height={22} fill="#8B6914" stroke={CHARCOAL} strokeWidth="1.2" />
        <path d="M-8 0 H10 V8 H-8 Z" fill={STEEL} stroke={CHARCOAL} strokeWidth="1.4" strokeLinejoin="miter" />
      </g>
    </g>
  );
}

function ErrandsBag() {
  return (
    <g transform="translate(86 88)">
      <path d="M4 6 H20 V22 H4 Z" fill="#81B29A" stroke={CHARCOAL} strokeWidth="1.5" strokeLinejoin="miter" />
      <path d="M4 6 Q12 0 20 6" fill="none" stroke={CHARCOAL} strokeWidth="1.6" />
      <path d="M7 10 H17" stroke={WHITE} strokeWidth="1.2" opacity="0.7" />
    </g>
  );
}

function GardenProp() {
  return (
    <g transform="translate(88 82)">
      {/* leaf */}
      <path d="M4 16 Q14 0 24 16 Q14 22 4 16 Z" fill={SAGE} stroke={CHARCOAL} strokeWidth="1.4" strokeLinejoin="miter" />
      <path d="M14 4 V18" stroke={CHARCOAL} strokeWidth="1.1" />
      {/* tiny can */}
      <path d="M-6 10 H2 V20 H-6 Z" fill="#5B9EBF" stroke={CHARCOAL} strokeWidth="1.3" />
      <path d="M2 12 H8 V14" stroke={CHARCOAL} strokeWidth="1.3" fill="none" />
    </g>
  );
}

function PetsProp() {
  return (
    <g transform="translate(88 90)">
      {/* paw */}
      <ellipse cx={10} cy={12} rx={7} ry={6} fill="#E0A04A" stroke={CHARCOAL} strokeWidth="1.4" />
      <circle cx={4} cy={6} r={2.4} fill="#E0A04A" stroke={CHARCOAL} strokeWidth="1.1" />
      <circle cx={10} cy={4} r={2.4} fill="#E0A04A" stroke={CHARCOAL} strokeWidth="1.1" />
      <circle cx={16} cy={6} r={2.4} fill="#E0A04A" stroke={CHARCOAL} strokeWidth="1.1" />
      {/* leash loop */}
      <path d="M-4 8 Q-10 0 -4 -4" stroke={CHARCOAL} strokeWidth="1.6" fill="none" />
    </g>
  );
}

function DigitalProp() {
  return (
    <g transform="translate(84 92)">
      <rect x={0} y={4} width={22} height={14} rx={1.5} fill="#5B9EBF" stroke={CHARCOAL} strokeWidth="1.5" />
      <rect x={2} y={6} width={18} height={9} fill="#DDF2FA" stroke={CHARCOAL} strokeWidth="1" />
      <path d="M8 18 H14 L16 22 H6 Z" fill={STEEL} stroke={CHARCOAL} strokeWidth="1.2" />
    </g>
  );
}

function NeighborhoodProp() {
  return (
    <g transform="translate(88 86)">
      {/* keys */}
      <circle cx={6} cy={8} r={4} fill="#E0A04A" stroke={CHARCOAL} strokeWidth="1.3" />
      <circle cx={6} cy={8} r={1.5} fill={CREAM} />
      <path d="M10 8 H20 V11 H16 V14 H13 V11 H10 Z" fill={STEEL} stroke={CHARCOAL} strokeWidth="1.2" />
    </g>
  );
}
