# Cotizador Helmlinger Atelier

Aplicación web para generar cotizaciones de joyería. Permite calcular precios de **joyas nuevas** y **arreglos**, con vista previa en tiempo real y descarga en formato JPG.

## Funcionalidades

- **Dos modos de cotización**: Joya nueva y Arreglo
- **Cálculo automático**: precios de producto, metal, piedras, engaste, márgenes y merma
- **Vista previa**: diseño tipo documento con logo, descripción, desglose y foto opcional
- **Exportación a JPG**: descarga la cotización como imagen usando html2canvas
- **Foto del producto**: opcional, se puede subir y se muestra en la cotización

## Archivos

| Archivo | Descripción |
|---|---|
| `index.html` | Página principal |
| `styles.css` | Estilos visuales |
| `script.js` | Lógica de cálculo e interacción |
| `cotizador_helmlinger_v1.html` | Versión original todo-en-uno (respaldo) |

## Uso

Abrir `index.html` en cualquier navegador moderno. No requiere servidor ni conexión a internet (excepto para fuentes de Google y html2canvas CDN).

## Stack

- HTML + CSS + vanilla JavaScript
- [html2canvas](https://html2canvas.hertzen.com/) para exportación a JPG
- Google Fonts: Cormorant Garamond + Montserrat
