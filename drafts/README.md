# Drafts

This folder contains draft blog posts that are work-in-progress.

## How Drafts Work

### Creating a Draft
- Put files in `_drafts/` without dates in the filename
- Example: `riemann-hypothesis.markdown` (NOT `2025-10-25-riemann-hypothesis.markdown`)
- No date needed in frontmatter either!

### Viewing Drafts Locally
To see drafts when developing locally:
```bash
bundle exec jekyll serve --drafts
```

Or to see them with live reload:
```bash
bundle exec jekyll serve --drafts --livereload
```

### Production (GitHub Pages, etc.)
Drafts are **automatically excluded** when building for production. They won't appear on your live site.

### Publishing a Draft
When ready to publish:
1. Move the file from `_drafts/` to `_posts/`
2. Rename it with the date: `YYYY-MM-DD-title.markdown`
3. Add a `date:` field to the frontmatter (optional but recommended)

Example:
```bash
# Move and rename
mv _drafts/riemann-hypothesis.markdown _posts/2025-10-26-riemann-hypothesis.markdown
```

Then add to frontmatter:
```yaml
---
layout: post
title: "Understanding the Riemann Hypothesis"
date: 2025-10-26 12:00:00 -0700
categories: number-theory
---
```

## Benefits
- ✅ Work on posts without showing them publicly
- ✅ Preview locally before publishing
- ✅ No need to worry about dates until ready to publish
- ✅ Keep your work organized

