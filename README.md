# Brook's Blog

Source for [primebrook.github.io](https://primebrook.github.io). Astro, with
KaTeX for maths, deployed to GitHub Pages by `.github/workflows/deploy.yml` on
every push to `main`.

```sh
npm install
npm run dev      # http://localhost:4321, drafts included
npm run build    # dist/, drafts excluded
```

## Writing a post

Add a Markdown file to `src/content/posts/`. The filename is the URL:
`hashing.md` is served at `/writing/hashing/`.

```markdown
---
title: Universal Hashing
description: Optional, used for the page's meta description.
pubDate: 2026-10-01
draft: true        # remove to publish
---
```

Maths uses the same syntax as Obsidian: `$…$` inline, `$$…$$` display, and
one-line `$$…$$` is display too. See `MATH_REFERENCE.md`. Obsidian
`[[wikilinks]]` are not converted, so turn them into normal links first.

A post that needs diagrams or animation is `.mdx` instead, which lets it
import components from `src/components/`:

| Component | For |
| --- | --- |
| `Pseudocode` | algorithms in LaTeX `algorithmic` syntax, rendered at build time |
| `Mermaid` | flowcharts and sequence diagrams written as text |
| `HashingAnimation` | an example animated SVG diagram, to copy for new ones |

`src/content/posts/test-post.mdx` exercises all of it, and lists what KaTeX
doesn't support (TikZ, bussproofs, `\label`/`\eqref`, …) with workarounds.
Site-wide maths macros live in `astro.config.mjs`.

`drafts/` holds the old Jekyll drafts and `old_blogs/` the 2023 posts. Neither
is built.
