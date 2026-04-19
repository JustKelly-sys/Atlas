# Claude Design prompt #3 — Sign-in welcome page

## How to use

**Step 1.** Open Claude Design at https://claude.ai/design and continue the same **Atlas** project (do not start a new one).

**Step 2.** Attach this single reference image from disk:

```
C:\Users\USER-PC\.gemini\antigravity\brain\1fa4ee5a-eb53-46f0-a797-1e9bc935d003\playroll-ops\docs\references\ref-awwards-aesthetic.png
```

This is the Luxitalia landing page shot — full-bleed sunset photograph, wordmark centred at the top, three-column info strip at the bottom.

**Step 3.** Do NOT attach the other seven reference images for this pass. This page is a standalone hero treatment, not a dashboard.

**Step 4.** In Claude Design's chat panel, copy **everything below the horizontal rule** (starting from the line "I am attaching one reference image.") and paste it in.

**Step 5.** Send / run.

**Step 6.** When Claude Design returns the updated project, paste the link or a screenshot back into the thread.

---

I am attaching one reference image: the Luxitalia landing page by Awwwards. Study it carefully. The moves I want you to steal:

- **Full-bleed photograph** as the entire page background
- **Centred wordmark** at the very top with minimal nav items either side
- **A small decorative dot or separator** beside the wordmark (Luxitalia uses a pin icon — we will use a tiny filled circle)
- **A three-column info strip across the bottom**, each column: tiny uppercase label in monospace, then a short value in serif, in the bottom ~8% of the viewport
- **Generous negative space in the middle** of the viewport — the photograph does most of the work
- **Warm sunset-to-dawn colour temperature** — the entire aesthetic is late-golden-hour, not cold morning

Do not copy Luxitalia literally. Do not use their wordmark, colour grade, or text. Synthesise.

---

## Scope

Build a single new page at `/sign-in`. It replaces any placeholder Supabase auth page from the earlier scaffold. No separate sign-up page exists. No password. No OAuth. No email. The user enters a first name and presses Enter; that name is stored in `localStorage` under the key `atlas.firstName`; the user is redirected to `/app/dashboard`. The dashboard's existing greeting ("Good morning, Tshepiso.") is rewired to read that localStorage key, falling back to "there" if empty.

Do not modify any other page in the project. The sidebar, the six dashboard beats, the five innovation pages, the operational pages, the Why Atlas tab, the Tweaks panel — all stay untouched. The only change outside `/sign-in` itself is the single line in the Dashboard greeting component that reads the first name from localStorage.

---

## The image

This is the single most important decision on the page. The image is a warm, dawn-lit, still-life photograph of a **vintage leather-bound world atlas, opened to a map spread**. Key attributes:

- **Subject in focus**: one left-hand page of the atlas, showing a portion of a political world map in hand-coloured cartography — sepia landmasses, pale cream oceans, the kind of map an Edwardian traveller would own
- **Paper colour**: warm cream, visibly close to `#F1EBDB` — this is deliberate. The page's physical paper matches the UI's canvas.
- **Lighting**: soft, low-angled morning light from the left, casting a long shadow from the book's spine across the right-hand page. Warm sunrise-orange wash, not cold noon-white.
- **Composition**: three-quarter overhead angle. The atlas fills roughly 65% of the viewport, weighted to the left. The right third of the image falls into warm shadow with an out-of-focus secondary subject — a small white ceramic espresso cup, half-visible at the image's right edge. The cup is unmissable as a morning signal without being the hero.
- **Texture**: visible paper grain on the map pages. A single, tasteful fold-crease near the spine. The leather edge visible at the top of the frame — dark walnut brown, hand-stitched.
- **Mood**: the quiet five minutes before work begins. Somewhere between a library reading room and a morning study. The kind of image a senior operator would have on a Moleskine notebook.

If your image generation cannot produce this exactly, prioritise in this order:
1. Warm cream atlas pages in sharp focus (non-negotiable)
2. Soft golden morning light (non-negotiable)
3. Overhead or three-quarter angle of an open book (non-negotiable)
4. Out-of-focus espresso cup in the corner (nice-to-have; omit if it distorts the composition)
5. Leather cover edge (nice-to-have)

Do NOT use: stock-photo laptops, modern office scenes, abstract globes, shipping containers, world maps pinned to walls, businesspeople, hands typing, or anything with visible technology.

If image generation is unavailable, use a rich cream-coloured solid background (`#F1EBDB`) with four corner rules (Optikka move) and place the interactive elements on that instead. Better a dignified empty ground than a cliché.

---

## Layout

The page occupies the full viewport. No sidebar. No header bar. No chrome. Three layers stack top-to-bottom:

### Top layer — masthead (top ~8% of viewport)

- Centred wordmark in Fraunces 24px, tracking `-0.01em`, colour `#FAF5E7` (surface cream, warm against the image): `ATLAS`
- Tiny filled circle in `#C24A1F` burnt sienna, 6px diameter, immediately right of the "S" with 8px gap — the Luxitalia-pin-equivalent mark
- Flanking the wordmark, in JetBrains Mono 10px uppercase 0.14em tracking, colour rgba(250,245,231,0.65):
  - Left of wordmark: `GLOBAL PAYROLL OPERATIONS`
  - Right of wordmark: `CAPE TOWN · APRIL 2026`

The masthead sits on top of the photograph with no background panel, no blur, no box. Pure text over image. If the image is too bright in the masthead area, add an ultra-subtle top-down gradient tint (black to transparent over the top 120px at 12% opacity max) — barely perceptible, just enough to hold the text.

### Middle layer — the welcome + input (centred, occupies ~60% of viewport)

Centred both axes. The entire block is ~480px wide.

- Tiny mono eyebrow in uppercase 11px 0.14em tracking, colour rgba(250,245,231,0.55): `BEFORE WE BEGIN`
- 24px gap
- Fraunces 56px, line-height 1.05, tracking `-0.02em`, colour `#FAF5E7`: `Good morning.`
- 16px gap
- Fraunces italic 20px, line-height 1.45, colour rgba(250,245,231,0.75), max-width 380px, centred:
  "Atlas is the global payroll operations suite I built in a weekend. Before the suite opens, tell it who to greet."
- 48px gap
- The input row

**The input row.** A single horizontal group, centred. Three elements left-to-right, with a hairline underline running beneath all three:

1. A small `→` arrow-right glyph in Fraunces, 20px, colour rgba(250,245,231,0.45), sitting as a visual prompt-marker.
2. An uncontrolled text input, transparent background, no border, no box — only the hairline underline beneath. Font: Fraunces 28px, colour `#FAF5E7`, tracking `-0.01em`, line-height 1.2. Placeholder: `your first name` in Fraunces italic, colour rgba(250,245,231,0.35). The input is wide enough for 20 characters visible.
3. An Enter button: a small mono pill, uppercase 10px 0.16em tracking, 2px radius, sitting right of the input. Border: 1px solid rgba(250,245,231,0.35). Background: transparent. Colour: rgba(250,245,231,0.8). Label: `↵  ENTER`. Hover state: border-colour `#C24A1F`, colour `#FAF5E7`. When input is empty, button is 40% opacity and non-interactive.

The hairline underline under the whole row: 1px, colour rgba(250,245,231,0.25), spanning the arrow through to the right edge of the Enter button. It extends 8px beyond each end.

Below the input row (24px gap), a tiny mono helper text: `NO SIGN-UP · NO PASSWORD · YOUR NAME STAYS IN YOUR BROWSER`, 10px uppercase 0.12em tracking, rgba(250,245,231,0.45).

### Bottom layer — info strip (bottom ~8% of viewport)

A single row of three equal columns, hairline-divided, sitting ~48px above the bottom edge. Each column: a tiny uppercase mono label, then a short serif value. Colours: label rgba(250,245,231,0.5), value `#FAF5E7`.

- Column 1 — label `BUILT BY` · value `TSHEPISO JAFTA` (Fraunces 15px)
- Column 2 — label `BUILT FOR` · value `The senior global payroll ops role at Playroll` (Fraunces italic 15px)
- Column 3 — label `BUILT IN` · value `A weekend · April 2026` (Fraunces 15px)

Below those three columns, 24px gap, a single centred line in mono 10px uppercase 0.14em tracking, rgba(250,245,231,0.4): `PRESS ⏎ TO ENTER · THE SUITE OPENS AT /APP`.

---

## Behaviour

On mount, the name input is auto-focused. Pressing Enter with a non-empty trimmed value:

1. Writes the value to `localStorage.setItem('atlas.firstName', trimmedValue)`
2. Navigates to `/app/dashboard` via `router.push('/app/dashboard')`

On the dashboard, the existing greeting "Good morning, Tshepiso." is rewired to read `localStorage.getItem('atlas.firstName') ?? 'there'` and render "Good morning, {name}." — if the key is empty, the greeting falls back to "Good morning, there." which is grammatically fine and deliberately quiet.

Pressing Enter with an empty or whitespace-only value does nothing. The button is disabled/faded. No error toast, no shake, no "please enter your name" text. The blocked state is the communication.

If the user navigates to `/app/dashboard` directly without a stored name, the dashboard still works — the greeting just falls back to "there". This is not real auth; it's a friendly gate.

---

## Voice on this page

Quiet. Considered. Never cute. Never "welcome to Atlas!!" energy. The page is a pause before the suite opens, not a splash screen.

- The one moment of slight warmth is the italic sentence: *"Atlas is the global payroll operations suite I built in a weekend. Before the suite opens, tell it who to greet."* — honest, small, admits the timeline without apologising for it.
- Everything else is specific and factual.

## Non-negotiables

- The Atlas app's design tokens still rule: Fraunces + Geist + JetBrains Mono only. Card radius 4px, button radius 2px. Hairlines, no shadows. One accent `#C24A1F`. No other fonts.
- The image is warm and dawn-lit. No cold or blue or night-time photography.
- No sign-up link. No "don't have an account?" nudge. No OAuth buttons. No email field. No password.
- No autocomplete dropdown. No name suggestions. No social prompt.
- The name input is the hero. Everything else gets out of its way.
- All text over the image is cream-tone white (`#FAF5E7` at varying opacities), never pure `#FFFFFF`.

## Output

Export as React + Tailwind for Next.js 16 App Router. The new route lives at `app/sign-in/page.tsx`. The Dashboard greeting component (existing) receives one small edit — a `useEffect` reading `localStorage.getItem('atlas.firstName')` into state on mount, with fallback `'there'`. Do not change any other dashboard behaviour.
