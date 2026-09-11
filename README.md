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
- Auth: Google-first UI; real OAuth when `NEXT_PUBLIC_SUPABASE_*` set, else `signInWithGoogle()` stub
- Supabase helpers: `src/lib/supabase/{client,server}.ts` + `/auth/callback`
- PWA: `public/manifest.json` (`start_url`/`scope` `/`) + `public/sw.js`
- Schema: `supabase/schema.sql`

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

1. Primary CTA «המשך עם Google» → if Supabase env set: real OAuth via `/auth/callback`; else stub `signInWithGoogle()` in `src/lib/store.tsx`
2. Stub path: creates/reuses user `u-google` with `authProvider: 'google-stub'`, then optional onboarding
3. Optional onboarding: display name + accept תנאי שימוש ומדיניות פרטיות → «בואו נתחיל»
4. Fallback: «המשך כדמו» or expand «מצב דמו» to pick seed users (`authProvider: 'demo'`)

Stub needs no Google OAuth client IDs; real OAuth needs Supabase + Google provider.

### Wire real Supabase Google (when project is ready)

1. Copy `.env.example` → `.env.local` and fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (no invented keys).
2. Supabase Dashboard → Authentication → Providers → enable **Google**.
3. Add redirect URL: `{SITE_URL}/auth/callback` (and localhost for dev).
4. `/login` already calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${origin}/auth/callback` } })` when env vars are present; otherwise keeps the stub.
5. Keep the same `User` shape in `src/lib/types.ts`; map `auth.users` → `profiles`.

## Categories

דלק/דרך · הובלה קלה · בית/מדף/הרמה · קניות/סידורים · גינה · חיות מחמד · דיגיטלי · שכונה · אחר

## Later: Vercel + Supabase

1. Push repo → import on [Vercel](https://vercel.com); framework Next.js.
2. Create Supabase project → run `supabase/schema.sql`.
3. Add env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
4. Finish wiring session → `currentUser` in `src/lib/store.tsx`; keep types in `src/lib/types.ts`.

## Custom domain on Vercel · דומיין מותאם ב-Vercel

**עברית**

1. Vercel → Project → Settings → Domains → Add (למשל `jesta.app`).
2. עדכנו DNS אצל רשם הדומיין לפי ההוראות של Vercel (A / CNAME).
3. לאחר שהדומיין פעיל: הגדירו `NEXT_PUBLIC_SITE_URL=https://your-domain.com` ב-Vercel Env + Redeploy.
4. ב-Supabase Auth → URL Configuration הוסיפו `https://your-domain.com/auth/callback`.
5. ה-PWA משתמש ב-`start_url: "/"` ו-`scope: "/"` — עובד על כל דומיין בלי שינוי ב-manifest.

**English**

1. Vercel → Project → Settings → Domains → Add (e.g. `jesta.app`).
2. Point DNS at your registrar as Vercel instructs (A / CNAME).
3. Once live: set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` in Vercel Env and redeploy.
4. In Supabase Auth → URL Configuration add `https://your-domain.com/auth/callback`.
5. PWA `start_url`/`scope` are relative (`/`) so the install works on any custom domain.

## Design

Cream `#F7F1EA` / `#EFE6DB`, coral `#E07A5F`, charcoal `#3D405B`. Mockups: `/workspace/jesta-mockups/`.

## License

Demo MVP for local/box use.
