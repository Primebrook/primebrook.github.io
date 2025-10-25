# Math Blog Reference Guide

This guide shows you how to use LaTeX, code blocks, and images in your blog posts.

## LaTeX Math Support

### Inline Math
Use single dollar signs `$...$` or `\(...\)` for inline math:
- `$E = mc^2$` renders as $E = mc^2$
- `$\sum_{i=1}^{n} i$` renders as $\sum_{i=1}^{n} i$

### Block Math (Display Mode)
Use double dollar signs `$$...$$` or `\[...\]` for centered equations:

```latex
$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

### Common LaTeX Commands

**Greek Letters:**
- `\alpha, \beta, \gamma, \Delta, \Omega`
- `\pi, \theta, \phi, \lambda, \mu`

**Operators:**
- `\sum, \prod, \int, \lim`
- `\frac{a}{b}` for fractions
- `\sqrt{x}` or `\sqrt[n]{x}` for roots

**Calculus:**
- `\frac{d}{dx}`, `\frac{\partial}{\partial x}`
- `\int_{a}^{b}`, `\oint`, `\iint`

**Linear Algebra:**
```latex
$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
```

**Environments:**
```latex
$$
\begin{align}
x + y &= 5 \\
2x - y &= 1
\end{align}
$$
```

## Code Blocks

Use triple backticks with language name:

````markdown
```python
def hello():
    print("Hello, World!")
```
````

Supported languages: python, javascript, ruby, java, c, cpp, rust, go, bash, sql, and many more.

## Images

### Markdown Syntax
```markdown
![Alt text](/assets/img/your-image.png)
```

### HTML for More Control
```html
<img src="/assets/img/your-image.png" 
     alt="Description" 
     style="max-width: 600px; display: block; margin: 0 auto;">
```

### Image Placement
Store images in `/docs/assets/img/` directory.

## Creating a New Post

1. Create a file in `docs/_posts/` with format: `YYYY-MM-DD-title.markdown`
2. Add frontmatter:
```yaml
---
layout: post
title: "Your Post Title"
date: 2025-10-25 12:00:00 -0700
categories: math calculus
---
```
3. Write your content with LaTeX, code, and images!

## Tips

- **Escape characters**: Use `\` to escape special characters
- **Test rendering**: Check your post locally before publishing
- **Complex equations**: For very long equations, consider breaking them up
- **Performance**: MathJax renders on page load, so many equations may slow down the page

## Example Post Structure

```markdown
---
layout: post
title: "The Fundamental Theorem of Calculus"
date: 2025-10-25
categories: math calculus
---

The fundamental theorem of calculus states that if $f$ is continuous on $[a,b]$, then:

$$
\int_{a}^{b} f(x) dx = F(b) - F(a)
$$

where $F$ is an antiderivative of $f$.

## Proof

[Your proof here with more math...]

## Example

Here's a Python implementation:

```python
def integrate(f, a, b, n=1000):
    # Numerical integration using trapezoidal rule
    dx = (b - a) / n
    return dx * sum(f(a + i*dx) for i in range(n))
```

[More content...]
```

## Resources

- [MathJax Documentation](https://docs.mathjax.org/)
- [LaTeX Math Symbols](https://www.overleaf.com/learn/latex/List_of_Greek_letters_and_math_symbols)
- [Kramdown Syntax](https://kramdown.gettalong.org/syntax.html)

