# Brook's blog

Source for **https://primebrook.github.io**: Brook's writing on computer science,
mathematics and software engineering. Astro 7 static site, KaTeX for maths,
deployed to GitHub Pages by GitHub Actions on every push to `main`.

**Brook writes the posts. Your job is usually to get them published:** turn a
draft into a post, make the maths, diagrams and images work, check it renders,
and ship it. Don't rewrite Brook's prose, change the argument, or add
paragraphs unless asked. Fixing a typo or a broken sentence is fine; say what
you changed.

## Start here

| Need | Look at |
| --- | --- |
| An example of every feature, working | `src/content/posts/test-post.mdx`, live (unlisted) at `/writing/test-post/` |
| What LaTeX works, and what to do instead | `MATH_REFERENCE.md` |
| Commands, briefly | `README.md` |

**Copy from the test post rather than inventing syntax.** It's kept permanently
for this reason: every construct in it has been checked in a browser. When a
new post needs something the test post doesn't show yet, add it to the test
post too once it works.

## Commands

```sh
npm run dev -- --background   # dev server at :4321, drafts included; `npx astro dev stop` to stop
npm run check                 # TypeScript and Astro diagnostics
npm run verify                # production build, then scan for problems (see below)
npm run verify:drafts         # the same, with draft: true posts built too
npm run inspect -- /writing/<slug>/   # real Chrome at 375px and 1280px: layout report + screenshots
```

- `inspect` serves whatever is in `dist/`, so run `verify` (or
  `verify:drafts` for a draft) first. It fails with a clear message if the page
  isn't there.
- Screenshots go to `$TMPDIR/blog-inspect/`, which is wiped at the start of
  every run. The report prints each path.
- `inspect` uses Chrome at the standard macOS path (override with `CHROME=`)
  and ports 4329 and 9329.
- Astro 7 allows only one dev server and one preview server at a time. If one
  won't start, `npx astro dev stop` / `npx astro preview stop` clears the old
  one.

## Publishing a post: the loop

1. **Write or convert** the post into `src/content/posts/<slug>.md` (or `.mdx`,
   see below). The filename is the URL: `hashing.md` → `/writing/hashing/`.
2. **`npm run verify`**, or **`npm run verify:drafts`** while the post is
   still `draft: true`: a plain build leaves drafts out, so nothing would be
   checked. Fails on KaTeX parse errors (KaTeX draws these as red text instead
   of failing the build), on Obsidian syntax left in the output (`[[links]]`,
   `![[embeds]]`, `[!callouts]`), and on invisible characters or
   `==highlights==` in the post source. It doesn't look inside code or maths
   for Obsidian syntax.
3. **`npm run inspect -- /writing/<slug>/`**, then **Read the screenshots it
   lists**. It fails if the page scrolls sideways at phone width, if there are
   KaTeX errors, or if the browser logs errors. It also reports Mermaid blocks
   rendered and any animation's live status text. Pass `--wait=15000` to let an
   animation finish. A passing report is not the same as looking: read at least
   the phone-width screenshots of anything with maths, tables or diagrams.
4. **Commit and push to `main`.** Then `gh run watch` on the latest
   `deploy.yml` run, and `curl -s https://primebrook.github.io/writing/<slug>/`
   to confirm it's live. Commit subjects are short and imperative
   ("Publish the universal hashing post").

**Pushing to `main` publishes.** Only publish (take `draft: true` off and push)
when Brook has said the post is ready in this conversation. The vault is the
evidence otherwise, and it usually says "not yet": a draft whose project note
is `status: parked`, or whose `next:` says to finish it, or that has open
`#blog` tasks in the vault's `Tasks.md`, is unfinished. The default for
"put my draft on the blog" is to add it as `draft: true`, check it with
`verify:drafts` and `inspect`, commit it, and ask. A committed draft is safe:
CI never builds drafts.

## Frontmatter

```yaml
---
title: "From Prime Numbers to Probabilities"   # required
description: One sentence for search results and link previews.   # optional
pubDate: 2026-10-01          # required; shown on the home list and post
draft: true                  # optional: page exists in dev only, not built
unlisted: true               # optional: built and reachable by URL, left off the home page, noindex
---
```

The schema is in `src/content.config.ts`. Reading time is computed from the
body at 230 words a minute (`src/lib/posts.ts`).

## `.md` or `.mdx`

- **`.md`** for anything that's prose, maths, code, tables and images. This is
  the default, and an Obsidian draft converts to it with the least change.
- **`.mdx`** only when the post needs a component: pseudocode, Mermaid, an
  animated diagram. The test post is `.mdx` for this reason.

MDX is stricter than Markdown. In `.mdx`, outside maths and code:
- `{` starts a JavaScript expression and `<` starts a tag. Escape them (`\{`,
  `&lt;`) or put them in backticks.
- HTML comments `<!-- -->` break the build. Use `{/* comment */}`.
- `import` lines go after the frontmatter, before the content.
- Component props that hold LaTeX use `String.raw` so backslashes survive:
  `` <Pseudocode code={String.raw`\begin{algorithm}…`} /> ``

Maths inside `$…$` is fine in MDX, braces included.

## Maths

remark-math and rehype-katex, rendered at build time: readers download CSS and
fonts but no maths JavaScript. The syntax matches Obsidian:

- `$…$` inline, `$$…$$` display.
- **One-line `$$…$$` is display maths**, as in Obsidian. Plain remark-math
  would make it inline; `src/lib/remark-obsidian-display-math.mjs` fixes that.
  Brook's drafts write display maths this way, so don't "fix" them into fenced
  blocks.
- `\(…\)` and `\[…\]` do **not** work. Convert them to `$` and `$$`.
- Site-wide macros are in `astro.config.mjs`: `\R \N \Z \E \Var \bigO \argmax
  \sem{…}`. There's no preamble, so a new shorthand used across posts goes
  there, not in a `\newcommand` in the post.

KaTeX covers amsmath, much of mathtools, amssymb, amscd, xcolor, cancel,
braket and stmaryrd. It does **not** do TikZ, `algorithmic`, bussproofs,
siunitx, `multline`, `\label`/`\eqref`, `\DeclareMathOperator`. The full
table, with the workaround for each, is in `MATH_REFERENCE.md`. When unsure
whether a command works, test it in isolation:

```sh
node -e "require('katex').renderToString(String.raw\`\cancelto{0}{x}\`, {throwOnError: true, displayMode: true})"
```

A long display equation scrolls sideways inside its own box. That's
deliberate. Inline maths can't wrap inside a single `$…$`, so a long inline
list should be several `$…$` separated by commas, or it runs off a phone
screen.

## Components (`src/components/`)

All three are used in the test post; copy the usage from there.

| Component | Does | Notes |
| --- | --- | --- |
| `Pseudocode` | Algorithms in LaTeX `algorithmic` syntax (`\PROCEDURE`, `\IF`, `\FOR`, `\STATE`, `\CALL`, `\REQUIRE`, `\COMMENT`) | pseudocode.js, rendered at build time, no client JS. `number` sets "Algorithm N". |
| `Mermaid` | Flowcharts, sequence diagrams, etc. from text | Rendered in the browser; the ~1 MB library loads only on pages that use it. Follows light/dark at load. |
| `HashingAnimation` | An animated SVG diagram with a Replay button | The template for new animations, below. |

### Making an animated or interactive diagram

This is how kingori.co (Brook's style reference) builds its diagrams, and how
`HashingAnimation.astro` works: **hand-written SVG plus a short script**, no
image or video file. For a new one, copy `HashingAnimation.astro` and keep its
structure:

- **Static parts in the markup, moving parts made by the script.** Astro scopes
  component styles, so elements created in JS need `:global(...)` selectors
  inside the component's root class (see `.hash-anim :global(.token rect)`).
- **Colours from the CSS variables** (`--text`, `--muted`, `--rule`, `--accent`,
  `--bg`) so dark mode works. Never hard-code a colour in a component.
- **Start on scroll** with an `IntersectionObserver`, and offer **Replay**.
- **`prefers-reduced-motion`**: jump to the end state instead of animating.
- **A `<title>` in the SVG** describing what it shows, and an `aria-live`
  status line narrating the steps. `npm run inspect` prints that status line,
  which is how to check an animation ran to the end without watching it.
- `viewBox` plus `width: 100%` so it scales down on phones. Check at 375px.

Prefer a static image or Mermaid when nothing needs to move. An animation is
worth it when the order of events is the point.

## Images

Put a post's images in `src/assets/posts/<slug>/` and reference them relatively
from the post. The folder is keyed by slug, so renaming a post means moving its
folder too.

```markdown
![Alt text that describes the image](../../assets/posts/<slug>/diagram.svg)
```

Astro processes them at build time (hashing, dimensions, lazy loading). Always
write real alt text. A static image doesn't follow dark mode, so a light
diagram shows as a light box on a dark page. That's acceptable, but if a
diagram should adapt, make it a component with the CSS variables.

`public/` is only for files served as-is (favicons).

## Converting a draft from Obsidian

Brook's drafts live in the Obsidian vault at `~/personal/second_brain/notes/`,
e.g. `Hashing Article.md`. The vault is a separate git repo with its own
`CLAUDE.md` and rules. **Read from it; don't edit it from here** unless Brook
asks. The blog project's tasks live in the vault's `Tasks.md` under `#blog`.

Checklist, in order:

1. **Frontmatter.** Vault notes carry project frontmatter (`tags`, `status`,
   `review`, `next`). Replace it with the blog's (above). For the title, look
   for a `**Working title:**` line under the frontmatter, then an H1; the
   note's filename is only a working name. Confirm the title and slug with
   Brook: the slug becomes a permanent URL.
2. **`[[wikilinks]]`** to other notes. Those notes are private, so a link can't
   be kept as-is. Ask whether to drop it, inline the content, or link
   somewhere public. Links can also be stale: the Hashing draft's
   `[[modular multiplication ring Z_6]]` points at a note since renamed
   `Modular Multiplication Diagrams (Z_6).md`.
3. **`![[embeds]]`.** Attachments sit loose in `notes/` (e.g.
   `![[Screenshot 2025-06-28 at 00.45.23.png]]`). Copy them into
   `src/assets/posts/<slug>/` with a sensible name, and use a Markdown image
   with alt text.
4. **Excalidraw drawings** (notes tagged `excalidraw`, whose content is a
   compressed drawing) can't be rendered from here. Ask Brook to export an SVG
   from Obsidian (Excalidraw's export menu), then treat it as an image.
5. **Screenshots of someone else's content** (a chat answer, a page from a
   book, another site) are notes to self, not figures. Don't publish them;
   ask what should stand in their place.
6. **Vault scaffolding** isn't part of the post: a `## Journal` section, HTML
   comments, sections of links kept for reference. Leave them out, and ask
   before dropping anything that reads like content.
7. **Links** whose text is the bare URL get descriptive text. Strip tracking
   parameters (`?si=`, `utm_…`).
8. **Callouts** (`> [!note]`) have no Obsidian styling here. Use a plain
   blockquote, or in `.mdx` a `<div class="callout">` (styled in
   `global.css`, as in the test post's banner). **Highlights** (`==text==`)
   become `**bold**` or `<mark>`.
9. **Maths** mostly carries over unchanged. Check it against the unsupported
   list. `\space` is fine. If something looks mathematically wrong, flag it
   to Brook rather than fixing it: the argument is Brook's.
10. **Invisible characters** (zero-width spaces, often just before a closing
    `$`) come along with Obsidian text. `verify` reports them by line and
    column. Delete them.

A post that's converted but not ready stays in `src/content/posts/` with
`draft: true`. There's no separate drafts folder. When it's later finished in
Obsidian, the vault copy is the source of truth: reconvert from it rather than
editing both.

## Layout and style

- Modelled on **kingori.co**: centred single column, date / title / read-time
  list on the home page, quiet footer. Posts are 720px of text (45rem, the
  same as kingori.co), the home list 36rem. Mulish, 17px body, 40px post titles.
- Everything visual is in `src/styles/global.css`, with colours as CSS
  variables and a `prefers-color-scheme: dark` block. Components use those
  variables. Code blocks use Shiki's `github-light` / `github-dark` pair,
  switched in the same dark-mode block.
- Pages: `src/pages/index.astro` (home list), `about.astro`,
  `writing/[...slug].astro` (posts). Layout: `src/layouts/Base.astro`. Site
  name, description and footer links: `src/site.ts`.

## How it's wired, and the traps

- **Astro 7 may be newer than you know.** Check https://docs.astro.build before
  assuming an API. Things that differ from Astro 4/5: the content config is
  `src/content.config.ts` with `glob()` from `astro/loaders` and `z` from
  `astro/zod`; entries use `post.id` and `render(post)` from `astro:content`.
- **Markdown processor.** Astro 7's default processor (Sätteri) takes no
  remark/rehype plugins. The maths needs them, so `astro.config.mjs` sets
  `markdown.processor: unified({...})` from `@astrojs/markdown-remark`, and MDX
  inherits it. Passing `markdown.remarkPlugins` directly is deprecated.
- **One KaTeX.** `package.json` has `"overrides": { "katex": "$katex" }` so
  rehype-katex, pseudocode.js and Mermaid all use the KaTeX version the site's
  CSS comes from. Without it, rehype-katex pulls in an older copy and the HTML
  and CSS versions drift. Keep it when upgrading.
- **Deploy.** `.github/workflows/deploy.yml` (`withastro/action`, then
  `actions/deploy-pages`). The Pages source is set to **GitHub Actions**, not a
  branch or folder, so the workflow is the only way anything gets published.
- **Headless Chrome.** A plain `chrome --headless --screenshot` lays a page
  out at 500px minimum and freezes timers under `--virtual-time-budget`, so
  phone widths and animations can't be checked that way. `scripts/inspect.mjs`
  drives Chrome over the DevTools protocol instead. Use it.
