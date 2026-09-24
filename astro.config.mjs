// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkObsidianDisplayMath from './src/lib/remark-obsidian-display-math.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://primebrook.github.io',
  markdown: {
    // `$…$` inline and `$$…$$` display maths, the same syntax Obsidian uses,
    // rendered to HTML at build time so readers load no maths JavaScript.
    remarkPlugins: [remarkMath, remarkObsidianDisplayMath],
    rehypePlugins: [rehypeKatex],
  },
});
