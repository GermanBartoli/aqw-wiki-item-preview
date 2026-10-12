# Verificación

Ejecutar `npm test`, `npm run build` y `npm run package` desde la raíz. El paquete para Chrome queda en `releases/`.

## Prueba manual

1. Cargar `dist/` en `chrome://extensions` mediante **Cargar descomprimida**.
2. Abrir [Trissa's Shop](https://aqwwiki.wikidot.com/trissa-s-shop), seleccionar **Classes / Armors** y apuntar a **Adept of Awe**. Debe aparecer la armadura.
3. Apuntar a un enlace de misión: no debe aparecer una imagen de objeto incorrecta.
4. Probar enlaces a arma, casco, capa y mascota. La imagen debe corresponder al artículo enlazado.
5. Sacar el puntero del enlace y desplazar la página: la vista debe ocultarse.

La disponibilidad de las imágenes depende de la wiki y de sus hosts externos. Si una ficha no tiene una imagen útil o el recurso falla, no se muestra vista previa.
