import type { Category, CategoryId, RadiusOption } from "./types";

/** Order tuned so קניות / גינה appear early in home pills */
export const CATEGORIES: Category[] = [
  { id: "fuel", label: "דלק/דרך", shortLabel: "דלק", emoji: "⛽", color: "#E07A5F" },
  { id: "moving", label: "הובלה קלה", shortLabel: "הובלה", emoji: "📦", color: "#6B8FCE" },
  { id: "errands", label: "קניות/סידורים", shortLabel: "קניות", emoji: "🛒", color: "#81B29A" },
  { id: "home", label: "בית/מדף/הרמה", shortLabel: "בית", emoji: "🏠", color: "#A078B0" },
  { id: "garden", label: "גינה", shortLabel: "גינה", emoji: "🌿", color: "#7AA86A" },
  { id: "pets", label: "חיות מחמד", shortLabel: "חיות", emoji: "🐕", color: "#E0A04A" },
  { id: "digital", label: "דיגיטלי", shortLabel: "דיגיטלי", emoji: "💻", color: "#5B9EBF" },
  { id: "neighborhood", label: "שכונה", shortLabel: "שכונה", emoji: "🏘️", color: "#8E6BA8" },
  { id: "other", label: "אחר", shortLabel: "אחר", emoji: "✨", color: "#9AA0A6" },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, Category>;

export const RADIUS_OPTIONS: RadiusOption[] = [
  { id: "building", label: "בניין שלי", meters: 20 },
  { id: "50m", label: "50 מ׳", meters: 50 },
  { id: "500m", label: "500 מ׳", meters: 500 },
  { id: "2km", label: '2 ק"מ', meters: 2000 },
  { id: "10km", label: '10 ק"מ', meters: 10000 },
  { id: "50km", label: '50 ק"מ', meters: 50000 },
  { id: "300km", label: '300 ק"מ', meters: 300000 },
  { id: "all", label: "כל הארץ", meters: null },
];

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} מ׳`;
  const km = meters / 1000;
  if (km < 10) return `${km.toFixed(1)} ק״מ`;
  return `${Math.round(km)} ק״מ`;
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "עכשיו";
  if (mins < 60) return `לפני ${mins} דק׳`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} שע׳`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "אתמול";
  if (days < 7) return `לפני ${days} ימים`;
  return `לפני ${Math.floor(days / 7)} שבועות`;
}

export const SAFETY = {
  intermediary:
    "ג'סטה היא מתווכת בלבד, האחריות על המפגש של המשתמשים",
  publicPlace: "טיפ בטיחות: העדיפו מקום ציבורי במפגש ראשון",
  noExactAddress:
    "אל תשתפו כתובת מדויקת עד שאתם מרגישים בנוח • דווח/חסום זמינים",
  verifiedLabel: "מאומת בסיסית",
};
