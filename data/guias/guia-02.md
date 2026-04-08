---
id: guia-02
titulo: "Continuidad"
tema: "continuidad"
---

## Ejercicio 1

Determinar si la siguiente función es continua en $x = 1$:

$$f(x) = \begin{cases} x^2 - 1 & \text{si } x < 1 \\ 0 & \text{si } x = 1 \\ x - 1 & \text{si } x > 1 \end{cases}$$

<!-- meta: { "tipo": "numerico", "respuesta": "0" } -->

## Ejercicio 2

Encontrar el valor de $c$ que hace continua la función:

$$g(x) = \begin{cases} cx^2 + 1 & \text{si } x \leq 2 \\ x^3 - c & \text{si } x > 2 \end{cases}$$

<!-- meta: { "tipo": "numerico", "respuesta": "7/5" } -->

## Ejercicio 3

Analizar la continuidad de $h(x) = \dfrac{x^2 - 9}{x - 3}$ en $x = 3$ y clasificar la discontinuidad si existe.

<!-- meta: { "tipo": "desarrollo", "respuesta": "h(x) no está definida en x=3. Sin embargo, lim_{x→3} h(x) = lim_{x→3}(x+3) = 6. Es una discontinuidad evitable (o removible): se puede extender h definiendo h(3)=6 para obtener una función continua." } -->

## Ejercicio 4

Usando el Teorema del Valor Intermedio, demostrar que la ecuación $x^3 - x - 1 = 0$ tiene al menos una raíz real en el intervalo $[1, 2]$.

<!-- meta: { "tipo": "desarrollo", "respuesta": "Sea f(x)=x³-x-1. f(1)=1-1-1=-1<0 y f(2)=8-2-1=5>0. Como f es continua en [1,2] y f(1)<0<f(2), por el TVI existe c∈(1,2) tal que f(c)=0." } -->

## Ejercicio 5

Clasificar la discontinuidad de $f(x) = \dfrac{\sin x}{x}$ en $x = 0$ y definir $f(0)$ para hacerla continua.

<!-- meta: { "tipo": "numerico", "respuesta": "1" } -->
