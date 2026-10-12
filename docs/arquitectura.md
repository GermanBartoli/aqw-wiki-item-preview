# Arquitectura

La extensión se ejecuta solo en `https://aqwwiki.wikidot.com/*`. No usa un servidor propio ni guarda datos en el navegador.

1. `src/content/preview.js` escucha enlaces dentro del artículo visible (`#page-content`).
2. Después de 250 ms consulta el artículo enlazado con `fetch` y lo conserva en una caché de hasta 100 resultados durante la pestaña.
3. `src/core/item-page.js` comprueba que sea una ficha de objeto, descarta iconos de categorías y selecciona la primera imagen útil.
4. La vista previa se coloca junto al puntero. Se oculta al salir del enlace, al desplazar la página o al cambiar de pestaña.

El HTML se interpreta con `DOMParser`; se extraen texto y URL de imagen, nunca se inserta HTML remoto en la página. Los enlaces externos, rutas especiales y páginas sin imagen útil no generan vista previa.
