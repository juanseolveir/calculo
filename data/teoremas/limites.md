---
tema: "limites"
titulo: "Teoremas de Límites"
---

## Teorema del Sandwich (Emparedado)

**Enunciado:** Sean $f$, $g$, $h$ funciones definidas en un entorno de $a$ (excepto posiblemente en $a$). Si:
$$g(x) \leq f(x) \leq h(x)$$
y $\displaystyle\lim_{x \to a} g(x) = \lim_{x \to a} h(x) = L$, entonces:
$$\lim_{x \to a} f(x) = L$$

**Aplicación clásica:** Para demostrar $\lim_{x \to 0} x^2 \sin\!\left(\tfrac{1}{x}\right) = 0$, usamos $-x^2 \leq x^2 \sin(1/x) \leq x^2$.

**Tags:** limites, acotacion, sandwich

---

## Unicidad del Límite

**Enunciado:** Si $\displaystyle\lim_{x \to a} f(x) = L$ y $\displaystyle\lim_{x \to a} f(x) = M$, entonces $L = M$.

**Demostración (idea):** Por definición $\varepsilon$-$\delta$, si ambos límites existen, $|L - M| < \varepsilon$ para todo $\varepsilon > 0$, lo que fuerza $L = M$.

**Tags:** limites, unicidad

---

## Álgebra de Límites

**Enunciado:** Si $\displaystyle\lim_{x \to a} f(x) = L$ y $\displaystyle\lim_{x \to a} g(x) = M$, entonces:

$$\lim_{x \to a} [f(x) + g(x)] = L + M$$
$$\lim_{x \to a} [f(x) \cdot g(x)] = L \cdot M$$
$$\lim_{x \to a} \frac{f(x)}{g(x)} = \frac{L}{M} \quad (M \neq 0)$$

**Tags:** limites, algebra, operaciones

---

## Límites Laterales y Existencia

**Enunciado:** $\displaystyle\lim_{x \to a} f(x) = L$ si y solo si:
$$\lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x) = L$$

**Tags:** limites, laterales, existencia

---

## Regla de L'Hôpital

**Enunciado:** Si $\displaystyle\lim_{x \to a} f(x) = \lim_{x \to a} g(x) = 0$ (o $\pm\infty$), y $g'(x) \neq 0$ en un entorno de $a$, entonces:
$$\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}$$
siempre que este último límite exista.

**Ejemplo:**
$$\lim_{x \to 0} \frac{\sin x}{x} \stackrel{\text{L'H}}{=} \lim_{x \to 0} \frac{\cos x}{1} = 1$$

**Tags:** limites, lhopital, indeterminacion
