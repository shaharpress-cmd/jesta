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
- Dual data path: seed + `localStorage` for demo; **Supabase** for Google-authenticated users
- Auth: Google OAuth via Supabase when `NEXT_PUBLIC_SUPABASE_*` set, else `signInWithGoogle()` stub
- Supabase helpers: `src/lib/supabase/{client,server,mappers}.ts` + `/auth/callback` + session middleware
- PWA: `public/manifest.json` (`start_url`/`scope` `/`) + `public/sw.js`
- Schema: `supabase/schema.sql` (+ `migrations/001_profile_on_auth_user.sql`)

## Routes

| Route | Screen |
|-------|--------|
| `/` | Home feed (categories + radius + search) |
| `/about` | מה זה ג׳סטה — what/how/safety + login CTA |
| `/nearby` | Map + radius presets + online filter + people/jestas |
| `/create` | Create jesta |
| `/jesta/[id]` | Detail, offer help, report |
| `/messages` | Inbox |
| `/chat/[id]` | Chat thread |
| `/profile` | Profile (badges/tags/stats); `?u=` for others; link → `/login` |
| `/login` | Calm Google-first auth + optional name/terms step; demo disclosure |

## Auth + cloud data

**Current (`/login`):**

1. Primary CTA «המשך עם Google» → if Supabase env set: real OAuth via `/auth/callback`; else stub `signInWithGoogle()` in `src/lib/store.tsx`
2. After Google session: upsert `profiles`, set `currentUser`, load `jestas` / `offers` / `chat_threads` / `messages` from Supabase (RLS + anon key only)
3. Writes (`createJesta`, `offerHelp`, `sendMessage`, `submitReport`) go to Supabase when `isCloud`
4. Stub / «המשך כדמו» keep localStorage seed UX (`authProvider: 'demo' | 'google-stub'`)

### Setup checklist

1. Copy `.env.example` → `.env.local` and fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
2. Run `supabase/schema.sql` (includes RLS + `handle_new_user` trigger). If schema already applied, run `supabase/migrations/001_profile_on_auth_user.sql`.
3. Enable Google provider; add `{SITE_URL}/auth/callback`.
4. `category_id` enum matches app `CategoryId`: fuel, moving, home, errands, garden, pets, digital, neighborhood, other.

## Categories

דלק/דרך · הובלה קלה · בית/מדף/הרמה · קניות/סידורים · גינה · חיות מחמד · דיגיטלי · שכונה · אחר

## Vercel + Supabase

1. Env on Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
2. Apply schema / profile trigger in Supabase SQL editor if not already.
3. Cloud path is live in `src/lib/store.tsx` when a Google session exists.

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
