---
id: guia-04
titulo: "Integrales"
tema: "integrales"
---

## Ejercicio 1

Calcular la integral indefinida:

$$\int (3x^2 + 2x - 5)\, dx$$

<!-- meta: { "tipo": "desarrollo", "respuesta": "∫(3x²+2x-5)dx = x³+x²-5x+C." } -->

## Ejercicio 2

Calcular la integral definida:

$$\int_0^1 x^3\, dx$$

<!-- meta: { "tipo": "numerico", "respuesta": "0.25" } -->

## Ejercicio 3

Calcular usando sustitución:

$$\int x \cdot \sqrt{x^2 + 1}\, dx$$

<!-- meta: { "tipo": "desarrollo", "respuesta": "Sea u=x²+1, du=2x dx. ∫x√(x²+1)dx = (1/2)∫√u du = (1/2)·(2/3)u^(3/2)+C = (1/3)(x²+1)^(3/2)+C." } -->

## Ejercicio 4

Calcular usando integración por partes:

$$\int x \cdot e^x\, dx$$

<!-- meta: { "tipo": "desarrollo", "respuesta": "Sea u=x, dv=eˣdx → du=dx, v=eˣ. Por partes: xeˣ - ∫eˣdx = xeˣ - eˣ + C = eˣ(x-1)+C." } -->

## Ejercicio 5

Calcular el área encerrada entre $f(x) = x^2$ y $g(x) = x$ en $[0, 1]$.

<!-- meta: { "tipo": "numerico", "respuesta": "0.1667" } -->

## Ejercicio 6

Enunciar y demostrar el Teorema Fundamental del Cálculo (parte 2): si $F'(x) = f(x)$, entonces $\int_a^b f(x)\,dx = F(b) - F(a)$.

<!-- meta: { "tipo": "desarrollo", "respuesta": "Sea G(x)=∫_a^x f(t)dt. Por TFC parte 1, G'(x)=f(x). Luego F y G difieren en una constante: F(x)=G(x)+C. Entonces F(b)-F(a)=[G(b)+C]-[G(a)+C]=G(b)-G(a)=∫_a^b f(t)dt." } -->
