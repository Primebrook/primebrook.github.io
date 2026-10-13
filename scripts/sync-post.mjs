// Rebuilds a post's body from its Obsidian note, for posts whose figures are
// settled and whose text Brook now edits in Obsidian. Run as
// `npm run sync -- <slug>`. Reads the vault; never writes to it.
//
// Each synced post has a table next to it, src/content/posts/<slug>.sync.json:
//   note            the note's filename in ~/personal/second_brain/notes/
//   figures         { "<placeholder line prefix>": component markup }, a string
//                   or an array of lines. "{label}" becomes the "**Fig N.**"
//                   on the placeholder line, "{caption}" the text after it.
//   stopAtHeading   optional: the post ends at the first heading containing this
//   dropFromHeadings  optional: text removed from every heading
//
// The post keeps its own frontmatter and import lines; everything after them
// is replaced. The note's frontmatter is dropped. "> [!question]- Title"
// callouts become <details class="aside"> drop-downs. Any other line starting
// with "<" stops the sync, so an unmapped placeholder never reaches the page.
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const slug = process.argv[2];
if (!slug) {
  console.error('usage: npm run sync -- <slug>');
  process.exit(1);
}
const POSTS = new URL('../src/content/posts/', import.meta.url).pathname;
const VAULT = join(homedir(), 'personal/second_brain/notes');

const fail = (msg) => {
  console.error(`sync: ${msg}`);
  process.exit(1);
};
const read = (path, what) => readFile(path, 'utf8').catch(() => fail(`no ${what} at ${path}`));

const table = JSON.parse(await read(join(POSTS, `${slug}.sync.json`), 'sync table'));
const postPath = [`${slug}.mdx`, `${slug}.md`].map((f) => join(POSTS, f)).find(existsSync);
if (!postPath) fail(`no post ${slug}.mdx or ${slug}.md in src/content/posts/`);
const post = await read(postPath, 'post');
const note = await read(join(VAULT, table.note), 'note');

// The post's frontmatter, then its import lines and the blank lines among them.
const postLines = post.split('\n');
let keep = postLines.indexOf('---', 1) + 1;
if (keep === 0) fail(`no frontmatter in ${postPath}`);
while (keep < postLines.length && /^(import\s|\s*$)/.test(postLines[keep])) keep++;
while (keep > 0 && postLines[keep - 1].trim() === '') keep--;
const head = postLines.slice(0, keep).join('\n');

let lines = note.startsWith('---') ? note.split('---').slice(2).join('---').split('\n') : note.split('\n');
const isHeading = (l) => /^#{1,6}\s/.test(l);
if (table.stopAtHeading) {
  const at = lines.findIndex((l) => isHeading(l) && l.includes(table.stopAtHeading));
  if (at !== -1) lines = lines.slice(0, at);
}
if (table.dropFromHeadings) {
  lines = lines.map((l) => (isHeading(l) ? l.replaceAll(table.dropFromHeadings, '') : l));
}

const figures = Object.entries(table.figures ?? {}).map(([prefix, markup]) => [
  prefix,
  Array.isArray(markup) ? markup.join('\n') : markup,
]);

const out = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const figure = figures.find(([prefix]) => l.startsWith(prefix));
  if (figure) {
    const num = l.match(/\*\*(Fig \d+\.)\*\*/);
    if (!num) fail(`no **Fig N.** on placeholder: ${l.slice(0, 70)}`);
    const caption = l.slice(num.index + num[0].length).trim().replaceAll('"', '&quot;');
    out.push(figure[1].replaceAll('{label}', num[1]).replaceAll('{caption}', caption));
  } else if (l.startsWith('> [!question]-')) {
    out.push('<details class="aside">', `<summary>${l.slice('> [!question]-'.length).trim()}</summary>`, '');
    while (lines[i + 1]?.startsWith('>')) out.push(lines[++i].slice(1).trimStart());
    out.push('', '</details>');
  } else if (l.startsWith('<')) {
    fail(`unmapped placeholder in note (add it to ${slug}.sync.json): ${l.slice(0, 70)}`);
  } else {
    out.push(l.trimEnd());
  }
}

const body = out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
await writeFile(postPath, `${head}\n\n${body}\n`);
console.log(`sync: ${postPath.slice(POSTS.length)} rebuilt from ${table.note}`);
