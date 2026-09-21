# Pastelería El Buen Gusto · Web de pedidos

Demo funcional de una web para tomar pedidos en línea, hecha con la carta real de
El Buen Gusto (Calle Torre Tagle 249, Miraflores).

**Ver la demo:** https://chirinosj0719-rgb.github.io/elbuengusto-pedidos/

Preparada por **CreaX** para el equipo de El Buen Gusto.

---

## Qué hace

El cliente arma su pedido en la web y esta le abre WhatsApp con el pedido ya escrito,
con código y total, al **946 244 168** (el mismo número de su Linktree). El pedido llega
así, listo para confirmar:

```
*PEDIDO WEB EBG-1609-F9C7*

*Carta*
2 × Relámpago · Caramelo — S/ 13.00
1 × Triple (x 5 und.) — S/ 15.50

*Bocaditos para eventos*
2 × Alfajor de Miel (50 und.) — S/ 100.00

*Total productos: S/ 128.50*
*Entrega:* Delivery · Miraflores · Av. José Larco 812
*Fecha:* viernes 18 de septiembre · *Horario:* 10:00 a 12:00
*Cliente:* Ana Pérez · *Celular:* 987 654 321 · *Pago:* Yape
```

Ya no hay que preguntar producto por producto, ni sumar a mano, ni pedir la dirección
en tres mensajes.

## Lo que incluye la demo

- **La carta completa:** los 169 productos de sus dos cartas, con sus precios. 109 de la carta de delivery y 60 de la carta de bocaditos.
- **Dos formas de pedir:** carta por unidad y bocaditos para eventos por 25 o 50 unidades.
- **Regla de las 48 horas:** si el pedido lleva bocaditos para eventos, el calendario no permite elegir una fecha antes de 48 horas. Los domingos no aparecen.
- **Buscador:** encuentra "alfajor" aunque se escriba sin tilde.
- **Sabores:** relámpago de chocolate o caramelo, macarons, mini tartaletas y demás se eligen al agregar el producto.
- **Datos de entrega:** recojo en tienda o delivery, día, horario, forma de pago, factura con RUC y notas del pedido.
- **Hecha para el celular:** que es desde donde llega la gente de Instagram y Facebook.
- **Su marca:** el logo, los colores y las fotos salieron de sus propias cartas en PDF.

## Todo es modificable

Nada está fijo. Los precios, productos y textos están en archivos separados, pensados
para cambiarse en minutos:

| Para cambiar… | Archivo |
|---|---|
| Un precio, un producto nuevo, una categoría | `web/js/catalogo.js` |
| Teléfonos, horario, zonas de reparto, formas de pago | `web/js/config.js` |
| Colores y tipografías | `web/css/styles.css` |
| Fotos | `web/img/` |

Cuando saquen carta nueva, se actualiza y queda al día el mismo día. También se puede
cambiar el diseño, agregar secciones, o conectar pagos en línea.

## Lo que necesitamos confirmar con ustedes

Para armar la demo completamos algunos datos con supuestos razonables. Estos son los
que hay que corregir con información suya (están marcados con `CONFIRMAR` en el código):

| Dato | Lo que pusimos |
|---|---|
| Anticipación para pedidos de la carta | 3 horas |
| Delivery propio y a qué distritos | 15 distritos cercanos, costo "según distrito" |
| Formas de pago | Yape, Plin, transferencia, efectivo o tarjeta en tienda |
| Reseñas en Google | 4.5 con +2,400 reseñas (dato público) |

También ajustamos la escritura de algunos nombres de su carta ("Sand." a "Sándwich",
"Maizena" a "Maicena", "Strudell" a "Strudel"). Si prefieren dejarlos como están, se
revierte.

## Probarla en su computadora

No necesita instalar nada: descarguen el proyecto y abran `web/index.html` con doble clic.

## Siguiente paso: automatizar el WhatsApp

Hoy el pedido llega ordenado, pero alguien tiene que responderlo. La segunda fase es
que el WhatsApp responda solo:

- Confirma el pedido apenas llega y envía los datos de pago.
- Responde horario, dirección y carta sin que nadie escriba.
- Avisa al cliente cuando su pedido está listo o va en camino.
- Deja los pedidos del día ordenados en un panel: nuevo, pagado, en preparación, entregado.

---

## Nota técnica

Web estática: HTML, CSS y JavaScript, sin dependencias ni proceso de compilación.
Carga alrededor de 1 MB y funciona en cualquier hosting. Incluye datos estructurados
para Google (`Bakery`) y vista previa al compartir el enlace.

La demo tiene la etiqueta `noindex` para que Google no la muestre en las búsquedas y no
se confunda con el sitio oficial. Al publicarla en el dominio de El Buen Gusto hay que
quitar esa etiqueta de `web/index.html` y borrar `web/robots.txt`.

Contacto: CreaX · [completar correo y celular]
