# Ballpark

Practice consulting guesstimates and get interviewer-style AI feedback scored out of 10.
Built with Next.js 16 (App Router), Tailwind v4, Supabase (auth + Postgres + RLS),
Google Gemini, Tiptap and Recharts.

## Run it locally

1. **Install deps** (already done if you cloned a built checkout):
   ```bash
   npm install --legacy-peer-deps
   ```
2. **Set up Supabase:** create a project, open **SQL Editor**, paste and run
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). Then
   **Authentication → Providers → Email**: enable it, and turn **Confirm email** OFF for an easy
   start. Under **Authentication → URL Configuration**, add `http://localhost:3000/**` to
   Redirect URLs.
3. **Get a Gemini key** from [Google AI Studio](https://aistudio.google.com) → Get API key.
4. **Fill `.env.local`** (copy from [`.env.example`](.env.example)) — no quotes, no spaces:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx   (or eyJ…)
   GEMINI_API_KEY=AIza…
   GEMINI_MODEL=gemini-flash-latest
   DAILY_GENERATION_LIMIT=30
   DAILY_EVALUATION_LIMIT=20
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
5. **Start it:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Quality gate

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # next build
```

All three must pass before pushing. They are green as of the initial build.

## Deploy (Vercel)

1. Push to GitHub, import the repo at https://vercel.com/new.
2. Add every variable from `.env.local` in **Settings → Environment Variables**, but set
   `NEXT_PUBLIC_SITE_URL` to your production URL (e.g. `https://www.yourdomain.com`).
3. Deploy, then add the production and `.vercel.app` URLs to Supabase **Redirect URLs** and set
   the Supabase **Site URL** to your domain.
4. Add your domain in **Vercel → Settings → Domains** and create the A / CNAME records it shows
   at your DNS provider. (This domain's DNS is on NS1 — add the records there; don't change
   nameservers.)

See `SETUP_AND_DEPLOY_GUIDE.md` for the full click-by-click walkthrough.

## Project layout

- `src/app` — routes (marketing `/`, auth, `(app)` sidebar shell, `api/*` route handlers)
- `src/components` — `ui/`, `layout/`, `solve/`, `results/`, `history/`, `auth/`
- `src/lib` — `supabase/`, `ai/` (Gemini, prompts, Zod schemas), limits, html-to-text
- `src/content/resources.ts` — the 5 learning articles
- `src/data/question-bank.ts` — 40-question fallback bank
- `supabase/migrations/` — database schema
- `design/prototype/` — the original design reference (not part of the build)

## Notes

- The Gemini key is **server-only**; AI calls run exclusively in route handlers.
- UI primitives are hand-built with Tailwind (styled to the prototype) rather than the shadcn
  CLI, for reliability on Next 16 + Tailwind v4.
- Datasheet numbers in the Resources article are marked **approx.** and must be verified against
  a current public source before launch; set the "Last reviewed" date then.
