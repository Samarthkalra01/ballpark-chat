# Ballpark — Step-by-Step Build & Launch Guide (for first-time builders)

This guide takes you from "designs in Google Stitch" to "live app on my own domain". No coding knowledge needed: Claude Code writes the code, you follow the clicks.

**Time needed:** ~1 day for setup + first deploy, then 1–2 evenings per build phase.
**Cost:** ₹0 to start (free tiers of GitHub, Vercel, Supabase, Gemini). You need a paid Claude plan to use Claude Code, plus the domain you already own.

---

## The big picture (read once)

```
 You ──► Claude Code ──writes code──► Your computer (project folder)
                                          │  push (GitHub Desktop)
                                          ▼
                                       GitHub (stores code)
                                          │  auto-deploy on every push
                                          ▼
                                        Vercel (runs the website) ──► yourdomain.com
                                          │
                       ┌──────────────────┴──────────────────┐
                       ▼                                     ▼
              Supabase (logins + database)        Gemini API (AI questions + feedback)
```

- **GitHub** = cloud storage for your code with history.
- **Vercel** = puts the website online; every time you push to GitHub, it updates the live site in ~1 minute.
- **Supabase** = handles sign-ups/logins and saves every attempt.
- **Gemini API key** = lets the app ask Google's AI to write questions and grade answers.
- **Environment variables (env vars)** = secret settings (like API keys) stored *outside* the code. You put them in a file called `.env.local` on your computer and in Vercel's settings online.

---

## Part 0 — If someone else is helping you build this

These accounts should all belong to **you (the owner)**. A helper should never need your passwords.

| Service | How a helper gets access safely |
|---|---|
| GitHub | Repo → **Settings → Collaborators → Add people** → enter helper's GitHub username |
| Vercel | Hobby (free) plan is single-person. Easiest: **you** click through Part 7 while the helper guides you on a screen-share |
| Supabase | Organization → **Team → Invite** (helper's email), or you run the steps on a screen-share |
| Gemini key | You create it and paste it into Vercel/`.env.local` yourself. Don't send keys over WhatsApp/email |
| Domain registrar | You log in and add the DNS records from Part 8; helper reads them out to you |

If a key ever gets shared in a chat or committed to GitHub, delete it and create a new one (Part 10 shows how).

---

## Part 1 — Create accounts (20 min)

Use the **same email** everywhere to keep things simple.

1. **GitHub** — https://github.com/signup
2. **Vercel** — https://vercel.com/signup → choose **Continue with GitHub** (links the two automatically) → pick the **Hobby** plan.
3. **Supabase** — https://supabase.com → **Start your project** → **Continue with GitHub**.
4. **Google AI Studio** (for the Gemini key) — https://aistudio.google.com → sign in with Google.
5. **Claude** — a paid plan (Pro or Max) is needed for Claude Code. https://claude.com/pricing
6. **Domain registrar** — make sure you can log in to wherever you bought the domain (GoDaddy, Hostinger, Namecheap, BigRock, Cloudflare, etc.).

---

## Part 2 — Install the tools (20 min)

Install these on your computer, in this order:

1. **Node.js (LTS version)** — https://nodejs.org → download the **LTS** button → install with defaults.
   Next.js needs Node 20.9 or newer; the LTS download covers that.
2. **Git** — https://git-scm.com/downloads → install with defaults (Windows: keep "Git from the command line and also from 3rd-party software" ticked).
3. **GitHub Desktop** — https://desktop.github.com → install → sign in with your GitHub account. This gives you a "Push" button so you never need git commands.
4. **Claude desktop app** — https://claude.ai/download → install → sign in → click the **Code** tab. The app includes Claude Code, so nothing else to install.
5. **VS Code** (optional, to peek at files) — https://code.visualstudio.com

**Check it worked:** open Terminal (Mac: Spotlight → "Terminal"; Windows: Start → "PowerShell") and paste:
```bash
node -v
git --version
```
You should see version numbers (e.g., `v22.x.x`). If you see "command not found", restart the computer and try again.

> **No-install alternative:** Claude Code also runs in the browser at https://claude.ai/code and works directly on a GitHub repo. You'd skip local testing and check each change on Vercel preview links instead. The desktop route below is easier to learn on because you can see the site on your own machine instantly.

---

## Part 3 — Export your designs from Google Stitch (10 min)

1. Open your Ballpark project at https://stitch.withgoogle.com.
2. **Select all 4 screens** (Resources hub, Configuration, Active Practice, Feedback & Past Performance).
3. Click **Export** → choose **.zip** (downloads HTML + images for each screen). If you see a "Project Brief" or "DESIGN.md" option, download that too.
4. Also take a full-page screenshot of each screen and name them `01-resources.png`, `02-configuration.png`, `03-practice.png`, `04-feedback-history.png`.
5. Optional: if your AI Studio prototype (ballpark.ai.studio) has a **Download / Export code** option, download that zip as well — it's useful reference, but we're rebuilding properly.

> **Advanced option:** Stitch's export menu also has an **MCP** option that connects Stitch live to Claude Code. Nice to have later; the zip is enough.

---

## Part 4 — Create the project folder & GitHub repository (15 min)

1. Create a folder on your computer called **`ballpark`** (e.g., in Documents).
2. Inside it, create this structure and drop files in:
   ```
   ballpark/
   ├─ PRD.md                      ← from this pack
   ├─ CLAUDE.md                   ← from this pack
   ├─ SETUP_AND_DEPLOY_GUIDE.md   ← this file (optional)
   └─ design/
      └─ stitch/                  ← unzip the Stitch export here + the 4 screenshots
   ```
3. Open **GitHub Desktop** → **File → Add Local Repository** → choose the `ballpark` folder → it says "not a git repository" → click **create a repository** → Name: `ballpark` → **Git ignore: Node** → **Create Repository**.
4. Click **Publish repository** (top bar) → keep **"Keep this code private"** ticked → **Publish**.
5. Check https://github.com/YOUR-USERNAME/ballpark — your files should be there.

---

## Part 5 — Set up Supabase (database + login) (20 min)

### 5.1 Create the project
1. https://supabase.com/dashboard → **New project**.
2. Name: `ballpark` · Database password: click **Generate** and save it in a password manager · Region: **South Asia (Mumbai)** if most users are in India, otherwise the region closest to them → **Create new project**. Wait ~2 minutes.

### 5.2 Create the tables
1. Left menu → **SQL Editor** → **New query**.
2. Open `PRD.md`, copy the whole SQL block in **Section 10.4**, paste it in, click **Run**. You should see "Success. No rows returned".
3. Left menu → **Table Editor** — you should see `profiles`, `attempts`, `usage_daily`.

### 5.3 Copy your keys
Left menu → **Project Settings** (gear) → **API** (or **API Keys** / **Data API**):
- **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
- **anon / publishable key** → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ⚠️ Do **not** copy the `service_role` / secret key. The app doesn't need it.

### 5.4 Auth settings
1. Left menu → **Authentication → Sign In / Providers** → make sure **Email** is enabled.
2. For an easy start, turn **OFF "Confirm email"** (Supabase's built-in email sender only allows a few emails per hour). Turn it back on later when you set up a proper email sender (Resend, etc.).
3. **Authentication → URL Configuration:**
   - Site URL: `http://localhost:3000` (you'll change this to your domain in Part 9)
   - Redirect URLs → **Add URL** for each:
     ```
     http://localhost:3000/**
     ```
     (You'll add the Vercel and domain URLs later.)

---

## Part 6 — Get the Gemini API key (5 min)

1. https://aistudio.google.com → **Get API key** (left menu) → **Create API key** → choose/create a Google Cloud project → copy the key (starts with `AIza…`).
2. Free tier is fine to start. Limits are per minute and per day; if many students use the app at once, enable billing on the Google Cloud project to raise limits (you'll still have free allowances).
3. The model is set by `GEMINI_MODEL`. We use `gemini-flash-latest`, which automatically points to Google's current Flash model, so the app won't break when older models are retired. You can check available models in AI Studio's model picker.

---

## Part 7 — Build with Claude Code, phase by phase

### 7.1 Open the project
1. Claude desktop app → **Code** tab → choose/open the **`ballpark`** folder.
2. First message (copy-paste):
   ```
   Read CLAUDE.md and PRD.md fully, and look at every file in design/stitch/.
   Then summarise in 10 bullets what you're going to build, list any questions
   or contradictions you find between the PRD and the designs, and wait for
   my go-ahead before writing any code.
   ```
3. Answer its questions. Then run the phases below, **one per session**.

### 7.2 Create your `.env.local` (secret settings file)
Before Phase 2, send this to Claude Code:
```
Create a .env.local file in the project root with these variables and empty
values, confirm .env.local is in .gitignore, then tell me how to open it so I
can paste my keys in myself:
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, GEMINI_API_KEY,
GEMINI_MODEL=gemini-flash-latest, DAILY_GENERATION_LIMIT=30,
DAILY_EVALUATION_LIMIT=20, NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
Open the file (in VS Code or any text editor) and paste your values after the `=` signs, no quotes, no spaces:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxx
GEMINI_MODEL=gemini-flash-latest
DAILY_GENERATION_LIMIT=30
DAILY_EVALUATION_LIMIT=20
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
Save the file. **Paste keys yourself — don't paste them into the Claude chat.**

### 7.3 Phase prompts (copy-paste one at a time)

**Phase 0 — Setup**
```
Do Phase 0 from PRD.md Section 12: scaffold Next.js (latest stable, App Router,
TypeScript, Tailwind, src/ dir, ESLint) in this folder without deleting PRD.md,
CLAUDE.md or design/. Install shadcn/ui and lucide-react, set up Inter and the
design tokens from Section 9 (use exact values from design/stitch/ where
available). Create .env.example and a README. Run lint and build, then tell me
how to see it running.
```
✅ Check: run `npm run dev` (Claude will tell you how), open http://localhost:3000.
💾 Then in **GitHub Desktop**: write a summary like "Phase 0 setup" → **Commit to main** → **Push origin**.

**Phase 1 — All screens with mock data**
```
Do Phase 1: build the sidebar layout and all 4 screens from PRD Section 7 using
mock data only, matching design/stitch/ as closely as possible on desktop and
mobile. No auth or AI yet. When done, list each route so I can compare it
side-by-side with the Stitch screenshots.
```
✅ Compare each page with your Stitch screenshots. Ask for fixes in plain English, e.g. *"On /solve, the selected card border should be thicker and the button should be full width on mobile."* Commit + push.

**Phase 2 — Login & database**
```
Do Phase 2: connect Supabase using @supabase/ssr (browser client, server client,
proxy/middleware session refresh), build login, signup (with full name), logout
and forgot-password, protect all app routes per PRD FR-5. The tables already
exist in Supabase (SQL from Section 10.4 has been run). My keys are in
.env.local. Tell me exactly how to test sign-up and where to see the new user
in the Supabase dashboard.
```
✅ Sign up with a test email → check **Supabase → Authentication → Users** and **Table Editor → profiles**. Commit + push.

**Phase 3 — Resources content**
```
Do Phase 3: write the 5 resource articles per PRD FR-1.6 outlines, build the
article page, and wire the "Practise this now" deep links. Mark every Datasheet
number as approx. and list them for me to verify.
```

**Phase 4 — Solve flow + AI (the core)**
```
Do Phase 4: build the question generation API, the seed question bank (40
questions), the Tiptap editor with Add Table and table controls, autosave,
timer, the evaluation API with the exact prompts and Zod schemas from PRD
Section 8, and the result page (score ring, green/orange panels, rubric bars,
model approach). Gemini calls must be server-only. Then walk me through a full
test: generate → answer with a table → submit → see feedback.
```

**Phase 5 — Past Performance**
```
Do Phase 5: build /history with the table (Date, Question, Category, Difficulty,
AI Rating), filters, sorting, pagination, summary cards, trend chart and empty
state per FR-4.9 to FR-4.14. Show the last 5 attempts under the result card.
```

**Phase 6 — Hardening**
```
Do Phase 6: daily limits via the increment_usage function, all edge cases in
PRD Section 11, HTML sanitization, accessibility pass, page titles/meta tags,
favicon, a 404 page and a privacy note in the footer. Then go through PRD
Section 13 and tell me which items pass and which need me to check manually.
```

After every phase: **test → commit → push**. Small, frequent pushes = easy to undo mistakes.

---

## Part 8 — Deploy to Vercel (15 min)

1. https://vercel.com/new → under **Import Git Repository**, find **ballpark** → **Import**.
   (If you don't see it: **Adjust GitHub App Permissions** → allow access to the `ballpark` repo.)
2. Framework Preset should auto-detect **Next.js**. Leave Build/Output settings as default.
3. Open **Environment Variables** and add each one (Name + Value), same as your `.env.local`, **except**:
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com` (your real domain)
4. Click **Deploy**. Wait 1–3 minutes → you get a URL like `https://ballpark-xyz.vercel.app`.
5. **Tell Supabase about the new URLs:** Supabase → **Authentication → URL Configuration → Redirect URLs** → add:
   ```
   https://ballpark-xyz.vercel.app/**
   https://*-YOUR-VERCEL-TEAM-SLUG.vercel.app/**
   ```
   (The second line lets preview deployments log in. Your team slug is in your Vercel URL, e.g. `vercel.com/YOUR-SLUG`.)
6. Open the `.vercel.app` URL, sign up, run one full practice. If it works, you're live (on a temporary address).

**Important:** if you change an env var in Vercel later, go to **Deployments → ⋯ on the latest → Redeploy** for the change to take effect.

From now on: **every push to `main` auto-deploys.** Pushes to other branches create preview links so you can test before going live.

---

## Part 9 — Connect your domain (15 min + waiting)

### 9.1 Add the domain in Vercel
1. Vercel → your **ballpark** project → **Settings → Domains** → **Add Domain**.
2. Type `yourdomain.com` → **Add**. When asked, choose the recommended option: add `www.yourdomain.com` too and **redirect** `yourdomain.com` → `www.yourdomain.com` (or the other way round — either is fine, just be consistent).
3. Vercel now shows "Invalid Configuration" with the **exact DNS records** to add. Keep this tab open.

### 9.2 Add DNS records at your registrar
Log in to your registrar → find **DNS / Manage DNS / DNS Zone** for the domain. Add:

| Type | Name / Host | Value / Points to | TTL |
|---|---|---|---|
| **A** | `@` | The IP shown on your Vercel domain card (commonly `76.76.21.21`) | Default / 1 hour |
| **CNAME** | `www` | The target shown on your Vercel domain card (often a project-specific value like `xxxxxxxx.vercel-dns-017.com`, or `cname.vercel-dns.com`) | Default |

**Always copy the values from your own Vercel screen** — Vercel checks for the exact values it displays.

**Before saving, delete conflicting records:**
- Any other **A** record for `@` (e.g., a "Parked" or "WebsiteBuilder" record on GoDaddy, or default hosting records on Hostinger).
- Any **AAAA** record for `@`.
- Any existing **CNAME** for `www` pointing elsewhere.
- Leave **MX** (email) and **TXT** records alone.

Registrar tips:
- **GoDaddy:** Domain → **DNS** → edit the existing `@` A record instead of adding a second one.
- **Hostinger:** Domains → Manage → **DNS / Nameservers** → delete default A/CNAME records first.
- **Namecheap:** Domain List → Manage → **Advanced DNS**; use `@` for root and `www` for the CNAME.
- **Cloudflare:** set the records to **DNS only** (grey cloud), not proxied.

> **Alternative:** in Vercel you can choose "Nameservers" instead, and change your domain's nameservers to Vercel's. Only do this if you don't have email or other services on the domain.

### 9.3 Wait and verify
- DNS usually updates in 5–60 minutes (occasionally up to 48 hours). The Vercel Domains page turns **green ✓ Valid Configuration**, and the **SSL certificate (padlock) is created automatically.**
- If it stays stuck after you're sure the records match: remove the domain from Vercel and add it again.
- Check propagation: https://dnschecker.org → enter your domain → type A.

### 9.4 Final settings for the domain
1. **Supabase → Authentication → URL Configuration:**
   - Site URL: `https://www.yourdomain.com`
   - Redirect URLs: add `https://yourdomain.com/**` and `https://www.yourdomain.com/**`
2. **Vercel → Settings → Environment Variables:** confirm `NEXT_PUBLIC_SITE_URL` = `https://www.yourdomain.com` → Redeploy.
3. Open `https://yourdomain.com` → it should redirect to `https://www.yourdomain.com` with a padlock. Do a full sign-up → practice → feedback test.

---

## Part 10 — Optional extras

### 10.1 "Continue with Google" sign-in (Phase 7)
Ask Claude Code:
```
Add "Continue with Google" via Supabase Auth to login and signup, with the
/auth/callback route. Then give me numbered steps for Google Cloud Console
(OAuth consent screen, OAuth client ID, authorised redirect URI) and Supabase
(Authentication → Providers → Google) using my Supabase project URL.
```
The redirect URI to paste in Google Cloud is `https://YOUR-PROJECT.supabase.co/auth/v1/callback`.

### 10.2 Rotate a leaked key
- **Gemini:** AI Studio → API keys → delete the old key → create a new one → update `.env.local` + Vercel → Redeploy.
- **Supabase anon key** is public by design; RLS protects data. If you ever leak the `service_role`/secret key, regenerate it in Supabase settings.

### 10.3 Analytics
Vercel project → **Analytics** tab → **Enable**, then ask Claude Code to add `@vercel/analytics` to the root layout.

---

## Part 11 — Troubleshooting

| Problem | Fix |
|---|---|
| `npm: command not found` | Node.js isn't installed or terminal was open before install. Restart computer. |
| Site works locally but not on Vercel | An env var is missing/misspelled in Vercel. Check names match exactly → Redeploy. |
| Vercel build fails | Vercel → Deployments → click the failed one → **Build Logs** → copy the red error → paste it to Claude Code: "Vercel build failed with this error: …" |
| Login works locally, fails on live site | Add the live URL to Supabase **Redirect URLs** (Part 8.5 / 9.4). |
| "Invalid API key" from Gemini | Key copied with a space or quotes; or created in a different project. Re-copy. |
| AI says quota/limit exceeded (429) | Free-tier limit hit. Wait, or enable billing on the Google Cloud project. Fallback questions still work. |
| Domain shows "Invalid Configuration" | Old A/AAAA record still present, or value doesn't match the Vercel card exactly. |
| Domain works without www but not with (or vice versa) | One of the two records is missing; both must exist. |
| Supabase app suddenly not loading data | Free projects pause after a period of inactivity — Supabase dashboard → **Restore project**. |
| Claude Code made a change you don't like | Tell it "undo the last change", or in GitHub Desktop → **History** → right-click the commit → **Revert**. |

---

## Part 12 — Launch checklist

- [ ] All 6 build phases done and pushed
- [ ] Every item in PRD Section 13 ticked
- [ ] Datasheet numbers verified, "Last reviewed" date set
- [ ] Tested on a phone (Chrome + Safari)
- [ ] `https://yourdomain.com` and `https://www.yourdomain.com` both load with a padlock
- [ ] Sign-up → generate → answer with table → feedback → appears in Past Performance
- [ ] Gemini key not visible in browser DevTools
- [ ] Shared with 5 test users and collected feedback

**Plan limits to know:** Vercel's free Hobby plan is meant for personal, non-commercial projects — if you start charging money, move to Vercel Pro. Supabase and Gemini free tiers are enough for early testing; watch their usage pages as users grow.
