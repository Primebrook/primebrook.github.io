// Checks for problems a build doesn't fail on. Run through `npm run verify`
// (or `verify:drafts`), which builds first. Exits 1 if anything is found.
//
// In the built site, dist/:
//   - KaTeX errors, which KaTeX renders as red text rather than failing.
//   - Obsidian syntax that survived conversion: [[wikilinks]], ![[embeds]], [!callouts]
// In the post sources, src/content/posts/:
//   - invisible characters (zero-width spaces and joiners, BOM), which Obsidian
//     and copy-paste leave behind. Inside maths KaTeX only warns about these,
//     and rehype-katex swallows the warning, so the source is the place to look.
//   - Obsidian ==highlights==, which Markdown renders as literal == signs
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const POSTS = new URL('../src/content/posts/', import.meta.url).pathname;

async function* files(dir, test) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path, test);
    else if (test(entry.name)) yield path;
  }
}

// Text a reader sees: no code, no maths, no tags.
const visibleText = (html) =>
  html
    .replace(/<(pre|code|script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<span class="katex">[\s\S]*?<\/annotation>/g, ' ')
    .replace(/<[^>]+>/g, ' ');

const problems = [];
let pages = 0;
let maths = 0;

for await (const file of files(DIST, (name) => name.endsWith('.html'))) {
  pages += 1;
  const page = '/' + relative(DIST, file).replace(/index\.html$/, '');
  const html = await readFile(file, 'utf8');
  maths += (html.match(/class="katex"/g) ?? []).length;

  for (const m of html.matchAll(/class="katex-error" title="([^"]*)"/g)) {
    problems.push(`${page}  KaTeX: ${m[1].replace(/&#x27;/g, "'").replace(/&quot;/g, '"')}`);
  }
  const text = visibleText(html);
  for (const m of text.matchAll(/!?\[\[[^\]]+\]\]/g)) {
    problems.push(`${page}  Obsidian link left in: ${m[0]}`);
  }
  for (const m of text.matchAll(/\[!(\w+)\]/g)) {
    problems.push(`${page}  Obsidian callout left in: [!${m[1]}]`);
  }
}

const INVISIBLE = /[\u200B-\u200D\u2060\uFEFF]/g;
for await (const file of files(POSTS, (name) => /\.mdx?$/.test(name))) {
  const name = relative(POSTS, file);
  const lines = (await readFile(file, 'utf8')).split('\n');
  let inCode = false;
  lines.forEach((line, i) => {
    const at = `src/content/posts/${name}:${i + 1}`;
    for (const m of line.matchAll(INVISIBLE)) {
      problems.push(`${at}  invisible character U+${m[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0')} at column ${m.index + 1}`);
    }
    if (line.startsWith('```')) inCode = !inCode;
    const prose = line.replace(/`[^`]*`/g, '').replace(/\$[^$]*\$/g, '');
    if (!inCode && /==[^=\s][^=]*==/.test(prose)) problems.push(`${at}  Obsidian ==highlight== (use **bold** or <mark>)`);
  });
}

console.log(`verify: ${pages} pages, ${maths} maths expressions`);
if (problems.length) {
  console.error(problems.map((p) => `  ✗ ${p}`).join('\n'));
  process.exit(1);
}
console.log('verify: no problems found');
