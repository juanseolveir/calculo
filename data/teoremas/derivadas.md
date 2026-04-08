---
tema: "derivadas"
titulo: "Teoremas de Derivabilidad"
---

## Definición de Derivada

**Enunciado:** La derivada de $f$ en $a$ se define como:
$$f'(a) = \lim_{h \to 0} \frac{f(a+h) - f(a)}{h}$$
Si este límite existe, $f$ es **derivable** en $a$.

**Tags:** derivadas, definicion, diferenciabilidad

---

## Derivabilidad implica Continuidad

**Enunciado:** Si $f$ es derivable en $a$, entonces $f$ es continua en $a$.

**Nota:** El recíproco es **falso**. Ejemplo: $f(x) = |x|$ es continua en $x=0$ pero no derivable allí.

**Tags:** derivadas, continuidad, implicacion

---

## Regla de la Cadena

**Enunciado:** Si $g$ es derivable en $a$ y $f$ es derivable en $g(a)$, entonces $h = f \circ g$ es derivable en $a$ y:
$$(f \circ g)'(a) = f'(g(a)) \cdot g'(a)$$

**Ejemplo:** Si $h(x) = \sin(x^2)$, entonces $h'(x) = \cos(x^2) \cdot 2x$.

**Tags:** derivadas, cadena, composicion

---

## Teorema de Rolle

**Enunciado:** Sea $f$ continua en $[a,b]$, derivable en $(a,b)$, y $f(a) = f(b)$. Entonces existe $c \in (a,b)$ tal que $f'(c) = 0$.

**Tags:** derivadas, rolle, valor-medio

---

## Teorema del Valor Medio (Lagrange)

**Enunciado:** Sea $f$ continua en $[a,b]$ y derivable en $(a,b)$. Entonces existe $c \in (a,b)$ tal que:
$$f'(c) = \frac{f(b) - f(a)}{b - a}$$

**Interpretación geométrica:** Existe un punto donde la tangente es paralela a la secante que une $(a, f(a))$ con $(b, f(b))$.

**Tags:** derivadas, valor-medio, lagrange, tvm

---

## Regla de L'Hôpital (para derivadas)

**Enunciado:** Si $f$ y $g$ son derivables y $\frac{f(a)}{g(a)}$ es una indeterminación $\frac{0}{0}$ o $\frac{\infty}{\infty}$:
$$\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}$$

**Tags:** derivadas, lhopital, indeterminacion, limites
