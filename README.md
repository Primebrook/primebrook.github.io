# Brook's Blog

Source for [primebrook.github.io](https://primebrook.github.io): writing on
computer science, mathematics and software engineering.

Built with [Astro](https://astro.build), with maths by
[KaTeX](https://katex.org). Every push to `main` is built and deployed to
GitHub Pages by `.github/workflows/deploy.yml`.

```sh
npm install
npm run dev              # http://localhost:4321, drafts included
npm run check            # type check
npm run verify           # build, then scan for broken maths and Obsidian leftovers
npm run inspect -- /writing/test-post/   # check a page in Chrome at phone and desktop width
```

## Writing a post

Add a file to `src/content/posts/`. The filename becomes the URL, so
`hashing.md` is served at `/writing/hashing/`.

```markdown
---
title: Universal Hashing
description: Optional, one sentence for search results and link previews.
pubDate: 2026-10-01
draft: true        # remove to publish
---

Let $U \subset \N$ be a set of keys.

$$\Pr[h(x) = h(y)] \leq \frac{1}{m}$$
```

- **Maths** is written as in Obsidian: `$…$` inline, `$$…$$` display. What
  works and what doesn't is in [`MATH_REFERENCE.md`](MATH_REFERENCE.md).
- **Images** go in `src/assets/posts/<slug>/` and are referenced relatively:
  `![Alt text](../../assets/posts/<slug>/figure.svg)`.
- **Diagrams, algorithms and animations** need an `.mdx` post, which can use the
  components in `src/components/`.

The [test post](https://primebrook.github.io/writing/test-post/)
(`src/content/posts/test-post.mdx`) uses every feature: extended LaTeX,
pseudocode, Mermaid, images and an animated diagram. It's unlisted (reachable by
URL, left off the home page) and kept as a working example to copy from.

## Layout

| Path | What |
| --- | --- |
| `src/content/posts/` | posts (`.md`, `.mdx`) |
| `src/components/` | `Pseudocode`, `Mermaid`, `HashingAnimation` |
| `src/assets/posts/` | images, one folder per post |
| `src/pages/`, `src/layouts/` | home page, about page, post template |
| `src/styles/global.css` | all styling, light and dark |
| `astro.config.mjs` | maths pipeline and site-wide LaTeX macros |
| `scripts/` | `verify-dist.mjs`, `inspect.mjs` |

`CLAUDE.md` has the full account of how it fits together, for working on it
with Claude Code.
