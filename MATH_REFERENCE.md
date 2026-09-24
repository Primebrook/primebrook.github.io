# Maths reference

Maths is rendered by [KaTeX](https://katex.org/docs/supported) 0.18 at build
time. Every entry below was checked against it; the
[test post](src/content/posts/test-post.mdx) shows each one rendered.

## Delimiters

| Write | For |
| --- | --- |
| `$…$` | inline maths |
| `$$…$$` on one line, or with `$$` on their own lines | display maths |

`\(…\)` and `\[…\]` don't work here. One-line `$$…$$` is display maths, as in
Obsidian.

## Works

| Package or area | Examples |
| --- | --- |
| amsmath environments | `align`, `aligned`, `gathered`, `split`, `cases`, `rcases`, `pmatrix`, `bmatrix`, `vmatrix`, `Bmatrix`, `smallmatrix`, `array` with `\hline` |
| amsmath commands | `\tag{…}`, `\text`, `\dfrac`, `\tfrac`, `\binom`, `\substack`, `\underbrace`, `\overbrace`, `\overset`, `\underset`, `\xrightarrow[below]{above}`, `\boxed`, `\operatorname*`, `\pmod`, `\bmod` |
| mathtools | `dcases`, `\coloneqq`, `\eqqcolon`, `\mathllap`, `\mathrlap` |
| fonts (amssymb, mathrsfs, eufrak) | `\mathbb`, `\mathcal`, `\mathscr`, `\mathfrak`, `\mathsf`, `\boldsymbol`, `\bm` |
| amscd | `\begin{CD} A @>f>> B \\ @VgVV @VVhV \\ C @>>k> D \end{CD}` |
| xcolor | `\textcolor{teal}{x}`, `\color{…}`, `\colorbox{#fde68a}{text}` |
| cancel | `\cancel`, `\bcancel`, `\xcancel` |
| braket | `\ket`, `\bra`, `\braket`, `\Braket` |
| stmaryrd | `\llbracket`, `\rrbracket` |
| logic and types | `\vdash`, `\models`, `\nvdash`, `\forall`, `\exists`, `\neg`, `\lor`, `\iff`, inference rules as stacked `\frac` |
| per-expression macros | `\newcommand{\foo}{…}` works within the one expression it's in |

`\colorbox` holds text, so don't nest `$…$` inside it within inline maths: the
inner `$` ends the outer expression.

## Site-wide macros

Defined in `astro.config.mjs`, usable in every post:

| Macro | Expands to |
| --- | --- |
| `\R`, `\N`, `\Z` | `\mathbb{R}`, `\mathbb{N}`, `\mathbb{Z}` |
| `\E` | `\mathbb{E}` |
| `\Var` | `\operatorname{Var}` |
| `\bigO` | `\mathcal{O}` |
| `\argmax` | `\operatorname*{arg\,max}` |
| `\sem{e}` | `\llbracket e \rrbracket` |

Add a new one there when it's used in more than one post. This is the
replacement for a LaTeX preamble.

## Doesn't work, and what to do instead

| LaTeX | Instead |
| --- | --- |
| TikZ / PGF | A hand-made SVG component (see `HashingAnimation.astro`), or an SVG exported from TikZ elsewhere and added as an image |
| `algorithmic`, `algorithm2e` | The `Pseudocode` component, which takes `algorithmic` syntax (`.mdx` posts) |
| bussproofs `prooftree` | Stacked `\frac`, optionally in `gathered` for several rules |
| `\label` / `\eqref` | `\tag{1.1}` on the equation and "equation (1.1)" in the text |
| `\DeclareMathOperator`, preamble `\newcommand` | A site-wide macro in `astro.config.mjs`, or `\operatorname{…}` inline |
| `multline` | `split` or `aligned` |
| siunitx `\SI`, `\si` | `3\,\text{m}` |
| `\cancelto` | `\cancel` with a note |
| `\newcommand` redefining a built-in (`\R` already exists) | `\renewcommand`, or a different name |

To check a command before using it:

```sh
node -e "require('katex').renderToString(String.raw\`\YOUR{command}\`, {throwOnError: true, displayMode: true})"
```

An error names the undefined control sequence. `npm run verify` catches any
that reach a built page.

## Layout on small screens

- Display equations wider than the column scroll sideways inside their own box.
- Inline maths can't wrap inside one `$…$`. Write a long inline list as several
  `$…$` separated by commas.
- Stack wide groups (several inference rules, a long chain of equalities) with
  `gathered` or `aligned` rather than `\qquad` on one line.
