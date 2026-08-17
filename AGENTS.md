# AGENTS.md

JSON Resume theme (Handlebars + CSS). CommonJS. French localization of `jsonresume-theme-jdambron` (`upstream` remote).

## Commands

- Install: `bun install`. Committed lockfile is `bun.lock`. Ignore `packageManager: pnpm@…` in `package.json` — it is stale.
- Test: `bun run test` (Jest + coverage). One file: `bunx jest test/SimpleTests.test.js`.
- After intentional HTML/CSS output changes: `bun run updateTestSnapshots`.
- No lint, typecheck, or CI.

## Theme contract

- `index.js` must export `render(resume)` and `pdfRenderOptions`. Resume CLI / HackMyResume load this package via `main`.
- `resume.hbs` is the page shell. `theme/partials/*.hbs` auto-register by basename on every `render()`.
- New helpers in `theme/hbs-helpers/` must be `require`d and `registerHelper`d in `index.js`.
- `style.css` is inlined into the HTML. Inter is base64-embedded for PDF; do not switch to external font URLs.

## Tests

- Fixture: `@jsonresume/schema/sample.resume.json`.
- Snapshot is the full rendered HTML, including inlined CSS and fonts. Any template or `style.css` change updates `test/__snapshots__/SimpleTests.test.js.snap`.
- `beforeEach` writes `test/TestOutput/` (gitignored except `.gitignore`).
- Dates use `new Date(...)` + `Intl.DateTimeFormat('fr-FR')`. Snapshots can differ by timezone.

## Schema and output

- Prefer JSON Resume `url`; keep legacy `website` as fallback.
- Non-standard fields in use: `basics.birth`, `skills.levelDisplay`, `languages.fluencyDisplay`.
- `paragraphSplit` is markdown-it (`html: false`, `linkify: true`). Keep raw HTML disabled.
- Profile icons: `fa-brands fa-{{spaceToDash network}}` — `network` must match a Font Awesome brand slug.
- `resume.json` / `resume.html` / `resume.pdf` are local preview artifacts and are gitignored.

## French overlay

- Keep package identity (`jsonresume-theme-jdambron-fr`), `html lang="fr"`, and `fr-FR` date formatting.
- Keep French UI strings when porting upstream. Do not reintroduce English section titles or CSS `content` labels.
