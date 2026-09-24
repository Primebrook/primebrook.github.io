import { visit } from 'unist-util-visit';

// remark-math treats `$$…$$` written on one line as inline maths; only a `$$`
// fence on its own line becomes a display block. Obsidian renders both as
// display maths, and drafts come from Obsidian, so match it: any inline maths
// delimited by `$$` in the source is rendered in display mode.
export default function remarkObsidianDisplayMath() {
  return (tree, file) => {
    const source = String(file.value);
    visit(tree, 'inlineMath', (node) => {
      const start = node.position?.start.offset;
      if (start === undefined || !source.startsWith('$$', start)) return;
      node.data ??= {};
      node.data.hProperties = { className: ['language-math', 'math-display'] };
    });
  };
}
