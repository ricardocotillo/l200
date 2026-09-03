# Plan: Local Build Pipeline (Tailwind CLI + esbuild)

## Summary

The site currently loads Tailwind from `https://cdn.tailwindcss.com` with a ~2.3 KB inline `tailwind.config` object, and ships its carousel logic as an inline `<script>` block at the end of `index.html`. This plan replaces the CDN with a compiled, purged, minified stylesheet and moves the inline JavaScript into a bundled/minified `js/index.js`, driven by an npm build with two dependencies: `tailwindcss@3` and `esbuild`.

The output paths are the two already-present-but-empty files, `css/index.css` and `js/index.js`, so no HTML restructuring or `dist/` directory is needed — deploying stays "copy the folder".

## User Story

As the owner of the L200 listing site,
I want Tailwind compiled locally and the JavaScript in a real source file,
So that the page doesn't depend on a third-party CDN at runtime, ships only the CSS it actually uses, and can be edited/reviewed as real source.

## Problem → Solution

**Current state:** Runtime CDN dependency; the Tailwind JIT engine is downloaded and evaluated on every page view; flash of unstyled content until the CDN script executes; config duplicated verbatim across two HTML files; JS un-minified and un-lintable inside markup; empty `css/index.css` and `js/index.js` placeholders unused.

**Desired state:** `npm run build` emits a purged, minified `css/index.css` (expect well under 20 KB) and a minified `js/index.js`. HTML `<head>` links a plain stylesheet. Config lives once in `tailwind.config.js`. No third-party JS at runtime except Google Fonts.

## Metadata

- **Complexity**: Small
- **Source PRD**: N/A
- **PRD Phase**: N/A (standalone)
- **Estimated Files**: 9 (5 created, 2 generated, 2 updated)

---

## UX Design

### Before

```
┌────────────────────────────────────────────────┐
│ Browser requests index.html                    │
│   ├─ GET cdn.tailwindcss.com (JIT engine)      │
│   ├─ eval inline tailwind.config (2.3 KB)      │
│   ├─ JIT scans DOM, injects <style>            │
│   │     ← unstyled flash until this completes  │
│   └─ inline <script> carousel IIFE runs        │
└────────────────────────────────────────────────┘
```

### After

```
┌────────────────────────────────────────────────┐
│ Browser requests index.html                    │
│   ├─ GET css/index.css (static, purged, min)   │
│   │     ← styled on first paint, no flash      │
│   └─ GET js/index.js (defer, minified)         │
└────────────────────────────────────────────────┘
```

### Interaction Changes

| Touchpoint | Before | After | Notes |
|---|---|---|---|
| First paint | Flash of unstyled content while CDN JIT boots | Styled immediately | Main user-visible win |
| Carousel (thumbs / prev / next / arrow keys) | Inline IIFE | Same IIFE, external + deferred | Behavior identical |
| Offline / CDN outage | Page renders unstyled | Page renders correctly | |
| Editing a color or spacing token | Edit the same JSON blob in two HTML files | Edit `tailwind.config.js` once, rebuild | |

---

## Mandatory Reading

| Priority | File | Lines | Why |
|---|---|---|---|
| P0 | `index.html` | 2 (the single minified `<head>` line) | Contains the `<style>` base block, the CDN `<script>`, and the `<script id="tailwind-config">` blob to be removed |
| P0 | `index.html` | 220–254 | The carousel IIFE to be moved to `src/index.js` verbatim |
| P0 | `code.html` | 3 (the single minified `<head>` line) | Same three tags to remove; also carries a broken Material Symbols `<link>` |
| P1 | This plan, "Patterns to Mirror" | — | Contains the extracted config values and the full IIFE; no need to re-parse the HTML by hand |
| P2 | `DESIGN.md` | all | Token intent (Action Amber `#FFB000`, Montserrat / Inter / JetBrains Mono) — reference only, do not change tokens |

## External Documentation

| Topic | Source | Key Takeaway |
|---|---|---|
| Tailwind CLI | tailwindcss.com/docs/installation — "Tailwind CLI" | `npx tailwindcss -i <in> -o <out> --minify` is the whole build; no PostCSS config file needed |
| Tailwind content detection | tailwindcss.com/docs/content-configuration | v3 scans `content` files as **plain text** for complete class-name substrings. Dynamically-toggled classes must appear as whole string literals in a scanned file |
| esbuild CLI | esbuild.github.io/getting-started/#build-scripts | `esbuild in.js --bundle --minify --outfile=out.js` |

---

## Research Notes

```
KEY_INSIGHT: The inline tailwind.config is a v3-shaped JS object (theme.extend with
             colors/borderRadius/spacing/fontFamily/fontSize, darkMode:"class").
APPLIES_TO:  Dependency choice (Task 1).
GOTCHA:      Tailwind v4 (4.3.3 current) is CSS-first (@theme) and only reads a legacy
             JS config through the `@config` shim, which does not honour `darkMode` and
             changes preflight defaults (border color, ring width). Translating 46 color
             tokens + 7 fontSize tuples buys nothing on a single static listing page.
             Pin tailwindcss@3.4.19 and copy the config verbatim — zero translation risk.
```

```
KEY_INSIGHT: The CDN's JIT engine watches the DOM at runtime, so classes added by
             JavaScript get generated on the fly. A build-time scan does not do this.
APPLIES_TO:  tailwind.config.js `content` glob (Task 3) and verification (Task 7).
GOTCHA:      The carousel toggles `border-2`, `border-tertiary`, `border`,
             `border-outline-variant/30`, `opacity-100`, `opacity-60`. These MUST be
             covered by `content`. They appear as complete string literals in the JS, so
             including `./src/**/*.js` in `content` is sufficient — but omitting it means
             the selected-thumbnail highlight silently disappears with no build error.
```

```
KEY_INSIGHT: code.html and index.html carry byte-identical config blobs (2312 bytes
             each, verified by diff), and neither page links to the other.
APPLIES_TO:  Task 3 (extract once) and Task 5 (edit both heads).
GOTCHA:      code.html has no <title>, no meta description, no inline <script>, and an
             extra malformed font link. It is a reference/scratch page, not linked from
             index.html. It is still included in the content glob (costs nothing) and its
             head is still cleaned so it renders after the CDN is removed.
```

Environment confirmed: node v24.18.0, npm 11.16.0, `tailwindcss@3` resolves to 3.4.19, `esbuild` to 0.28.2.

---

## Strategic Design

- **Approach**: Two single-purpose CLI tools wired to npm scripts. `src/index.css` (Tailwind directives + the base layer lifted out of the inline `<style>`) compiles to `css/index.css`; `src/index.js` (the carousel IIFE) bundles to `js/index.js`. Build outputs overwrite the two empty placeholder files that already exist, so the HTML's asset layout stays as-is.

- **Alternatives Considered**:
  - *Tailwind v4 + `@config` shim* — rejected: revalidating preflight/darkMode behavior against a working page for a static listing site is cost with no benefit. See Research Notes.
  - *Vite / Parcel* — rejected: a bundler for two hand-written HTML files with no imports, no framework, and one 34-line IIFE is scaffolding for a build that doesn't exist yet.
  - *PostCSS config + `postcss-cli`* — rejected: the `tailwindcss` CLI already runs PostCSS internally and minifies via cssnano. A separate `postcss.config.js` adds a file and a dependency for identical output.
  - *`dist/` output directory* — rejected: would require copying or rewriting the HTML on every build. Writing into the existing `css/` and `js/` directories keeps deploy as a folder copy.
  - *Self-hosting Google Fonts* — deferred; real but separate work (see NOT Building).

- **Scope**: npm init; two dev dependencies; `tailwind.config.js`; `src/index.css`; `src/index.js`; build/watch scripts; `<head>` edits in both HTML files; `.gitignore`.

- **NOT Building**:
  - Self-hosted fonts (Google Fonts `<link>` tags stay as-is).
  - HTML minification.
  - Content hashing / cache-busting filenames.
  - A dev server (relative asset paths work over `file://`; `python3 -m http.server` covers the rest).
  - ESLint / Prettier / TypeScript.
  - Any change to markup, copy, images, or design tokens.
  - Fixing `max-w-container-max` (see Notes — pre-existing no-op, and fixing it changes layout).
  - A test framework. This is two CLI invocations against static files; the validation commands below are the check.

---

## Patterns to Mirror

### EXISTING_BASE_STYLES

The inline `<style>` block, present identically in both HTML heads. Lift it verbatim into `src/index.css`. The `::-webkit-scrollbar` rule sits **outside** `@layer base` — keep it outside.

```html
<!-- SOURCE: index.html:2 and code.html:3 -->
<style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style>
```

### TAILWIND_THEME_TOKENS

Extracted from `<script id="tailwind-config">`. `colors` holds 46 flat hex tokens (Material-3 style names). Verified shape:

```js
// SOURCE: index.html:2 / code.html:3 (byte-identical, 2312 bytes each)
tailwind.config = {
  darkMode: "class",
  theme: { extend: {
    colors: { "surface-container-high": "#242b31", "on-tertiary-container": "#af7800",
              "tertiary": "#ffba43", "on-surface": "#dde3eb", /* …46 total… */ },
    borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
    spacing: { gutter: "24px", base: "8px", "section-padding-desktop": "120px",
               "section-padding-mobile": "60px", "container-max": "1280px" },
    fontFamily: { "headline-sm": ["Montserrat"], "display-lg": ["Montserrat"],
                  "body-lg": ["Inter"], "label-caps": ["JetBrains Mono"],
                  "display-lg-mobile": ["Montserrat"], "body-md": ["Inter"],
                  "headline-md": ["Montserrat"] },
    fontSize: { "headline-sm": [...], "display-lg": [...], "body-lg": [...],
                "label-caps": [...], "display-lg-mobile": [...], "body-md": [...],
                "headline-md": [...] }  // each: [size, {lineHeight, letterSpacing?, fontWeight}]
  }}
}
```

> Do **not** retype these by hand. Task 3 extracts them programmatically.

### CAROUSEL_IIFE

The inline script at the end of the `index.html` body. Moves to `src/index.js` unchanged.

```js
// SOURCE: index.html:220-254
(function () {
  const thumbs = [...document.querySelectorAll('#carousel-thumbs button')];
  const main = document.getElementById('main-carousel-image');
  const counter = document.getElementById('carousel-counter');
  const title = document.getElementById('carousel-title');
  let current = 0;

  function show(i) {
    current = (i + thumbs.length) % thumbs.length;
    const t = thumbs[current];
    main.src = t.dataset.src;
    main.alt = t.querySelector('img').alt;
    title.textContent = t.dataset.title;
    counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(thumbs.length).padStart(2, '0');
    thumbs.forEach((b, n) => {
      const on = n === current;
      b.classList.toggle('border-2', on);
      b.classList.toggle('border-tertiary', on);
      b.classList.toggle('border', !on);
      b.classList.toggle('border-outline-variant/30', !on);
      b.classList.toggle('opacity-100', on);
      b.classList.toggle('opacity-60', !on);
    });
  }

  thumbs.forEach((b, n) => b.addEventListener('click', () => show(n)));
  document.getElementById('carousel-prev').addEventListener('click', () => show(current - 1));
  document.getElementById('carousel-next').addEventListener('click', () => show(current + 1));
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
```

### ASSET_REFERENCE_STYLE

Existing markup uses relative, root-less paths (`img/web/IMG_4388.webp`), which work over `file://` and under any deploy subpath. New `<link>` / `<script>` tags must match — `css/index.css`, not `/css/index.css`.

---

## Files to Change

| File | Action | Justification |
|---|---|---|
| `package.json` | CREATE | Dependencies + build/watch scripts |
| `tailwind.config.js` | CREATE | Config extracted from the two HTML blobs, single source of truth |
| `src/index.css` | CREATE | Tailwind directives + base layer lifted from inline `<style>` |
| `src/index.js` | CREATE | Carousel IIFE lifted from inline `<script>` |
| `.gitignore` | CREATE | Ignore `node_modules/` |
| `css/index.css` | UPDATE (generated) | Build output; currently an empty placeholder |
| `js/index.js` | UPDATE (generated) | Build output; currently an empty placeholder |
| `index.html` | UPDATE | Drop CDN script, config script, inline `<style>`, inline `<script>`; add stylesheet `<link>` and deferred `<script src>` |
| `code.html` | UPDATE | Drop CDN script, config script, inline `<style>`; add stylesheet `<link>`; drop the malformed font `<link>` |

---

## Step-by-Step Tasks

### Task 1: Initialize npm and install dependencies

- **ACTION**: Create `package.json` and install the two dev dependencies.
- **IMPLEMENT**:
  ```bash
  cd /home/ricardo/dev/l200
  npm init -y
  npm pkg set name="l200-listing" private=true
  npm pkg delete main version description keywords author license
  npm install -D tailwindcss@3.4.19 esbuild@^0.28.2
  ```
- **MIRROR**: N/A (no existing Node config in this repo)
- **IMPORTS**: N/A
- **GOTCHA**: Pin `tailwindcss@3.4.19` explicitly. A bare `npm i -D tailwindcss` resolves to 4.x, whose CLI moved to the separate `@tailwindcss/cli` package and whose config model is incompatible with the extracted object.
- **VALIDATE**: `npx tailwindcss --help | head -3` prints v3 CLI usage; `npx esbuild --version` prints `0.28.x`.

### Task 2: Create the source stylesheet

- **ACTION**: Create `src/index.css`.
- **IMPLEMENT**:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    html, body { margin: 0; padding: 0; }
    body { overscroll-behavior: none; }
    main > :first-child { margin-top: 0 !important; }
    main > :last-child { margin-bottom: 0 !important; }
  }

  ::-webkit-scrollbar { display: none; }
  ```
- **MIRROR**: `EXISTING_BASE_STYLES`
- **IMPORTS**: N/A
- **GOTCHA**: `::-webkit-scrollbar` must stay **outside** `@layer base` — that is how the original inline block is written, and moving it inside the layer lowers its precedence.
- **VALIDATE**: File exists and its four base rules match the inline `<style>` block in effect.

### Task 3: Extract the inline Tailwind config into `tailwind.config.js`

- **ACTION**: Programmatically lift the config object out of `index.html` and write it as a CommonJS module. Do not retype the 46 color tokens.
- **IMPLEMENT**:
  ```bash
  node -e '
  const fs = require("fs");
  const html = fs.readFileSync("index.html", "utf8");
  const m = html.match(/<script id="tailwind-config">tailwind\.config=([\s\S]*?)<\/script>/);
  if (!m) throw new Error("config blob not found");
  const cfg = eval("(" + m[1] + ")");
  const out = "/** @type {import(\"tailwindcss\").Config} */\nmodule.exports = "
    + JSON.stringify({
        content: ["./*.html", "./src/**/*.js"],
        darkMode: cfg.darkMode,
        theme: cfg.theme
      }, null, 2)
    + ";\n";
  fs.writeFileSync("tailwind.config.js", out);
  '
  ```
- **MIRROR**: `TAILWIND_THEME_TOKENS`
- **IMPORTS**: N/A (config is CommonJS; do **not** add `"type": "module"` to `package.json`)
- **GOTCHA**: `content` **must** include `./src/**/*.js`. Tailwind v3 scans content files as plain text; the carousel's `classList.toggle('border-tertiary', …)` string literals are only found if the JS source is scanned. Miss this and the selected-thumbnail amber border and opacity states vanish with no error. `./*.html` (not `./**/*.html`) is deliberate — it covers `index.html` and `code.html` without walking `node_modules`.
- **VALIDATE**:
  ```bash
  node -e 'const c=require("./tailwind.config.js");
    console.log(Object.keys(c.theme.extend.colors).length===46 ? "colors OK" : "COLORS MISSING");
    console.log(c.darkMode==="class" ? "darkMode OK" : "darkMode BAD");
    console.log(c.content.join(","));'
  ```
  EXPECT: `colors OK`, `darkMode OK`, `./*.html,./src/**/*.js`

### Task 4: Lift the carousel IIFE into `src/index.js`

- **ACTION**: Create `src/index.js` containing the inline script's body, unchanged.
- **IMPLEMENT**: Copy the `CAROUSEL_IIFE` block from "Patterns to Mirror" above verbatim.
- **MIRROR**: `CAROUSEL_IIFE`
- **IMPORTS**: None — the IIFE is self-contained and uses only DOM APIs.
- **GOTCHA**: Do not "modernize" it (no `export`, no `DOMContentLoaded` wrapper, no optional-chaining cleanup). The script currently runs at end-of-body, after the elements it queries exist; the `defer` attribute added in Task 5 preserves that ordering. Rewriting turns a mechanical move into a behavior change with nothing verifying it.
- **VALIDATE**: `node --check src/index.js` exits 0.

### Task 5: Rewire both HTML heads

- **ACTION**: Remove the three CDN-era tags from both files, add the stylesheet link, and externalize the script in `index.html`.
- **IMPLEMENT** — in `index.html` (all on the single minified line 2):
  1. Delete `<style>@layer base{…}::-webkit-scrollbar{display:none;}</style>`
  2. Delete `<script src="https://cdn.tailwindcss.com"></script>`
  3. Delete `<script id="tailwind-config">tailwind.config={…}</script>`
  4. Insert in their place: `<link href="css/index.css" rel="stylesheet"/>`
  5. Replace the whole `<script>…</script>` block at lines 220–254 with:
     `<script defer src="js/index.js"></script>`

  In `code.html` (single minified line 3): steps 1–4 only (it has no inline `<script>`), **plus** delete the malformed
  `<link href="https://fonts.googleapis.com/googleapis/icon?family=Material+Symbols+Outlined" rel="stylesheet"/>`
  — that URL 404s, and the correct `css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1` link is already present on the same line.
- **MIRROR**: `ASSET_REFERENCE_STYLE` — relative paths, no leading slash.
- **IMPORTS**: N/A
- **GOTCHA**: Both heads are single minified lines thousands of characters long. Use `Edit` with the exact tag text as `old_string` (each of the three tags is unique within its file), or a `node -e` string replace. Do **not** attempt a line-based `sed` substitution across the whole line — one greedy match wipes the head. Order matters: place `<link href="css/index.css">` **before** the Google Fonts links so preflight doesn't override font declarations.
- **VALIDATE**:
  ```bash
  grep -c 'cdn.tailwindcss.com\|tailwind-config' index.html code.html   # expect 0 for both
  grep -o 'href="css/index.css"' index.html code.html                    # expect one hit each
  grep -o 'src="js/index.js"' index.html                                 # expect one hit
  grep -c '<script' code.html                                            # expect 0
  grep -c 'googleapis/icon' code.html                                    # expect 0
  ```

### Task 6: Add build scripts and `.gitignore`

- **ACTION**: Write the npm scripts and ignore `node_modules/`.
- **IMPLEMENT** — `package.json` `"scripts"`:
  ```json
  {
    "build": "npm run build:css && npm run build:js",
    "build:css": "tailwindcss -i src/index.css -o css/index.css --minify",
    "build:js": "esbuild src/index.js --bundle --minify --outfile=js/index.js",
    "watch:css": "tailwindcss -i src/index.css -o css/index.css --watch",
    "watch:js": "esbuild src/index.js --bundle --outfile=js/index.js --watch",
    "dev": "npm run watch:css & npm run watch:js"
  }
  ```
  `.gitignore`:
  ```
  node_modules/
  ```
- **MIRROR**: N/A
- **IMPORTS**: N/A
- **GOTCHA**: `css/index.css` and `js/index.js` are build outputs but are intentionally **not** gitignored — they are committed so that deploying is a plain folder copy with no build step on the host. Also: `dev` uses a shell `&` to run both watchers; Ctrl-C will not reap both children cleanly (`ponytail:` shell `&` job control — swap in `concurrently` only if stray processes become a real annoyance).
- **VALIDATE**: `npm run build` exits 0 and both output files are non-empty.

### Task 7: Verify parity against the CDN rendering

- **ACTION**: Confirm the built page is visually and behaviorally identical to the pre-change page.
- **IMPLEMENT**: Open `index.html` in a browser (`file://` works — all asset paths are relative), walk the checklist, then repeat for `code.html`.
- **MIRROR**: N/A
- **IMPORTS**: N/A
- **GOTCHA**: The only likely regression is a class the CDN's runtime JIT generated but the build-time scan missed. Focus verification on the carousel's selected-thumbnail state, since those classes come from JS rather than markup. Take a before-screenshot **prior to Task 5** so the comparison is possible.
- **VALIDATE**: See Manual Validation checklist below.

---

## Testing Strategy

No test framework (see NOT Building). The build-output assertions below are the verification, run in order.

### Build-output assertions

| Check | Command | Expected |
|---|---|---|
| CSS built and purged | `wc -c css/index.css` | non-zero, roughly 8–20 KB — an un-purged Tailwind build is orders of magnitude larger, so a huge file means `content` is wrong |
| JS built | `wc -c js/index.js` | non-zero, ~1 KB minified |
| Custom colors survived | `grep -c '#ffba43' css/index.css` | ≥ 1 (the `tertiary` amber) |
| Custom spacing survived | `grep -c '120px' css/index.css` | ≥ 1 (`section-padding-desktop`) |
| JS-only classes survived | `grep -c 'border-tertiary' css/index.css` | ≥ 1 — **the key purge assertion**; 0 means Task 3's `content` glob missed `./src/**/*.js` |
| Opacity-modifier color survived | `grep -c 'opacity-60' css/index.css` | ≥ 1 |
| No CDN reference remains | `grep -c 'cdn.tailwindcss' index.html code.html` | 0 for both |

### Edge Cases Checklist

- [ ] Carousel wraps: "next" from the last image lands on the first; "prev" from the first lands on the last
- [ ] Arrow-key navigation works with no thumbnail focused
- [ ] Selected thumbnail shows the 2px amber border at full opacity; unselected show the 1px muted border at 60% opacity — checked **after navigating**, not just on load
- [ ] Counter reads `01 / 08` … `08 / 08` (zero-padded)
- [ ] Page renders correctly with network access to `cdn.tailwindcss.com` blocked
- [ ] `code.html` renders styled and logs no console 404 for the font link
- [ ] Mobile viewport (< 640px): `section-padding-mobile` and `display-lg-mobile` classes apply
- [ ] WhatsApp floating button keeps its `bg-[#25D366]` arbitrary color

---

## Validation Commands

### Static Analysis

```bash
node --check src/index.js
node -e 'require("./tailwind.config.js")'
```
EXPECT: Both exit 0, no output.

### Build

```bash
npm run build
```
EXPECT: Exit 0. Tailwind prints a "Done in NNNms" line; esbuild prints the output size.

### Output Assertions

```bash
ls -la css/index.css js/index.js
grep -c 'border-tertiary\|#ffba43\|120px\|opacity-60' css/index.css
grep -c 'cdn.tailwindcss.com' index.html code.html
```
EXPECT: Both outputs non-empty; the first grep count is ≥ 4; the CDN grep returns 0 for both files.

### Clean-rebuild Check

```bash
rm -f css/index.css js/index.js && npm run build && test -s css/index.css && test -s js/index.js && echo REBUILD_OK
```
EXPECT: `REBUILD_OK`

### Browser Validation

```bash
python3 -m http.server 8000    # or open index.html directly over file://
```
EXPECT: Page renders identically to the pre-change version; DevTools Network shows no request to `cdn.tailwindcss.com`; Console is clean.

### Manual Validation

- [ ] `index.html` looks identical to the pre-change page (compare against the before-screenshot taken in Task 7)
- [ ] Every edge case in the checklist above passes
- [ ] DevTools Network tab shows exactly two local asset requests (`css/index.css`, `js/index.js`) plus images and Google Fonts — nothing else third-party
- [ ] `code.html` renders styled with no console errors

---

## Acceptance Criteria

- [ ] All tasks completed
- [ ] All validation commands pass
- [ ] `npm run build` succeeds from a clean checkout after `npm install`
- [ ] No `cdn.tailwindcss.com` reference remains in any file
- [ ] No inline `<style>` or inline `<script>` remains in either HTML file
- [ ] `tailwind.config.js` is the single source of the 46 color tokens, and both HTML files render from it
- [ ] `css/index.css` is under ~20 KB (purge is working)
- [ ] Carousel behavior is unchanged, including the JS-toggled thumbnail states
- [ ] Page renders correctly with the Tailwind CDN blocked

## Completion Checklist

- [ ] Base styles lifted verbatim, with `::-webkit-scrollbar` outside `@layer base`
- [ ] Carousel IIFE moved verbatim — no refactoring
- [ ] Asset paths relative, matching existing markup style
- [ ] Config extracted programmatically, not retyped
- [ ] `node_modules/` ignored; built outputs deliberately committed
- [ ] No design tokens, copy, markup, or images changed
- [ ] No unnecessary scope added (no dev server, no linters, no hashing, no font self-hosting)
- [ ] Self-contained — no codebase searching needed during implementation

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Purge strips a class the CDN's runtime JIT used to generate | Medium | High (silent visual break) | `content` includes `./src/**/*.js`; grep assertions on `border-tertiary` / `opacity-60`; manual carousel check in Task 7 |
| Botched edit to the thousands-of-characters minified `<head>` line | Medium | High | Use exact-tag `Edit` matches or a `node -e` replace, never a greedy line-wide `sed`. Snapshot both files before Task 5 |
| `npm i -D tailwindcss` silently resolves to v4 | Medium | High (CLI missing, config ignored) | Version pinned explicitly in Task 1; validated by `npx tailwindcss --help` |
| Tailwind v3.4 enters maintenance-only | Low (already the case) | Low | Static site, no upstream API surface. A v4 migration is separate, optional work |
| Google Fonts remains a third-party runtime dependency | Certain | Low | Out of scope by decision — a CDN font stylesheet degrades to fallback fonts, unlike the CDN stylesheet which degrades to no styling at all |

## Notes

Two **pre-existing** issues surfaced while reading the config. Both behave identically before and after this change, so neither is a regression and neither is in scope — but both are worth knowing:

1. **`max-w-container-max` is a silent no-op.** `container-max: "1280px"` is defined under `theme.extend.spacing`, but Tailwind v3's `maxWidth` scale does not inherit from `spacing`. The class currently generates nothing, so the page container is unconstrained on wide screens. Fixing it means adding `maxWidth: { "container-max": "1280px" }` to `theme.extend` — which would visibly constrain the layout. That is a design decision, not a build-pipeline fix. Raise it separately.

2. **The `fontSize` scale is effectively unused.** `fontFamily` and `fontSize` define the same seven keys (`body-md`, `headline-sm`, …). In Tailwind, `font-*` resolves to `fontFamily` only and `text-*` to `fontSize`. The markup uses `font-body-md` (family) together with arbitrary sizes like `text-[16px]`, so the carefully specified size / lineHeight / letterSpacing / fontWeight tuples never apply. Switching to `text-body-md` would change rendering. Also out of scope.

Other observations:

- `darkMode: "class"` is retained verbatim but is dead configuration — the markup contains zero `dark:` variants, and the palette is dark by default.
- `code.html` is an unlinked reference/scratch page (no `<title>`, no meta description, no JS). It is kept building because including it costs one glob entry. If it is genuinely dead, deleting it is cheaper than maintaining it — the owner's call.
- **Assumption on "install a parser":** read as the CSS-processing step Tailwind needs (PostCSS, which the Tailwind CLI bundles internally) plus esbuild for the JS side. No separate `postcss-cli` or HTML parser is installed. If a different tool was meant, Task 1 and Task 6 are the only tasks affected.
