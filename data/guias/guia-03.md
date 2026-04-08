---
id: guia-03
titulo: "Derivadas"
tema: "derivadas"
---

## Ejercicio 1

Calcular la derivada usando la definición (límite del cociente diferencial):

$$f(x) = x^2 + 3x$$

<!-- meta: { "tipo": "desarrollo", "respuesta": "f'(x) = lim_{h→0} [(x+h)²+3(x+h) - x²-3x]/h = lim_{h→0} [2xh+h²+3h]/h = lim_{h→0}(2x+h+3) = 2x+3." } -->

## Ejercicio 2

Derivar la función $f(x) = \dfrac{x^2 - 1}{x + 1}$ y simplificar.

<!-- meta: { "tipo": "numerico", "respuesta": "1" } -->

## Ejercicio 3

Encontrar la ecuación de la recta tangente a $y = x^3 - 2x$ en $x = 1$.

<!-- meta: { "tipo": "desarrollo", "respuesta": "f'(x)=3x²-2, f'(1)=1. f(1)=-1. Recta: y-(-1)=1(x-1) → y=x-2." } -->

## Ejercicio 4

Calcular $\dfrac{d}{dx}\left[\sin(x^2) \cdot e^x\right]$ usando la regla del producto y la regla de la cadena.

<!-- meta: { "tipo": "desarrollo", "respuesta": "Por regla del producto: [cos(x²)·2x]·eˣ + sin(x²)·eˣ = eˣ[2x·cos(x²) + sin(x²)]." } -->

## Ejercicio 5

Hallar los puntos críticos de $f(x) = x^3 - 3x^2 - 9x + 5$ y clasificarlos como máximo o mínimo local.

<!-- meta: { "tipo": "desarrollo", "respuesta": "f'(x)=3x²-6x-9=3(x²-2x-3)=3(x-3)(x+1). Puntos críticos: x=3 y x=-1. f''(x)=6x-6. f''(-1)=-12<0 → máximo local. f''(3)=12>0 → mínimo local." } -->

## Ejercicio 6

Usar la regla de L'Hôpital para calcular:

$$\lim_{x \to 0} \frac{e^x - 1 - x}{x^2}$$

<!-- meta: { "tipo": "numerico", "respuesta": "0.5" } -->
