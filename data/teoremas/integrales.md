---
tema: "integrales"
titulo: "Teoremas de Integración"
---

## Teorema Fundamental del Cálculo — Parte 1

**Enunciado:** Sea $f$ continua en $[a, b]$. Define $G(x) = \displaystyle\int_a^x f(t)\, dt$. Entonces $G$ es derivable en $(a, b)$ y:
$$G'(x) = f(x)$$

**Consecuencia:** Toda función continua tiene primitiva.

**Tags:** integrales, tfc, fundamental, parte1

---

## Teorema Fundamental del Cálculo — Parte 2

**Enunciado:** Si $F$ es una primitiva de $f$ en $[a,b]$ (es decir, $F' = f$), entonces:
$$\int_a^b f(x)\, dx = F(b) - F(a)$$

**Notación:** Se escribe $\Big[F(x)\Big]_a^b = F(b) - F(a)$.

**Tags:** integrales, tfc, fundamental, parte2, primitiva

---

## Linealidad de la Integral

**Enunciado:** Para $f$ y $g$ integrables en $[a,b]$ y $\alpha, \beta \in \mathbb{R}$:
$$\int_a^b [\alpha f(x) + \beta g(x)]\, dx = \alpha \int_a^b f(x)\, dx + \beta \int_a^b g(x)\, dx$$

**Tags:** integrales, linealidad, propiedades

---

## Integración por Sustitución

**Enunciado:** Si $u = g(x)$ es diferenciable y $f$ es continua, entonces:
$$\int f(g(x))\, g'(x)\, dx = \int f(u)\, du$$

Para la integral definida: $\displaystyle\int_a^b f(g(x)) g'(x)\, dx = \int_{g(a)}^{g(b)} f(u)\, du$.

**Tags:** integrales, sustitucion, cambio-variable

---

## Integración por Partes

**Enunciado:** Deriva del producto de derivadas. Si $u = u(x)$ y $v = v(x)$:
$$\int u\, dv = uv - \int v\, du$$

**Regla LIATE** para elegir $u$: Logarítmicas, Inversas trigonométricas, Algebraicas, Trigonométricas, Exponenciales.

**Tags:** integrales, partes, liate

---

## Área entre Curvas

**Enunciado:** El área entre $f(x)$ y $g(x)$ en $[a,b]$ con $f(x) \geq g(x)$ es:
$$A = \int_a^b [f(x) - g(x)]\, dx$$

**Tags:** integrales, area, geometria, aplicaciones
