---
layout: post
title: "Math Blog Demo - LaTeX, Code, and Images"
categories: demo math
---

Welcome to the demo post for Brook's Math Blog! This post demonstrates all the key features you'll need.

## Inline Math

You can write inline math like this: $E = mc^2$ or like this: $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$.

The quadratic formula is $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$, and Euler's identity is $e^{i\pi} + 1 = 0$.

## Block Math (Display Mode)

Use double dollar signs for centered equations:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

You can also use equation environments:

$$
\begin{align}
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &= \frac{4\pi}{c}\vec{\mathbf{j}} \\
\nabla \cdot \vec{\mathbf{E}} &= 4 \pi \rho \\
\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} &= \vec{\mathbf{0}} \\
\nabla \cdot \vec{\mathbf{B}} &= 0
\end{align}
$$

## Matrix Example

Here's a matrix:

$$
A = \begin{bmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{bmatrix}
$$

## Code Blocks

Python code with syntax highlighting:

```python
def fibonacci(n):
    """Calculate the nth Fibonacci number"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Example usage
result = fibonacci(10)
print(f"The 10th Fibonacci number is {result}")
```

JavaScript example:

```javascript
const calculateFactorial = (n) => {
  if (n <= 1) return 1;
  return n * calculateFactorial(n - 1);
};

console.log(`5! = ${calculateFactorial(5)}`);
```

## Images

To embed an image, use standard Markdown syntax:

```markdown
![Alt text](/assets/img/your-image.png)
```

Or with HTML for more control:

```html
<img src="/assets/img/your-image.png" alt="Description" style="max-width: 600px;">
```

## Combining Math and Text

When proving the **Pythagorean theorem**, we start with a right triangle. If $a$ and $b$ are the lengths of the two legs, and $c$ is the length of the hypotenuse, then:

$$
a^2 + b^2 = c^2
$$

This can be proven geometrically by constructing squares on each side of the triangle.

## Advanced Math Examples

**Taylor Series:**

$$
f(x) = f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \frac{f'''(a)}{3!}(x-a)^3 + \cdots
$$

**Fourier Transform:**

$$
\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x) e^{-2\pi i x \xi} dx
$$

**Calculus:**

The derivative of $\sin(x)$ is $\cos(x)$, and we can verify this:

$$
\frac{d}{dx}\sin(x) = \lim_{h \to 0} \frac{\sin(x+h) - \sin(x)}{h} = \cos(x)
$$

---

That's it! Your blog now supports beautiful math rendering, syntax-highlighted code blocks, and images.

