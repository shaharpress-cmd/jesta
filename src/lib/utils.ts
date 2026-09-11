import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

/** Default / placeholder display names that should trigger onboarding. */
export function isDefaultDisplayName(name: string | null | undefined): boolean {
  if (!name?.trim()) return true;
  const n = name.trim();
  return n === "משתמש Google" || n === "משתמש";
}

/** True when post-OAuth «כמעט שם» onboarding is still required. */
export function needsProfileOnboarding(profile: {
  name?: string | null;
  terms_accepted_at?: string | null;
  acceptedTermsAt?: string | null;
}): boolean {
  const terms =
    profile.terms_accepted_at ?? profile.acceptedTermsAt ?? null;
  return !terms || isDefaultDisplayName(profile.name);
}
