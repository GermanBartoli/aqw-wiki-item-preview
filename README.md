# AQW Wiki Item Preview

<img src="docs/media/logo.svg" alt="AQW Wiki Item Preview" width="600">

Extensión de Chrome que muestra la imagen de un objeto al dejar el mouse sobre su enlace en [AQW Wiki](https://aqwwiki.wikidot.com/). Por ejemplo, en [Trissa's Shop](https://aqwwiki.wikidot.com/trissa-s-shop), apuntá a [Adept of Awe](https://aqwwiki.wikidot.com/adept-of-awe) para ver la armadura sin abrir su artículo.

## Ejemplo

| Enlace en la tienda | Imagen del artículo enlazado |
| --- | --- |
| <img src="docs/media/wiki-shop.png" alt="Enlace Adept of Awe en Trissa's Shop" width="520"> | <img src="docs/media/wiki-item.png" alt="Armadura Adept of Awe en su artículo" width="260"> |

Estas capturas muestran las páginas de referencia aportadas para el proyecto. La vista flotante se genera sobre la tienda al pasar el mouse; todavía no hay una captura de esa interacción.

## Qué hace

- Reconoce enlaces de artículos dentro del contenido de la wiki, incluso en pestañas de tiendas.
- Consulta el artículo enlazado tras una pausa de 250 ms y muestra la primera imagen del objeto.
- Omite iconos de AC, rareza y categorías, además de páginas que no son fichas de objetos.
- Oculta la imagen al salir del enlace o desplazar la página. Conserva resultados en memoria durante la pestaña.

## Descarga

Descargá `aqw-wiki-item-preview-1.0.0.zip` desde el [release v1.0.0](https://github.com/GermanBartoli/aqw-wiki-item-preview/releases/tag/v1.0.0). Es una extensión descomprimida de Chrome, no un instalador.

## Instalación

1. Descargá el ZIP del release y descomprimilo.
2. Abre `chrome://extensions` y activa **Modo desarrollador**.
3. Pulsá **Cargar descomprimida** y elegí la carpeta extraída.
4. Abrí o recargá una página de AQW Wiki.

## Desarrollo

Requiere Node.js 22 o posterior y PowerShell para generar el ZIP. No hay paquetes que instalar.

```sh
npm test
npm run build
npm run package
```

`dist/` es la carpeta para **Cargar descomprimida**. `releases/` contiene el ZIP. Ver [arquitectura](docs/arquitectura.md) y [verificación](docs/verificacion.md).

```text
src/core/           Selección de enlaces e imágenes
src/content/        Vista flotante y eventos del puntero
assets/             Iconos de la extensión
tests/              Pruebas del analizador
scripts/            Build, iconos y paquete ZIP
docs/               Arquitectura, verificación e imágenes
.github/workflows/  Verificación automática
```

## Privacidad y límites

No requiere cuenta, configuración ni permisos fuera de `aqwwiki.wikidot.com`. La extensión no guarda datos ni usa telemetría. Consulta los artículos de la wiki al apuntar a sus enlaces y carga las imágenes desde los hosts que esos artículos utilizan.

La selección usa la estructura actual de las fichas de AQW Wiki. Una página sin imagen útil, una imagen caída o un cambio de formato en la wiki pueden dejar la vista previa vacía. No está publicada en Chrome Web Store ni es un producto oficial de AQW Wiki.

## Licencia y créditos

Código bajo licencia [MIT](LICENSE). Las capturas de AQW Wiki son material de referencia aportado para el proyecto; el contenido de la wiki indica [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) salvo indicación contraria. Las imágenes de los objetos permanecen en sus hosts originales.
