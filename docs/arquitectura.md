# Arquitectura

La extensión se ejecuta solo en `https://aqwwiki.wikidot.com/*`. No usa un servidor propio ni guarda datos en el navegador.

1. `src/content/table-preview.js` añade una columna **Foto** a las tablas con **Name** y **Price**. Carga todas las filas, incluso en pestañas ocultas, con un máximo de tres consultas simultáneas.
2. `src/content/preview.js` escucha enlaces dentro del artículo visible (`#page-content`) y muestra una vista flotante después de 250 ms.
3. `src/content/item-loader.js` comparte las consultas de `fetch` entre ambas vistas y conserva hasta 100 resultados en memoria durante la pestaña.
4. `src/core/item-page.js` comprueba que sea una ficha de objeto, descarta iconos de categorías y selecciona la primera imagen útil.
5. La vista flotante se coloca junto al puntero. Se oculta al salir del enlace, al desplazar la página o al cambiar de pestaña.

El HTML se interpreta con `DOMParser`; se extraen texto y URL de imagen, nunca se inserta HTML remoto en la página. Los enlaces externos, rutas especiales y páginas sin imagen útil no generan vista previa.
