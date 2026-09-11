# SEO Pack — ג׳סטה (Jesta)

סיכום חבילת SEO ל־Next.js 14 App Router. שפה: עברית · locale: `he_IL` · מסר ליבה: **מתווכת בלבד**.

## עקרונות

- ג׳סטה מחברת בין שכנים לעזרה מקומית; **אינה מבצעת** את העזרה ואינה מבטיחה תוצאה.
- האחריות על המשתמשים; בלי הבטחות בטיחות/זמינות מוחלטת.
- בלי תשלומים ב־MVP.
- אינדוקס ציבורי ל־`/` ו־`/nearby` (ו־`/create` במפת האתר); חסימת `/login`, `/chat`, `/messages`, `/api/`.
- פרופיל: `noindex, follow`.

## Root metadata (`src/app/layout.tsx`)

| שדה | ערך |
|-----|-----|
| metadataBase | `process.env.NEXT_PUBLIC_SITE_URL ?? http://localhost:3000` |
| title.default | ג׳סטה — עזרה בין שכנים באזור שלך |
| title.template | `%s \| ג׳סטה` |
| description | ג׳סטה מחברת בין שכנים לעזרה מהירה באזור שלך — דלק, הובלה קלה, קניות ועוד. הפלטפורמה מתווכת בלבד ואינה מבצעת את העזרה; האחריות על המשתמשים. בלי תשלומים. |
| applicationName | ג׳סטה |
| manifest | `/manifest.json` |
| appleWebApp | capable, title ג׳סטה |
| icons | `/icons/icon-192.png` |
| openGraph | type website, locale `he_IL`, siteName ג׳סטה |
| twitter | card `summary` |

Fonts / RTL / providers נשארים ללא שינוי.

## Layouts לפי נתיב

### `/nearby` — `src/app/nearby/layout.tsx`
- **title:** לידך עכשיו → מלא: `לידך עכשיו | ג׳סטה`
- **description:** מפה ורדיוס: מצאו שכנים וג׳סטות פתוחות באזור שלכם. ג׳סטה מתווכת בלבד — האחריות על המשתמשים.
- OG + Twitter summary כנ״ל

### `/create` — `src/app/create/layout.tsx`
- **title:** פרסום ג׳סטה
- **description:** פרסמו בקשת עזרה או הצעה לשכנים באזור שלכם. ג׳סטה מתווכת בלבד ואינה מבטיחה תוצאה — בלי תשלומים.
- OG + Twitter summary כנ״ל

### `/profile` — `src/app/profile/layout.tsx`
- **title:** פרופיל
- **description:** פרופיל משתמש בג׳סטה — תגים, דירוגים וסטטיסטיקות. עמוד אישי; לא לאינדוקס מלא.
- **robots:** `index: false`, `follow: true`
- OG + Twitter summary כנ״ל

## robots.ts

Base: `NEXT_PUBLIC_SITE_URL ?? https://jesta.example`

- Allow: `/`, `/nearby`
- Disallow: `/login`, `/chat`, `/messages`, `/api/`
- Sitemap: `{base}/sitemap.xml`

## sitemap.ts

Base: `NEXT_PUBLIC_SITE_URL ?? https://jesta.example`

| URL | priority | changeFrequency |
|-----|----------|-----------------|
| `/` | 1 | daily |
| `/nearby` | 0.9 | hourly |
| `/create` | 0.7 | weekly |

## מילות מפתח (הכוונה)

עזרה בין שכנים · עזרה באזור · לידך עכשיו · שכנים · דלק · הובלה קלה · קניות · מתווכת בלבד · בלי תשלומים · תל אביב · ירושלים · חיפה · באר שבע

## הערות יישום

- דפי `nearby` / `create` / `profile` הם Client Components — metadata מוגדר ב־server `layout.tsx` בכל נתיב.
- הגדירו `NEXT_PUBLIC_SITE_URL` בפרודקשן (למשל Vercel) לדומיין האמיתי.
