---
id: guia-01
titulo: "Límites"
tema: "limites"
---

## Ejercicio 1

Calcular el siguiente límite:

$$\lim_{x \to 0} \frac{\sin x}{x}$$

<!-- meta: { "tipo": "numerico", "respuesta": "1" } -->

## Ejercicio 2

Calcular el siguiente límite:

$$\lim_{x \to \infty} \frac{3x^2 + 2x - 1}{x^2 - 5}$$

<!-- meta: { "tipo": "numerico", "respuesta": "3" } -->

## Ejercicio 3

Calcular el siguiente límite:

$$\lim_{x \to 2} \frac{x^2 - 4}{x - 2}$$

<!-- meta: { "tipo": "numerico", "respuesta": "4" } -->

## Ejercicio 4

Calcular el siguiente límite:

$$\lim_{x \to 0} \frac{1 - \cos x}{x^2}$$

<!-- meta: { "tipo": "numerico", "respuesta": "0.5" } -->

## Ejercicio 5

Calcular el siguiente límite usando la definición épsilon-delta:

$$\lim_{x \to 3} (2x + 1) = 7$$

Demostrar formalmente que para todo $\varepsilon > 0$ existe $\delta > 0$ tal que $|x - 3| < \delta \Rightarrow |(2x+1) - 7| < \varepsilon$.

<!-- meta: { "tipo": "desarrollo", "respuesta": "Dado ε > 0, tomamos δ = ε/2. Si |x-3| < δ entonces |(2x+1)-7| = |2x-6| = 2|x-3| < 2δ = ε." } -->

## Ejercicio 6

Determinar si existe el límite y calcularlo si existe:

$$\lim_{x \to 0} \frac{|x|}{x}$$

Justificar analizando los límites laterales.

<!-- meta: { "tipo": "desarrollo", "respuesta": "El límite no existe. El límite lateral derecho es 1 (para x>0, |x|/x = 1) y el límite lateral izquierdo es -1 (para x<0, |x|/x = -1). Como son distintos, el límite no existe." } -->
