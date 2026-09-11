# ג׳סטה · Jesta

אפליקציית עזרה הדדית בין שכנים (PWA, עברית RTL). מפרסמים טובות לא-מקצועיות — דלק, הרמת מקרר, מדף, קניות, גינה וכו׳. **בלי תשלומים.** הפלטפורמה מתווכת בלבד.

**בטיחות:** מתווכת בלבד · האחריות על המשתמשים · העדיפו מקום ציבורי · דווח/חסום. תג: **מאומת בסיסית** (לא "בטוח").

## הרצה מקומית

```bash
cd /workspace/jesta
npm install
npm run dev     # http://localhost:3000
npm run build
```

---

## Run locally (EN)

```bash
cd /workspace/jesta
npm install
npm run dev        # http://localhost:3000
npm run build
npm start
```

## Stack

- Next.js 14 App Router + TypeScript + Tailwind
- In-memory seed data + `localStorage` persistence
- Auth MVP: Google-first UI + `signInWithGoogle()` stub (`authProvider: 'google-stub'`)
- PWA: `public/manifest.json` + `public/sw.js`
- Optional later: Supabase — see `supabase/schema.sql`

## Routes

| Route | Screen |
|-------|--------|
| `/` | Home feed (categories + radius + search) |
| `/nearby` | Map + radius presets + online filter + people/jestas |
| `/create` | Create jesta |
| `/jesta/[id]` | Detail, offer help, report |
| `/messages` | Inbox |
| `/chat/[id]` | Chat thread |
| `/profile` | Profile (badges/tags/stats); `?u=` for others; link → `/login` |
| `/login` | Calm Google-first auth + optional name/terms step; demo disclosure |

## Auth (MVP stub → Supabase Google)

**Current (`/login`):**

1. Primary CTA «המשך עם Google» → `signInWithGoogle()` in `src/lib/store.tsx`
2. Creates/reuses user `u-google` with `authProvider: 'google-stub'`, sets as `currentUser`
3. Optional onboarding: display name + accept תנאי שימוש ומדיניות פרטיות → «בואו נתחיל»
4. Fallback: «המשך כדמו» or expand «מצב דמו» to pick seed users (`authProvider: 'demo'`)

No Google OAuth client IDs required yet.

### Later: wire real Supabase Google provider

1. Supabase Dashboard → Authentication → Providers → enable **Google** (Client ID + Secret from Google Cloud Console).
2. Add env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Replace the stub body of `signInWithGoogle()` roughly with:

```ts
// Example — not active in MVP
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: { redirectTo: `${window.location.origin}/login` },
});
// On auth callback: upsert public.profiles from session.user, set currentUser
```

4. Keep the same `User` shape in `src/lib/types.ts`; map `auth.users` → `profiles`.

## Categories

דלק/דרך · הובלה קלה · בית/מדף/הרמה · קניות/סידורים · גינה · חיות מחמד · דיגיטלי · שכונה · אחר

## Later: Vercel + Supabase

1. Push repo → import on [Vercel](https://vercel.com); framework Next.js.
2. Create Supabase project → run `supabase/schema.sql`.
3. Add env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Replace `src/lib/store.tsx` mock auth with Supabase client/Auth; keep the same types in `src/lib/types.ts`.

## Design

Cream `#F7F1EA` / `#EFE6DB`, coral `#E07A5F`, charcoal `#3D405B`. Mockups: `/workspace/jesta-mockups/`.

## License

Demo MVP for local/box use.
