# Ballpark — Product Requirements Document (PRD) & Technical Spec

> **How to use this file:** Put this file in the root of the project folder. Claude Code reads it to build the app. Build in the phases listed in Section 12, one phase per session. Do not ask Claude Code to build everything in one go.

| Field | Value |
|---|---|
| Product | Ballpark — consulting guesstimate practice |
| Version | v1.0 (MVP) |
| Platform | Responsive web app (desktop-first, works on mobile) |
| Hosting | Vercel, connected to the owner's custom domain |
| Design source | Google Stitch export in `/design/stitch/` (screens + HTML) |
| Existing prototype | https://ballpark.ai.studio (Google AI Studio build — reference only) |
| Status | Ready to build |

---

## 1. Summary

Ballpark is a focused practice tool for students preparing for management consulting interviews. A student picks a guesstimate type and difficulty, gets a question, writes their structured approach (with tables for the maths), and receives instant AI feedback scored out of 10. Every attempt is saved so they can track progress over time. A Resources hub teaches the core frameworks.

**One-line pitch:** "Practice guesstimates the way you'll be tested, and get interviewer-style feedback in seconds."

---

## 2. Problem & Opportunity

- Guesstimates appear in nearly every consulting case interview, and students practice them alone with no feedback, or wait days for a peer to review.
- Existing prep material is static (PDF casebooks, YouTube). Nothing scores the *structure* of an answer, which is what interviewers actually grade.
- Students lack a single place to (a) learn the method, (b) practise by type and difficulty, and (c) see whether they're improving.

---

## 3. Target User

**Primary persona — "Aspiring Consultant Aditi"**
- Undergraduate or postgraduate student (B-school, IIT/NIT, top colleges) targeting MBB / Big 4 / boutique consulting roles.
- High-achieving, time-poor, practises in 20–40 minute sessions, often late at night.
- Comfortable with frameworks in theory but unsure if her structure is "MECE enough" or her assumptions are sensible.
- Wants: realistic questions, honest scoring, specific fixes, visible progress.

**Jobs to be done**
1. "Teach me the method quickly before I start practising."
2. "Give me a question of the type and difficulty I need right now."
3. "Tell me exactly what an interviewer would like and dislike in my answer."
4. "Show me whether I'm getting better."

---

## 4. Goals & Success Metrics

| Goal | Metric | MVP target (first 60 days) |
|---|---|---|
| Activation | % of sign-ups who submit ≥1 answer | ≥ 60% |
| Engagement | Avg. attempts per active user per week | ≥ 3 |
| Retention | Week-2 return rate | ≥ 30% |
| Quality | % of feedback rated "helpful" (thumbs up) | ≥ 75% |
| Reliability | Successful AI evaluations / total submissions | ≥ 98% |
| Speed | Median time from Submit → feedback shown | ≤ 15 s |

**Non-goals for v1:** live mock interviews with humans, voice answers, payments/subscriptions, leaderboards, mobile apps, admin CMS.

---

## 5. Scope

### 5.1 In scope (MVP)
- Sign up / log in (email + password; Google sign-in optional, Phase 7)
- Resources hub with 5 learning articles
- Solve: configure (category + difficulty) → AI-generated question
- Active practice: rich text editor with tables, autosave draft, timer
- AI evaluation: score /10, strengths, improvements, rubric breakdown, model approach
- Past Performance: table of all attempts, filters, click to re-open feedback
- Responsive layout with left sidebar (collapses to a top bar / drawer on mobile)
- Deployed on Vercel at the custom domain with HTTPS

### 5.2 Out of scope (later)
- Payments, premium tiers
- Peer review, sharing answers publicly
- Voice/video answers, live timer pressure modes
- Admin dashboard to curate questions (use the seed file for now)

---

## 6. Information Architecture & Navigation

Left sidebar (deep navy) with logo "Ballpark" at top and three tabs:

1. **Resources** → `/resources`
2. **Solve** → `/solve`
3. **Past Performance** → `/history`

Bottom of sidebar: user name/avatar, "Log out".

### Route map

| Route | Screen | Auth required |
|---|---|---|
| `/` | Public landing page (hero, 3 value props, CTA "Start practising") — redirect to `/resources` if logged in | No |
| `/login`, `/signup` | Auth screens | No |
| `/auth/callback` | Supabase auth code exchange (route handler) | No |
| `/resources` | **Screen 1** – Dashboard / Resources hub | Yes |
| `/resources/[slug]` | Resource article page | Yes |
| `/solve` | **Screen 2** – Configuration | Yes |
| `/solve/[attemptId]` | **Screen 3** – Active practice | Yes |
| `/solve/[attemptId]/result` | **Screen 4 (top)** – AI feedback | Yes |
| `/history` | **Screen 4 (bottom)** – Past Performance table | Yes |

---

## 7. Functional Requirements (by screen)

> Match the layouts, spacing and visual style in `/design/stitch/`. Where the Stitch design and this PRD disagree on *visuals*, follow Stitch. Where they disagree on *behaviour*, follow this PRD.

### Screen 1 — Dashboard / Resources Hub (`/resources`)
- **FR-1.1** Welcome header: "Welcome back, {firstName} 👋" + subtitle "Sharpen your structure before you solve." (first-time users see "Welcome, {firstName}").
- **FR-1.2** Optional stats strip under the header (only if the user has ≥1 attempt): Total attempts · Average score · Best category.
- **FR-1.3** Responsive card grid (3 columns desktop, 2 tablet, 1 mobile) with 5 cards:

| Card | Slug | Icon (lucide-react) | Card subtitle |
|---|---|---|---|
| How to approach a guesstimate | `how-to-approach` | `Compass` | The 5-step method interviewers expect |
| Datasheet | `datasheet` | `Table2` | Handy numbers to anchor your assumptions |
| TAM-SAM-SOM | `tam-sam-som` | `Target` | Size the total, serviceable and obtainable market |
| Market Sizing | `market-sizing` | `PieChart` | Top-down vs bottom-up, with worked examples |
| MECE Approach | `mece` | `Layers` | Build structures with no gaps and no overlaps |

- **FR-1.4** Each card: ice-blue icon tile, title, one-line subtitle, "Read →" link. Hover: lift 2px, shadow, border turns royal blue (150–200 ms ease). Whole card is clickable and keyboard-focusable.
- **FR-1.5** A CTA banner at the bottom: "Ready to practise?" + royal blue button "Start a guesstimate" → `/solve`.
- **FR-1.6** Article pages render from local content files (`/content/resources/*.mdx` or `.ts`). Each article: title, read time, body with headings, examples, and a "Practise this now" button that deep-links to `/solve?category=…`.

**Article content outlines (Claude Code writes the full text, 500–900 words each, in clear student-friendly language):**
1. *How to approach a guesstimate* — Clarify the question → Choose approach (top-down / bottom-up / supply / demand) → Build a MECE tree → State assumptions with reasons → Calculate step by step → Sanity check → Summarise the answer. Include a worked example: "Number of cups of chai sold in Delhi per day".
2. *Datasheet* — table of round-number anchors (population, households, urban/rural split, age bands, smartphone users, vehicles, life expectancy, working days, hours) for India and the world. **Every number must be labelled "approx." and the owner must verify against a current public source before launch.** Add a "Last reviewed: {date}" line.
3. *TAM-SAM-SOM* — definitions, a diagram (nested circles in CSS/SVG), worked example (e.g., online test-prep for consulting aspirants in India), common mistakes.
4. *Market Sizing* — top-down vs bottom-up, demand vs supply side, when to use which, a worked example each, sanity-check techniques.
5. *MECE Approach* — what MECE means, segmentation axes (age, income, geography, usage), issue trees, examples of non-MECE vs MECE breakdowns.

### Screen 2 — Configuration (`/solve`)
- **FR-2.1** Page title "Set up your practice" + subtitle.
- **FR-2.2** Section 1 "What do you want to practise?" — 4 selectable cards (single select, radio-group semantics):

| Category | Key | Icon | Helper text |
|---|---|---|---|
| Revenue / Profit Estimation | `revenue_profit` | `IndianRupee` | Estimate a business's revenue or profit |
| Mathematical | `mathematical` | `Calculator` | Pure estimation with numbers and logic |
| Market Sizing | `market_sizing` | `PieChart` | Size a market or customer base |
| Unconventional | `unconventional` | `Lightbulb` | Quirky, creative estimation questions |

  Selected state: royal blue 2px border, ice-blue fill, check badge top-right.
- **FR-2.3** Section 2 "Difficulty" — pill segmented control: `Easy` · `Medium` · `Challenging` (default Medium).
- **FR-2.4** Optional field "Geography" select: India (default) / Global.
- **FR-2.5** Primary button "Generate Question" (royal blue, full width on mobile). Disabled until a category is selected. On click: loading state "Crafting your question…" (spinner), call `POST /api/questions/generate`, then redirect to `/solve/[attemptId]`.
- **FR-2.6** Pre-select category from `?category=` query param (used by resource articles).
- **FR-2.7** If generation fails, fall back to a random question from the seed bank (`/data/question-bank.ts`) matching category + difficulty, and show no error to the user (log it server-side).

### Screen 3 — Active Practice (`/solve/[attemptId]`)
- **FR-3.1** Centered focus container (max-width ~880px), sidebar still visible on desktop.
- **FR-3.2** Top: category chip + difficulty chip, then the question in large text (24–28px, semibold, navy). A small "Clarifying info" expandable area if the AI returned clarifications (e.g., "Assume a typical weekday").
- **FR-3.3** Elapsed timer (mm:ss) top-right, with pause. Time spent is saved on submit.
- **FR-3.4** Rich text editor (Tiptap) with placeholder: "Start with how you'll break this problem down. State your assumptions, then calculate step by step…"
- **FR-3.5** Utility/formatting bar: Bold, Italic, Heading, Bullet list, Numbered list, **Add Table** (inserts a 3×3 table with header row), table controls when cursor is in a table (add/remove row, add/remove column, delete table), Undo/Redo.
- **FR-3.6** Autosave the draft to `localStorage` every 5 s and on blur (key `ballpark:draft:{attemptId}`); restore on reload. Show "Saved" indicator.
- **FR-3.7** Word counter. Minimum 40 words to submit; show helper text if below.
- **FR-3.8** "Submit for Evaluation" button bottom-right. Confirm dialog: "Submit your answer? You can't edit it after submitting." On confirm → `POST /api/attempts/[id]/evaluate` → loading state with rotating tips ("Checking if your structure is MECE…", "Sanity-checking your maths…") → redirect to `/solve/[id]/result`.
- **FR-3.9** "Skip question" text link → marks attempt `abandoned` and returns to `/solve`.
- **FR-3.10** If the attempt is already evaluated, redirect to its result page.

### Screen 4 — AI Feedback (`/solve/[attemptId]/result`) & Past Performance (`/history`)

**Results card (top)**
- **FR-4.1** Circular score ring (SVG) showing `8/10`, colour by band: 0–4 orange-red, 5–6 amber, 7–8 royal blue, 9–10 green. One-line verdict under it (e.g., "Strong structure, shaky assumptions").
- **FR-4.2** Green panel "What you did well" — 2–4 bullets.
- **FR-4.3** Orange panel "Areas for improvement" — 2–4 bullets, each actionable.
- **FR-4.4** Rubric breakdown — 5 horizontal bars, each scored 0–10: Structure (MECE), Assumptions, Calculation accuracy, Sanity check, Communication.
- **FR-4.5** Collapsible "How an interviewer might approach it" — a model approach in 5–8 steps with a reasonable answer range.
- **FR-4.6** Collapsible "Your answer" (read-only render of the submitted HTML).
- **FR-4.7** Actions: "Try another" (back to `/solve` with same settings pre-selected), "Retry this question" (new attempt, same question), "View all attempts" (`/history`).
- **FR-4.8** Feedback helpfulness: 👍 / 👎 buttons, saved to the attempt.

**Past Performance (bottom of result page shows last 5; `/history` shows all)**
- **FR-4.9** Data table columns: **Date** (e.g., "14 Oct 2026"), **Question** (truncated, tooltip with full text), **Question Category**, **Difficulty** (coloured pill), **AI Rating** (e.g., "8/10" with coloured dot).
- **FR-4.10** Sort by date (default newest first) and rating. Filters: category, difficulty. Pagination 10 per page.
- **FR-4.11** Row click → that attempt's result page.
- **FR-4.12** Summary cards above the table: Total attempts, Average score, Best category, Current streak (days in a row with ≥1 submission).
- **FR-4.13** Simple line chart of score over last 20 attempts (Recharts).
- **FR-4.14** Empty state: illustration/icon + "No attempts yet" + "Start your first guesstimate" button.
- **FR-4.15** For local development and design review only, a seed script can insert ~8 mock attempts for a test user so the populated state can be seen. Never show mock data to real users.

### Auth & account
- **FR-5.1** Sign up with full name, email, password (min 8 chars). Log in. Log out. Forgot password (Supabase reset email).
- **FR-5.2** All app routes except `/`, `/login`, `/signup`, `/auth/*` redirect to `/login` if logged out.
- **FR-5.3** A `profiles` row is created automatically on sign-up (DB trigger) with the full name.

### Usage limits (protects the free AI quota)
- **FR-6.1** Max **30 question generations** and **20 evaluations** per user per day (env-configurable). When reached, show a friendly message: "You've hit today's practice limit — come back tomorrow!"

---

## 8. AI Specification

### 8.1 Provider
- **Google Gemini API** via the official `@google/genai` SDK, called **only from the server** (route handlers). The API key must never reach the browser.
- Model set by env var `GEMINI_MODEL`. Default `gemini-flash-latest` (an alias that tracks the current Flash model). Older model IDs get retired, so never hard-code a model name anywhere except the env default.
- Use JSON mode (`responseMimeType: "application/json"` + a response schema) and validate every response with **Zod**. On invalid JSON, retry once; on second failure return a clean error.
- Timeout: 30 s per call.

### 8.2 Question generation — `POST /api/questions/generate`
**Request:** `{ category, difficulty, geography }`
**Server steps:** auth check → daily limit check → call Gemini → validate → insert `attempts` row (status `in_progress`) → return `{ attemptId }`.
**To reduce repeats:** pass the user's last 15 question texts in the prompt as "do not repeat".

**System prompt (generation):**
```
You are a senior interviewer at a top management consulting firm. Write ONE guesstimate
interview question.

Category: {category_label}
Difficulty: {difficulty}
Geography: {geography}

Difficulty guide:
- Easy: single-segment, 3–4 steps, everyday context (e.g., cups of tea sold at a railway station per day).
- Medium: 2–3 segments, 5–7 steps, needs one sensible segmentation.
- Challenging: multi-segment, supply AND demand angles possible, ambiguity the candidate must clarify.

Category guide:
- revenue_profit: estimate annual revenue or profit of a specific business/outlet/product line.
- mathematical: pure estimation of a count or quantity (e.g., number of tennis balls that fit in a bus).
- market_sizing: size a market in units or value for a product/service.
- unconventional: quirky or creative (e.g., how many hairs on a human head, litres of water in a stadium).

Rules:
- Make it realistic for {geography}. Use specific, relatable settings.
- One sentence, under 30 words. No answer, no hints in the question.
- Do not repeat or closely paraphrase any of these: {recent_questions}

Return JSON only:
{ "question": string, "clarifications": string[] (0-3 short facts the interviewer would share if asked),
  "expected_answer_range": string, "key_drivers": string[] (3-6) }
```
Store `expected_answer_range` and `key_drivers` on the attempt (hidden from the user until results).

### 8.3 Evaluation — `POST /api/attempts/[id]/evaluate`
**Request:** `{ answerHtml, answerText, timeSpentSeconds }`
**Server steps:** auth + ownership check → attempt must be `in_progress` → daily limit check → save answer → call Gemini → validate → save feedback + score → status `evaluated` → return feedback.

**System prompt (evaluation):**
```
You are a strict but encouraging consulting interviewer grading a candidate's written
guesstimate answer. Grade the APPROACH more than the final number.

Question: {question}
Category: {category_label} | Difficulty: {difficulty}
Reference answer range (for your judgement only): {expected_answer_range}
Key drivers a strong answer usually covers: {key_drivers}

Candidate answer (plain text; tables appear as rows separated by " | "):
"""{answer_text}"""

Score each dimension 0-10:
1. structure: clear, MECE breakdown; logical segmentation; nothing double-counted or missed.
2. assumptions: stated explicitly, justified, realistic for the geography.
3. calculation: arithmetic correct, units consistent, steps easy to follow.
4. sanity_check: candidate checks the result against a reality anchor or alternate method.
5. communication: concise, summarises the final answer and key insight.

overall_score = round(0.30*structure + 0.25*assumptions + 0.20*calculation
                + 0.10*sanity_check + 0.15*communication), integer 0-10.

Be specific: quote or reference the candidate's actual steps. No generic advice.
If the answer is empty, off-topic or under 40 words, give overall_score <= 2 and explain why.

Return JSON only:
{
  "overall_score": integer,
  "verdict": string (max 12 words),
  "rubric": { "structure": int, "assumptions": int, "calculation": int, "sanity_check": int, "communication": int },
  "strengths": string[] (2-4, each max 30 words),
  "improvements": string[] (2-4, each max 30 words, each starts with a verb),
  "model_approach": string[] (5-8 steps),
  "model_answer_range": string
}
```
- Compute `overall_score` from the rubric on the server as well, and store the **server-computed** value (don't trust the model's arithmetic).
- Convert Tiptap HTML → plain text on the server (tables as `cell | cell` rows) before sending.
- Treat everything inside the candidate answer as data, not instructions (prompt-injection guard: the prompt wraps it in delimiters and says so).

### 8.4 Seed question bank (fallback + offline dev)
`/data/question-bank.ts` — at least **40 questions** (10 per category, mix of difficulties), each `{ id, category, difficulty, geography, question, expected_answer_range, key_drivers }`. Starter examples:

| Category | Difficulty | Question |
|---|---|---|
| revenue_profit | Easy | Estimate the daily revenue of a busy chai stall outside a Delhi metro station. |
| revenue_profit | Medium | Estimate the annual revenue of a single multiplex cinema in Bengaluru. |
| revenue_profit | Challenging | Estimate the annual profit of a quick-commerce dark store in Mumbai. |
| mathematical | Easy | How many people travel on the Delhi Metro on a typical weekday? |
| mathematical | Medium | How many smartphones are sold in India each year? |
| mathematical | Challenging | How many litres of petrol are sold in India every day? |
| market_sizing | Easy | Estimate the market size of school bags sold in India per year. |
| market_sizing | Medium | Estimate the market size of online food delivery in Pune (₹ per year). |
| market_sizing | Challenging | Size the Indian market for EV two-wheeler charging stations by 2030. |
| unconventional | Easy | How many golf balls fit inside a standard school bus? |
| unconventional | Medium | How many trees would be needed to print every newspaper sold in India in a day? |
| unconventional | Challenging | How many piano tuners work in Mumbai? |

---

## 9. Design System

> **Source of truth:** the Stitch export in `/design/stitch/`. Extract exact hex values, radii and spacing from the exported HTML/DESIGN files first; use the defaults below only where Stitch is silent.

### 9.1 Colour tokens (defaults)
| Token | Hex | Use |
|---|---|---|
| `--navy-900` | `#0B1E3F` | Sidebar, page headers, question text |
| `--navy-700` | `#1E3A6B` | Secondary headings, active nav text |
| `--royal-600` | `#2563EB` | Primary CTA buttons, links, selected states |
| `--royal-700` | `#1D4ED8` | CTA hover |
| `--ice-50` | `#F2F7FF` | Section backgrounds |
| `--ice-100` | `#E6F0FF` | Cards, icon tiles, selected card fill |
| `--ice-200` | `#CFE0FF` | Borders, dividers |
| `--white` | `#FFFFFF` | Main canvas |
| `--slate-600` | `#475569` | Body text |
| `--slate-400` | `#94A3B8` | Placeholder, muted text |
| `--success-50 / 600` | `#ECFDF3 / #16A34A` | "What you did well" panel |
| `--warning-50 / 600` | `#FFF4E5 / #EA7A0C` | "Areas for improvement" panel |
| `--danger-600` | `#DC2626` | Errors |

### 9.2 Typography
- Font: **Inter** via `next/font/google` (fallback: system sans-serif).
- Scale: Display 32/40 semibold · H1 28/36 semibold · H2 22/30 semibold · H3 18/26 semibold · Body 16/24 regular · Small 14/20 · Caption 12/16.

### 9.3 Layout & components
- Sidebar 248px fixed on ≥1024px; collapses to a top bar with hamburger drawer below that.
- Content max-width 1200px, 32px padding desktop, 16px mobile.
- Radius: cards 16px, buttons/inputs 10px, pills 999px.
- Shadows: `0 1px 2px rgba(11,30,63,.06)` resting; `0 8px 24px rgba(11,30,63,.10)` hover.
- Components via **shadcn/ui** (Button, Card, Dialog, Select, Table, Tabs, Tooltip, Toast/Sonner, Skeleton, DropdownMenu, Sheet), themed with the tokens above.
- Icons: **lucide-react**, 20–24px, stroke 1.75.
- Motion: 150–200 ms ease-out; respect `prefers-reduced-motion`.

### 9.4 Accessibility
- WCAG 2.1 AA contrast, visible focus rings (royal blue 2px), all interactive elements keyboard-operable, selectable cards use `role="radio"`, score ring has an `aria-label` ("Score 8 out of 10").

---

## 10. Technical Architecture

### 10.1 Stack
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (latest stable, App Router) + TypeScript** | Best-supported on Vercel; frontend + API in one project |
| Styling | **Tailwind CSS + shadcn/ui** | Fast to match Stitch designs, consistent components |
| Editor | **Tiptap** (`@tiptap/react`, `@tiptap/starter-kit`, table extensions, placeholder) | Rich text + real tables |
| Auth + DB | **Supabase** (Postgres, Auth, Row Level Security) via `@supabase/ssr` | Free tier, auth built in, simple dashboard |
| AI | **Gemini API** via `@google/genai` | Free tier key from Google AI Studio |
| Validation | **Zod** | Validate API input and AI output |
| Charts | **Recharts** | Score-trend line chart |
| Hosting | **Vercel** (Hobby/free to start) | Git-push deploys, free HTTPS, custom domains |
| Analytics | `@vercel/analytics` (optional) | Page views, zero config |

> Next.js 16+ renamed `middleware.ts` to **`proxy.ts`** (export a function named `proxy`). Use whichever convention the installed Next.js version expects.

### 10.2 Architecture diagram
```
 Browser (student)
   │  HTTPS
   ▼
 Vercel ──────────────────────────────────────────────────────────┐
 │ Next.js app                                                     │
 │  • Pages (React Server + Client Components)                     │
 │  • proxy.ts  → refreshes Supabase session, guards routes        │
 │  • Route handlers (server only):                                │
 │      POST /api/questions/generate ──┐                           │
 │      POST /api/attempts/[id]/evaluate┤                          │
 │      POST /api/attempts/[id]/feedback│                          │
 └─────────────────────────────────────┼──────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────┐
            ▼                                         ▼
   Supabase (Postgres + Auth)                 Google Gemini API
   • auth.users, profiles, attempts           • question generation
   • Row Level Security per user              • answer evaluation
```

### 10.3 Folder structure
```
ballpark/
├─ CLAUDE.md                  # rules for Claude Code
├─ PRD.md                     # this file
├─ design/stitch/             # Stitch export (HTML + PNG per screen) — reference only
├─ supabase/migrations/       # SQL schema files
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/page.tsx           # landing
│  │  ├─ (auth)/login/page.tsx
│  │  ├─ (auth)/signup/page.tsx
│  │  ├─ auth/callback/route.ts
│  │  ├─ (app)/layout.tsx               # sidebar shell
│  │  ├─ (app)/resources/page.tsx
│  │  ├─ (app)/resources/[slug]/page.tsx
│  │  ├─ (app)/solve/page.tsx
│  │  ├─ (app)/solve/[attemptId]/page.tsx
│  │  ├─ (app)/solve/[attemptId]/result/page.tsx
│  │  ├─ (app)/history/page.tsx
│  │  └─ api/
│  │     ├─ questions/generate/route.ts
│  │     └─ attempts/[id]/{evaluate,feedback}/route.ts
│  ├─ components/ (ui/, layout/, solve/, results/, history/, resources/)
│  ├─ content/resources/      # 5 articles
│  ├─ data/question-bank.ts
│  ├─ lib/
│  │  ├─ supabase/{client,server,proxy}.ts
│  │  ├─ ai/{gemini.ts,prompts.ts,schemas.ts}
│  │  ├─ limits.ts
│  │  └─ html-to-text.ts
│  └─ types/
├─ proxy.ts (or middleware.ts on older Next.js)
├─ .env.example
└─ README.md
```

### 10.4 Database schema (run in Supabase SQL Editor, or save as `supabase/migrations/0001_init.sql`)
```sql
-- PROFILES -----------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles for update using (auth.uid() = id);

-- auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ATTEMPTS -----------------------------------------------------------
create type public.question_category as enum ('revenue_profit','mathematical','market_sizing','unconventional');
create type public.difficulty_level  as enum ('easy','medium','challenging');
create type public.attempt_status    as enum ('in_progress','evaluated','abandoned');

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category public.question_category not null,
  difficulty public.difficulty_level not null,
  geography text not null default 'India',
  question text not null,
  clarifications jsonb not null default '[]',
  expected_answer_range text,
  key_drivers jsonb not null default '[]',
  source text not null default 'ai',            -- 'ai' | 'bank'
  answer_html text,
  answer_text text,
  time_spent_seconds int,
  status public.attempt_status not null default 'in_progress',
  score int check (score between 0 and 10),
  rubric jsonb,
  feedback jsonb,                               -- full evaluation JSON
  helpful boolean,
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  evaluated_at timestamptz
);

create index attempts_user_created_idx on public.attempts (user_id, created_at desc);

alter table public.attempts enable row level security;

create policy "attempts: read own"   on public.attempts for select using (auth.uid() = user_id);
create policy "attempts: insert own" on public.attempts for insert with check (auth.uid() = user_id);
create policy "attempts: update own" on public.attempts for update using (auth.uid() = user_id);

-- USAGE (daily limits) ------------------------------------------------
create table public.usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default (now() at time zone 'Asia/Kolkata')::date,
  generations int not null default 0,
  evaluations int not null default 0,
  primary key (user_id, day)
);

alter table public.usage_daily enable row level security;
create policy "usage: read own" on public.usage_daily for select using (auth.uid() = user_id);
-- writes happen server-side through the increment function below

create or replace function public.increment_usage(kind text, max_allowed int)
returns boolean language plpgsql security definer set search_path = public as $$
declare current_count int;
begin
  insert into public.usage_daily (user_id) values (auth.uid())
  on conflict (user_id, day) do nothing;

  if kind = 'generation' then
    update public.usage_daily set generations = generations + 1
     where user_id = auth.uid() and day = (now() at time zone 'Asia/Kolkata')::date
       and generations < max_allowed
     returning generations into current_count;
  else
    update public.usage_daily set evaluations = evaluations + 1
     where user_id = auth.uid() and day = (now() at time zone 'Asia/Kolkata')::date
       and evaluations < max_allowed
     returning evaluations into current_count;
  end if;

  return current_count is not null;   -- false = limit reached
end; $$;
```

### 10.5 Environment variables
| Name | Where it's used | Secret? | Example |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server | No | `https://abcd1234.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser + server | No (public by design; protected by RLS). Supabase may label it **"publishable key"** | `sb_publishable_…` or `eyJ…` |
| `GEMINI_API_KEY` | server only | **Yes** | `AIza…` |
| `GEMINI_MODEL` | server only | No | `gemini-flash-latest` |
| `DAILY_GENERATION_LIMIT` | server only | No | `30` |
| `DAILY_EVALUATION_LIMIT` | server only | No | `20` |
| `NEXT_PUBLIC_SITE_URL` | auth redirects, metadata | No | `http://localhost:3000` locally, `https://yourdomain.com` in production |

Rules: only variables starting with `NEXT_PUBLIC_` are visible in the browser. **Never** prefix the Gemini key with `NEXT_PUBLIC_`. **Never** use the Supabase `service_role` / secret key in this app.

### 10.6 Security & privacy
- RLS on every table; every API route re-checks the logged-in user and attempt ownership.
- Input validation with Zod (category/difficulty enums, answer max 20,000 chars).
- AI calls server-side only; per-user daily limits; generic error messages to users, details in server logs.
- Sanitize stored HTML before rendering (e.g., `isomorphic-dompurify`) — never `dangerouslySetInnerHTML` unsanitized.
- `.env*` files in `.gitignore`. Only `.env.example` (no real values) is committed.
- Privacy note in footer: answers are stored to show your history and are sent to Google's Gemini API for evaluation.

### 10.7 Performance & quality
- Lighthouse ≥ 90 for Performance, Accessibility, Best Practices on `/resources`.
- Loading skeletons for history table and result page; optimistic UI for helpful 👍/👎.
- `npm run build` and `npm run lint` must pass with zero errors before every push.

---

## 11. Edge Cases

| Case | Expected behaviour |
|---|---|
| Gemini down / quota hit during generation | Serve a seed-bank question silently (`source = 'bank'`) |
| Gemini down during evaluation | Keep the answer saved (status stays `in_progress`), toast "Evaluation failed — your answer is saved. Try again." with Retry button |
| Invalid JSON from Gemini | Retry once, then treat as failure |
| User refreshes mid-answer | Draft restored from localStorage |
| User opens someone else's attempt URL | 404 page (RLS returns nothing) |
| Daily limit reached | Friendly limit message, Generate/Submit buttons disabled |
| Answer < 40 words | Submit disabled with helper text |
| Very long answer | Hard cap 20,000 characters with counter |
| Session expired | Redirect to `/login?next={current path}`; draft still in localStorage |
| Mobile | Editor toolbar scrolls horizontally; tables scroll inside a wrapper |

---

## 12. Build Plan (one Claude Code session per phase)

| Phase | Deliverable | Done when… |
|---|---|---|
| **0. Setup** | Next.js + TS + Tailwind + shadcn/ui + Inter + tokens; `.env.example`; README | `npm run dev` shows a blank themed page; build passes |
| **1. Shell & static UI** | Sidebar layout + all 4 screens built with **mock data**, matching `/design/stitch/` | Every screen visually matches Stitch on desktop and mobile |
| **2. Auth & database** | Supabase clients, proxy/middleware route guard, login/signup/logout, SQL migration | Can sign up, log in, log out; protected pages redirect |
| **3. Resources content** | 5 articles + article page + deep links | All 5 cards open full articles |
| **4. Solve flow + AI** | Generation API, attempt creation, Tiptap editor with tables, autosave, timer, evaluation API, result page | End-to-end: generate → answer → submit → see real AI feedback |
| **5. Past Performance** | History table with filters/sort/pagination, summary cards, trend chart, empty state | Real attempts listed; clicking a row opens feedback |
| **6. Hardening** | Daily limits, error states, fallback bank, sanitization, a11y pass, SEO metadata, favicon, 404 page | Edge-case table (Section 11) all behave as specified |
| **7. Launch** | Deploy to Vercel, custom domain, production auth URLs; optional Google sign-in | Live on the domain over HTTPS; full flow works in production |

---

## 13. Acceptance Checklist (launch gate)

- [ ] All 4 screens match the Stitch designs (desktop + mobile).
- [ ] Sign up → generate → answer with a table → submit → feedback with score ring, green and orange panels, rubric bars.
- [ ] Past Performance lists the attempt with correct Date, Category, Difficulty, AI Rating.
- [ ] Logged-out users can't open app pages; users can't see each other's attempts.
- [ ] Gemini key is not visible anywhere in the browser (check DevTools → Sources/Network).
- [ ] Daily limits enforced.
- [ ] `npm run build` passes; Lighthouse ≥ 90 on Resources.
- [ ] Site loads at `https://yourdomain.com` and `https://www.yourdomain.com` with a valid padlock.
- [ ] Datasheet numbers verified and "Last reviewed" date set.

---

## 14. Future Roadmap (post-MVP)
1. Timed "interview mode" with a 10-minute countdown and voice clarifying questions.
2. Weakness-based recommendations ("You score low on sanity checks — try these 3 questions").
3. Question bank curated by consultants + community upvotes.
4. Case-interview modules (profitability, market entry) beyond guesstimates.
5. Premium plan (more daily evaluations, detailed reports) — requires Vercel Pro if commercial.
