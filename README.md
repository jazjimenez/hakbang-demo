# Hakbang — clickable demo

Frontend-only prototype of **Hakbang**, a train-to-hire platform (CCINOV8, Team Unlad). Job seekers get matched to free, company-designed training tracks from verified employers; trainees who pass get hired; employers pay a success fee only per hire.

> **Demo prototype. All people, companies, and data are fictional.** There is no backend, no real sign-in, no AI calls, no payments and no network requests to third parties (apart from Google Fonts). Everything lives in your browser's `localStorage` under `hakbang-demo-v1`.

## What's inside

| Area | Routes |
|---|---|
| Landing page | `/#/` |
| Demo hub (pick role, language, Pilot/Launch, reset, presenter script) | `/#/demo` |
| Job seeker app (mobile < 1024px with bottom tabs, desktop layouts ≥ 1024px) | `/#/signup`, `/#/consent`, `/#/onboarding/*`, `/#/matches`, `/#/tracks/:id`, `/#/tracks/:id/apply`, `/#/my-track`, `/#/hired`, `/#/profile`, `/#/report` |
| Job seeker Launch features | `/#/alerts`, `/#/reminders`, `/#/tracks/:id/skill-gap`, `/#/skill-plan`, `/#/endorsements`, `/#/resume-review`, `/#/resume-review/fix/:n` |
| Employer dashboard (BlueHarbor CX, Carla) | `/#/employer/verify`, `overview`, `tracks/new`, `candidates`, `trainees`, `trainees/:id/hire`, `trainees/:id/endorse`, `billing` |
| Admin | `/#/admin/verification`, `reports`, `employers`, `tracks` |

The **Demo** button (bottom-left on desktop, in the top banner on phones) switches role, FIL/EN, Pilot-only vs Pilot+Launch, fast-forwards Paolo's progress, and resets the data.

### The 5-minute story

1. Paolo signs up → consent → uploads a resume (fake AI read) → saves the AI-filled profile.
2. Paolo applies to the Back Office Associate Track → it shows in Carla's **Candidates** and in his **My Track** as waiting.
3. Carla clicks **Accept** → Paolo's My Track shows "In track".
4. Demo controls → **Paolo passes all modules** (or Carla posts results from **Trainees**).
5. Carla → **Mark as hired** → Paolo sees the Hired screen → confirms the contract.
6. **Hires & billing** moves Paolo from "Waiting for Paolo to confirm" to "Confirmed, ₱2,500" (dual confirmation).
7. Admin → **Approve and verify** BlueHarbor → Carla's "Post a track" unlocks.
8. (Launch) Carla adds an endorsement → it appears on Paolo's Endorsements and Profile.

## Run locally

```bash
npm i && npm run dev
```

Then open http://localhost:5173. `npm run build` type-checks and builds to `dist/`.

## Deploy to GitHub Pages

1. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds with `VITE_BASE=/<repo-name>/` and deploys `dist/`.
2. In the repo: **Settings → Pages → Source: GitHub Actions**.

Routing uses `HashRouter`, so every route survives a refresh on the Pages sub-path.

The workflow publishes two builds to the same Pages site: `main` at `/<repo>/` and the `design/bold` branch (the experimental "steps" redesign) at `/<repo>/bold/`. A push to either branch rebuilds both.

## Project notes

- **Stack:** Vite + React 18 + TypeScript, React Router (hash), Tailwind CSS (tokens in `tailwind.config.js`), Zustand (persisted), lucide-react.
- **Design source:** Figma file `lR8turJbAshPb81v7VcxVq` (Hakbang). Copy for FIL/EN comes from the Figma "Language" variable collection and lives in `src/i18n/strings.ts` as `[Filipino, English]` pairs. Employer and admin screens are English only. Resume text stays English in both modes.
- **Seed data:** `src/data/seed.ts`; demo clock is fixed in late April 2027.
- **State + cross-role flows:** `src/store.ts`.
- **Signature trail:** `src/components/Trail.tsx` (vertical on mobile, horizontal on desktop/landing).
- **Open items (TODO in code):** hero photo placeholder, partner logos are initials tiles, FAQ answers 2–4 need final copy, sign-in provider buttons are neutral placeholders, AI Resume Review is tagged Launch until it's in the business plan.
