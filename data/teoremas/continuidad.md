---
tema: "continuidad"
titulo: "Teoremas de Continuidad"
---

## Definición de Continuidad

**Enunciado:** Una función $f$ es **continua en $a$** si y solo si se cumplen las tres condiciones:
1. $f(a)$ está definida
2. $\displaystyle\lim_{x \to a} f(x)$ existe
3. $\displaystyle\lim_{x \to a} f(x) = f(a)$

**Tags:** continuidad, definicion

---

## Teorema del Valor Intermedio (TVI)

**Enunciado:** Sea $f$ continua en el intervalo cerrado $[a, b]$. Si $k$ es cualquier valor entre $f(a)$ y $f(b)$, entonces existe al menos un $c \in (a, b)$ tal que $f(c) = k$.

**Corolario:** Si $f(a)$ y $f(b)$ tienen signos opuestos, la ecuación $f(x) = 0$ tiene al menos una solución en $(a, b)$.

**Tags:** continuidad, tvi, existencia, raices

---

## Teorema del Valor Extremo (TVE)

**Enunciado:** Si $f$ es continua en $[a, b]$, entonces $f$ alcanza su máximo y mínimo absolutos en $[a, b]$. Es decir, existen $c, d \in [a, b]$ tales que:
$$f(c) \leq f(x) \leq f(d) \quad \forall x \in [a, b]$$

**Tags:** continuidad, tve, maximo, minimo, extremos

---

## Continuidad de Funciones Compuestas

**Enunciado:** Si $g$ es continua en $a$ y $f$ es continua en $g(a)$, entonces $f \circ g$ es continua en $a$:
$$\lim_{x \to a} f(g(x)) = f\!\left(\lim_{x \to a} g(x)\right) = f(g(a))$$

**Tags:** continuidad, composicion, cadena

---

## Tipos de Discontinuidad

Las discontinuidades se clasifican en:

- **Evitable (removible):** El límite existe pero $f(a) \neq L$ o $f(a)$ no está definida. Ej.: $\dfrac{\sin x}{x}$ en $x=0$.
- **De salto:** Los límites laterales existen y son finitos pero distintos. Ej.: $\text{sgn}(x)$ en $x=0$.
- **Esencial (o infinita):** Al menos un límite lateral es $\pm\infty$. Ej.: $\dfrac{1}{x}$ en $x=0$.

**Tags:** continuidad, discontinuidad, clasificacion
