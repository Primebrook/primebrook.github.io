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

`drafts/` holds the old Jekyll drafts and `old_blogs/` the 2023 posts. Neither
is built.
