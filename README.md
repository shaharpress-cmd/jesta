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
- In-memory seed data + `localStorage` persistence (mock auth / user switch)
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
| `/profile` | Profile (badges/tags/stats); `?u=` for others |
| `/login` | Demo user switch (mock auth) |

## Categories

דלק/דרך · הובלה קלה · בית/מדף/הרמה · קניות/סידורים · גינה · חיות מחמד · דיגיטלי · שכונה · אחר

## Later: Vercel + Supabase

1. Push repo → import on [Vercel](https://vercel.com); framework Next.js.
2. Create Supabase project → run `supabase/schema.sql`.
3. Add env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Replace `src/lib/store.tsx` + mock login with Supabase client/Auth; keep the same types in `src/lib/types.ts`.

## Design

Cream `#FDF8F5`, coral `#E07A5F`, charcoal `#3D405B`. Mockups: `/workspace/jesta-mockups/`.

## License

Demo MVP for local/box use.
