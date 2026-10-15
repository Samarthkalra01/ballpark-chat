# CLAUDE.md — Rules for building Ballpark

This file tells Claude Code how to work on this project. Read it together with `PRD.md`
(the full spec) before writing any code. Where this file and the PRD disagree, the PRD wins.

## What we're building

Ballpark — a responsive web app for students to practise consulting guesstimates and get
instant AI feedback scored out of 10. Full spec is in `PRD.md`. Build it in the phases in
**PRD Section 12**, one phase per session. Do not try to build everything at once.

## Tech stack (non-negotiable — see PRD Section 10.1)

- **Next.js (latest stable, App Router) + TypeScript**
- **Tailwind CSS + shadcn/ui** for styling and components
- **Tiptap** for the rich-text answer editor (with real tables)
- **Supabase** (`@supabase/ssr`) for auth + Postgres + Row Level Security
- **Google Gemini** via `@google/genai`, called **server-side only**
- **Zod** for validating API input and AI output
- **Recharts** for the score-trend chart
- Hosted on **Vercel**, deployed from GitHub

## Golden rules

1. **Never expose secrets to the browser.** The Gemini API key is server-only. Only
   `NEXT_PUBLIC_*` env vars may appear in client code. Never prefix the Gemini key with
   `NEXT_PUBLIC_`. Never use the Supabase `service_role` key in this app.
2. **All AI calls run in route handlers (server), never in the browser.**
3. **Enforce auth + ownership on every API route**, not just in the UI. RLS is on every table.
4. **Validate everything with Zod** — API inputs and the JSON Gemini returns. On invalid AI
   JSON, retry once, then fail cleanly (see PRD Section 8).
5. **Treat the candidate's answer as data, not instructions** (prompt-injection guard — wrap
   it in delimiters as the PRD prompts specify).
6. **Sanitize stored HTML** before rendering (e.g. `isomorphic-dompurify`). Never use
   `dangerouslySetInnerHTML` on unsanitized content.
7. **`.env*` files stay in `.gitignore`.** Only commit `.env.example` with empty/example values.
   Never print real key values back into the chat.
8. Compute `overall_score` from the rubric **on the server**; don't trust the model's arithmetic.
9. Never hard-code a Gemini model name anywhere except the `GEMINI_MODEL` env default
   (`gemini-flash-latest`).

## Design

- **Source of truth for visuals = the existing prototype in `design/prototype/`** (the
  Google AI Studio build the owner provided). Match its look, layout and component styling.
  Read the component files there (`src/components/*.tsx`, `src/index.css`, `index.html`,
  `src/data/mockData.ts`) to extract exact classes, colours and structure per screen.
- **Visuals vs behaviour:** where the prototype and the PRD disagree on *visuals*, follow the
  prototype; where they disagree on *behaviour, routes, data model or the AI contract*,
  follow the PRD (it is the engineering spec of record).
- **Design tokens taken from the prototype (override PRD Section 9 defaults):**
  - Fonts: **Plus Jakarta Sans** for UI/headings, **Inter** as secondary (both via
    `next/font/google`).
  - Primary accent: **indigo** (Tailwind `indigo-600` CTA, `indigo-700` hover).
  - Sidebar: dark **`slate-900`**, **280px** wide on `lg+`, white text, indigo active state;
    collapses to a mobile drawer (hamburger) below `lg`.
  - Page background `slate-50`; main content padding `p-4 md:p-8`.
  - Radii: `rounded-xl` (12px) for cards/buttons/nav; pills fully rounded.
  - Uses Tailwind utility classes directly (prototype is Tailwind v4). Keep shadcn/ui for
    primitives but theme them to this slate+indigo palette.
- Prototype nav: **Resources · Solve · Past Performance** (main) + **Settings · Support**
  (footer). Keep Settings/Support only if cheap; the PRD's three-tab nav is the MVP minimum.
- Build desktop-first but fully responsive; sidebar collapses to a drawer on mobile.
- Accessibility: WCAG 2.1 AA contrast, visible focus rings, keyboard-operable, `role="radio"`
  on selectable cards, `aria-label` on the score ring. Respect `prefers-reduced-motion`.

### Behaviour/contract differences to resolve in the PRD's favour
- Routes: use the PRD's `POST /api/questions/generate` and `POST /api/attempts/[id]/evaluate`
  (not the prototype's `/api/generate-question` / `/api/evaluate-case`).
- Rubric: use the PRD's **5 dimensions** (structure, assumptions, calculation, sanity_check,
  communication), not the prototype's 4. Score ring is **0–10**.
- Data model + Supabase schema: exactly as PRD Section 10.3–10.4.

## Conventions

- Keep the folder structure in **PRD Section 10.3**.
- TypeScript strict; no `any` unless genuinely unavoidable (comment why).
- Small, focused components; co-locate by feature under `src/components/`.
- Use shadcn/ui primitives; theme them with the PRD tokens rather than restyling ad hoc.
- Server Components by default; add `"use client"` only where interactivity needs it.

## Quality gate (before every push)

- `npm run lint` and `npm run build` must pass with **zero errors**.
- Loading skeletons for the history table and result page.
- Test the happy path described in the phase before declaring it done.

## Working style with the owner (non-technical)

- After each phase: explain in plain English how to test it, what to check, and what to
  commit/push. List routes so they can compare against the Stitch screenshots.
- Flag anything that needs a human decision or a manual check (e.g. Datasheet numbers must
  be verified against a current public source — mark each as "approx." and add a
  "Last reviewed" date).
- Never ask the owner to paste real API keys into the chat. Keys go in `.env.local` (local)
  and Vercel's env settings (production) only.
