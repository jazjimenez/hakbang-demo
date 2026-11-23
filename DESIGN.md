# Hakbang design system

**Hakbang** means "step". The site should feel like climbing a staircase toward a first real job: grounded, honest and warm, never corporate-glossy. Everything sits on a ledge: hard offset shadows with no blur, ink outlines, and buttons that physically step down when pressed. The same idea shows up as the numbered **trail** (01 → 04) that runs through the landing page and the app.

Audience: Filipino fresh grads on phones (FIL/EN Taglish copy), plus employer HR staff and career offices on desktop. Light theme only.

Source of truth in code: `tailwind.config.js` (tokens), `src/index.css` (base, focus, motion), `src/components/ui.tsx` (primitives). Pages use token names, never raw hex values. The only exceptions are the hover shades listed under Buttons and the company tile colours from seed data.

---

## Color

Three greens carry the brand. Everything else is warm paper neutrals.

| Token | Value | Role |
|---|---|---|
| `deep` | `#023B2A` | Dark surfaces: landing hero, footer, sign-up panel, Hired screen, demo hub. `theme-color`. |
| `green` | `#005D41` | Primary: primary buttons, links, selected states, focus ring on light surfaces. |
| `lime` | `#5DB250` | Accent: progress fill, "now" step, highlights on `deep`, the lime button. Text on `deep` only at ≥ 4.5:1 (4.78). Never as text on light surfaces. |
| `mint` | `#E8F3EA` | Quiet green tint: verified badge, icon tiles, ghost-button hover, AI tag. |
| `ink` | `#15201A` | Body text, outlines on cards and secondary buttons, brut shadows, demo banner. |
| `muted` | `#5E6B64` | Secondary text, captions, field labels. 4.86:1 on paper. Minimum for any text. |
| `line` | `#DCD5C3` | Hairline borders, input borders, empty progress tracks, disabled buttons. |
| `paper` | `#F3EFE5` | Page background (body). |
| `cream` | `#FBF8F1` | Cards, secondary buttons, chips: one step lighter than paper. |
| `white` | `#FFFFFF` | Inputs, modals, sheets, sidebar headers. |
| `mango` / `mango-tint` / `mango-ink` | `#E8912A` / `#FDF0DC` / `#94570C` | Warning and "Launch" feature tags. Text and icons use `mango-ink` (5.15:1 on tint). Raw `mango` is a fill only: it fails as text or icon on the tint (2.19:1). |
| `red` / `red-tint` | `#B0372F` / `#FBE9E7` | Errors, report flows, the danger button. |

Rules:
- One primary action per view, in `green` (light surfaces) or `onDark`/`lime` (on `deep`).
- Status is never colour alone: every pill has a word, every progress bar has a label.
- Checked contrast pairs: ink/paper 14.6, green/paper 6.9, white/green 8.0, white/deep 12.6, lime/deep 4.8, red/red-tint 5.2, mango-ink/mango-tint 5.2.
- On `deep`, secondary text is `white/80`, tertiary `white/60`. Don't go lower for text.
- No gradients on UI. The only "texture" is the `Swoosh` line art at 8–18 % opacity behind dark heroes.

## Typography

| Family | Use |
|---|---|
| **Bricolage Grotesque** 600–800 (`font-display`) | h1–h3 and display numbers. Tight tracking. |
| **Figtree** 400–700 (`font-sans`) | Everything else: body, UI, buttons. |
| **Instrument Serif** italic (`font-serif`) | Accent words only, written as `*word*` in copy and rendered by `<Accent>` (in lime on dark, green on light). One accent per headline at most. |
| **IBM Plex Mono** 500–600 (`font-mono`) | Eyebrows, step numbers, tags, marquee. Always uppercase with 0.06–0.14em tracking. |

Scale (Tailwind `fontSize`, px / line-height):

| Token | Size | Use |
|---|---|---|
| `hero` | 64 / 66, 800 | App hero. The landing h1 steps up to 86px at `xl`. |
| `display` | 34 / 38, 800 | Section headings |
| `h-l` | 26 / 31, 700 | Page titles in the app |
| `h-m` | 20 / 25, 700 | Card titles |
| `h-s` | 17 / 22, 600 | Small headings |
| `stat` | 32 / 36, 700 | Big numbers (tabular figures) |
| `title` | 16 / 22, 600 | List item titles |
| `button` | 16 / 20, 600 | Large buttons |
| `body` | 15 / 22 | Body copy |
| `body-s` / `label` / `caption` | 13 / 18, 13 / 16 (600), 12 / 16 (500) | Secondary text, labels, meta |

Rules:
- Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty` (set globally).
- Numbers that change or line up (money, %, counts, scores) use tabular figures: `text-stat` and `font-mono` get them automatically, and elsewhere use Tailwind's `tabular-nums`.
- Measure: body paragraphs stay ≤ 75 characters (`max-w-[500px]`–`max-w-[640px]`).
- Real typography: `…` not `...`, curly quotes `’ “ ”`, `₱2,500` with `Intl`-style grouping (`peso()` in `store.ts`).
- Copy is second person ("ka", "you"), active voice, numerals for counts. Buttons say what happens ("Mag-apply sa track", "Mark as hired"), not "Continue".

## Spacing and layout

- 4px base (Tailwind default scale). Common steps: 8, 12, 16, 20, 24, 32, 40.
- Phone gutter **20px** (`px-5`); desktop gutter 32–56px.
- Content widths: landing `Container` 1200–1280px; app desktop 1200px; employer/admin 1192px; reading pages 720px; phone flows 480px.
- Section rhythm on the landing page: 96–150px vertical on desktop, 64px on phones.
- App breakpoint: **1024px** (`lg`). Below it the seeker app is a phone layout with bottom tabs, and above it a desktop layout.
- Touch targets ≥ 40px on phones (minimum 32px for compact toggles; never under 24px).

## Shape and depth

| Token | Value | Use |
|---|---|---|
| `rounded-btn` | 14px | Buttons (sm: 10px) |
| `rounded-input` | 12px | Inputs, icon tiles |
| `rounded-card` | 20px | Cards |
| `rounded-panel` | 24px | Modals, big panels, demo controls |
| `rounded-sheet` | 28px | Bottom sheet top corners |
| `rounded-full` | — | Pills, chips, avatars, toggles |

Shadows are hard and offset, with no blur (the "ledge"):

| Token | Use |
|---|---|
| `shadow-step` (0 4px deep) | Primary button |
| `shadow-step-ink` (0 3px ink) | Secondary button |
| `shadow-step-lime` | Buttons on `deep` |
| `shadow-brut-sm` → `shadow-brut` (3px → 5px ink) | Cards at rest → hover lift |
| `shadow-brut-lime` | Cards on `deep` |
| `shadow-float` (soft) | Only for things that float above the page: modals, demo controls, toasts |

Outlines are `1.5px` ink on cards, chips and secondary buttons, and `1px line` on inputs and quiet dividers.

## Components

**Buttons** (`<Button>`; sizes `lg` 52px, `md` 44px, `sm` 36px):
- `primary`: green on light surfaces, hover `#006B4B`. Disabled is `line` with `muted` text and no shadow.
- `secondary`: cream with an ink outline and `step-ink` shadow, hover white.
- `onDark` (cream on deep) and `onDarkOutline` (white outline on deep).
- `lime`: the single loud CTA on dark sections, hover `#6CC35F`.
- `ghost`: green text, mint hover. For tertiary actions.
- `danger`: red tint. Destructive actions confirm first.
- Every button presses: `active:translate-y-[3px]` and loses its shadow. Links that navigate use `to=` (a real `<a>`).

**Focus**: a 2px outline with 2px offset, in `green` on light surfaces and white on `deep`/`ink`/`green` surfaces (automatic through `--hk-focus` in `index.css`). Never remove an outline without a replacement. Inputs show the same outline.

**Inputs** (`<Field>`): 50px tall, white, `line` border, green border when focused plus the focus outline. The label sits above the field in `body-s muted`. Use real `type`, `name` and `autoComplete`. Placeholders are examples ending in `…`.

**Cards** (`<Card>`): cream, 1.5px ink outline, `rounded-card`, `shadow-brut-sm`. Interactive cards lift on hover (translate −2px, `shadow-brut`) and transition only `transform` and `box-shadow`.

**Pills and tags**: `StatusPill` (24px, tones green / mint / mango / grey / red); `VerifiedBadge` (mint, shield icon); `LaunchTag` (mono, mango, sticker tilt); `AiTag`. `Chip` is a 36px filter: selected chips are ink-filled.

**Navigation**: the landing header sits on `deep` with mono uppercase links. The seeker app uses bottom tabs on phones and a top bar on desktop. Employer and admin use a left sidebar on `deep`. A **Skip to content** link is the first tab stop on every page.

**Overlays**: `Modal` (white, `rounded-panel`, focus-trapped, closes on Esc and backdrop click) and `BottomSheet` (phones). Both contain their scroll (`overscroll-behavior: contain`).

**Trail** (`Trail.tsx`): the numbered step path, vertical on phones and horizontal on desktop. It is the brand's signature, so use it for real progress, not decoration.

## Motion

- Fast and physical: 100ms button press, 150–200ms hovers, 180–260ms enter (`animate-fade`, `animate-pop`, `animate-sheet`).
- Landing only: scroll reveal (`hk-reveal`, `hk-stagger`), a hero rise, the trail drawing itself, the marquee.
- Landing pointer effects use [Motion Primitives](https://motion-primitives.com) (vendored in `src/components/motion-primitives`, wrapped on-brand in `Motion.tsx`): `MagneticCta` on lime CTAs, `TiltCard` on the step cards and receipt, `HoverHighlight` on the header nav, `EdgeTrail` (lime) on the match card and CTA band, `WordsIn` on the hero subline, `SpringNumber` in the impact calculator. Pointer effects switch on only for a real mouse. Spotlight and Text Shimmer are left out on purpose: blur glows and gradient text are on the Don'ts list.
- Animate `transform` and `opacity` only. Never `transition: all`.
- `prefers-reduced-motion: reduce` turns every animation off and shows the end state.

## Imagery and icons

- Icons: **lucide-react** only, 1.8 stroke, sized 14/16/18/22. Decorative icons get `aria-hidden`, and icon-only buttons get an `aria-label`. No emoji as icons (the `✦` on LaunchTag is a typographic mark).
- Icons in tiles (`IconTile`) sit on a tint of their tone and pass 3:1.
- Company logos are initials tiles until real logos arrive (TODO in code).
- Photos: real, unstaged photos of Filipino job seekers, credited on `#/legal/credits`. The sign-up hero photo is temporary.
- Images always have `alt` (or `alt=""` if decorative) plus `width`/`height`, and are `loading="lazy"` below the fold.

## Don'ts

- No purple/blue gradients, glassmorphism, gradient text or blurred drop shadows on cards.
- No three identical centered feature cards. Vary the layout: the trail, numbered steps, split rows.
- No new colours. If a state needs one, use mango (warning) or red (error).
- No text below `muted` contrast, and no lime text on light surfaces.

## Open decisions

- Body text is 15px. The usual guidance is 16px or more for reading on phones. Raising `body` to 16/24 is a one-token change but reflows every screen, so it's worth deciding with the team.
- Dark mode: not planned. The `deep` sections already cover the "dark" moments.
