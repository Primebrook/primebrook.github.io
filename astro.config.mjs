// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkObsidianDisplayMath from './src/lib/remark-obsidian-display-math.mjs';

// Site-wide maths macros. KaTeX has no \DeclareMathOperator or preamble, so
// shorthand that would live in a LaTeX preamble lives here instead.
const macros = {
  '\\R': '\\mathbb{R}',
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\E': '\\mathbb{E}',
  '\\Var': '\\operatorname{Var}',
  '\\bigO': '\\mathcal{O}',
  '\\argmax': '\\operatorname*{arg\\,max}',
  '\\sem': '\\llbracket #1 \\rrbracket',
};

// https://astro.build/config
export default defineConfig({
  site: 'https://primebrook.github.io',

  markdown: {
    // Astro 7's default Markdown processor (Sätteri) takes no remark/rehype
    // plugins, so use the unified pipeline. It handles `$…$` inline and `$$…$$`
    // display maths, the same syntax Obsidian uses, rendered to HTML at build
    // time so readers load no maths JavaScript.
    processor: unified({
      remarkPlugins: [remarkMath, remarkObsidianDisplayMath],
      rehypePlugins: [[rehypeKatex, { macros }]],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },

  // .mdx posts can use components (diagrams, animations) alongside Markdown.
  integrations: [mdx()],
});
