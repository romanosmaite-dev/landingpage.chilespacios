# Chilespacios — Landing Page

Landing page de conversión para **Chilespacios**, condominio de bodegas y minibodegas
en Av. Balmaceda 6555, Valdivia.

Un solo archivo autocontenido: `index.html`. Se abre con doble clic, sin build ni servidor.

---

## 1. El logo

El logo está **reconstruido como SVG vectorial** dentro del HTML: el isotipo
(bodega verde con portón amarillo) más el wordmark en texto. No depende de ningún
archivo de imagen, se ve nítido en cualquier resolución y no agrega peticiones de red.

Aparece en tres lugares:

| Dónde | Versión | Buscar en el HTML |
|---|---|---|
| Header | Original (isotipo verde + texto gris oscuro) | `===== LOGO (HEADER) =====` |
| Footer | **Invertida** (isotipo verde claro + texto blanco) | `===== LOGO (FOOTER) =====` |
| Pestaña del navegador | Isotipo solo | `<link rel="icon">` en el `<head>` |

El navbar tiene fondo blanco justamente para que el logo original caiga encima sin
retoques. En el footer, que es verde muy oscuro, el logo original (texto negro) no
tendría contraste, así que ahí va la versión reversa: la bodega en dos verdes claros
(`#29C766` y `#1FA855`), el wordmark en blanco y el hueco del portón pintado del
color del fondo. Ambas versiones llevan el marco rectangular del encuadre oficial.

### Si prefieres montar el archivo original

1. Guarda el archivo en `img/logo-chilespacios.png` (PNG con fondo transparente, o SVG).
2. En cada bloque de logo, **descomenta la línea `<img>` y borra el `<svg>` y el `<span>` del wordmark**.

```html
<img src="img/logo-chilespacios.png" alt="Chilespacios - Bodegas y Logística" class="h-10 lg:h-12 w-auto" />
```

Para el footer necesitarías además una versión del logo en blanco
(`img/logo-chilespacios-blanco.png`), ya que la original no se lee sobre verde oscuro.

**Nota sobre la tipografía:** el wordmark usa Archivo 900 (Google Fonts), la
grotesca pesada más cercana a la del logo original, pero no la fuente exacta. Si la
fidelidad tipográfica es crítica, monta el archivo de imagen como se indica arriba.

---

## 2. Configuración de contacto (obligatoria)

Todos los datos están centralizados en **un único bloque** al final de `index.html`,
dentro de la etiqueta `<script>`. Busca `var CONFIG` y reemplaza:

```js
var CONFIG = {
  whatsapp: '56900000000',        // Nº real, formato internacional, sin + ni espacios
  telefono: '+56 9 0000 0000',    // Cómo se muestra en pantalla
  telefonoLink: '+56900000000',   // Para el enlace tel:
  email: 'contactochilespacios@gmail.com',

  mostrarTelefono: false,         // ← ponlo en true cuando tengas el número
  mostrarWhatsapp: false,         // ← ponlo en true cuando tengas el número

  modoEnvio: 'email',             // 'whatsapp' | 'email' | 'endpoint'
  endpoint: ''                    // URL del backend si usas 'endpoint'
};
```

### Los interruptores `mostrar...`

Hoy están en **`false`** porque el número de teléfono todavía no existe. Con eso,
el teléfono y WhatsApp **desaparecen por completo** de la página: el enlace del
navbar, la ficha de Ubicación, el pie, el botón verde de la sección Contacto, el
ícono social y el botón flotante. Nadie ve un número inventado.

**Cuando tengas el teléfono definitivo**, haz dos cosas en este mismo bloque:

1. Escribe el número real en `whatsapp`, `telefono` y `telefonoLink`.
2. Cambia los dos interruptores a `true`.

Todo vuelve a aparecer solo. No hay que tocar nada más del código.

Estos valores se inyectan automáticamente en el navbar, la sección de ubicación,
el footer, el botón flotante y todos los enlaces de WhatsApp. **No hay que editarlos
en más de un lugar.**

### Otros placeholders a reemplazar
| Qué | Dónde |
|---|---|
| Redes sociales (Instagram, Facebook, LinkedIn) | `href="#"` en el `<footer>` |
| Términos y Política de privacidad | `href="#"` al pie del `<footer>` |
| Dominio real | `<link rel="canonical">` y `og:url` en el `<head>` |

---

## 3. Cómo funciona el formulario

Hay dos formularios (sección de contacto y modal de cotización), ambos con validación en
cliente: campos obligatorios, formato de email y de teléfono, mensajes de error
inline y foco automático en el primer campo con problemas.

**Modo `email` (el activo hoy):** al enviar, abre el programa de correo del
visitante con la solicitud ya redactada y dirigida a la dirección de `email`.
No necesita servidor. Su límite: si la persona no tiene configurado un cliente
de correo (pasa en varios computadores), no ocurre nada al pulsar el botón.

**Modo `whatsapp`:** abre WhatsApp con la solicitud ya redactada. Se activa solo
si `mostrarWhatsapp` está en `true`; si no, cae automáticamente a `email`.

**Modo `endpoint` (el recomendado en producción):** cambia `modoEnvio: 'endpoint'`
y pon la URL en `endpoint`. Hace un `POST` con JSON y la solicitud te llega al
correo sin depender del computador del visitante. [Formspree](https://formspree.io)
es gratis hasta 50 mensajes al mes y se configura en unos 5 minutos: creas una
cuenta, te dan una URL, la pegas en `endpoint` y listo.

---

## 4. Imágenes del hero

El hero tiene dos capas de imagen:

**La foto de la derecha** es `img/vista-satelital.jpg`, en un marco vertical 4:5
(la imagen actual mide 819×1024 y calza exacto). Para cambiarla, sobrescribe el
archivo con el mismo nombre, en minúsculas. El nombre dice "satelital" por una
versión anterior; hoy es una foto aérea de las bodegas.

**El fondo** es un degradado verde con patrón de rejilla, sin depender de archivos
externos. Si quieres además una foto de fondo detrás del texto:

1. Guarda la imagen en `img/hero-bodegas.jpg` (recomendado: 1920×1080, < 300 KB, WebP o JPG optimizado).
2. En el `<style>` del `<head>`, dentro de `.hero-bg`, descomenta la línea marcada:

```css
background-image: linear-gradient(125deg, rgba(20,83,45,.93), rgba(5,46,22,.93)), url('img/hero-bodegas.jpg');
```

El degradado verde encima garantiza que el texto blanco siga legible sobre cualquier foto.

---

## 5. Fotos de "Nuestro Condominio"

La sección `#condominio` muestra cuatro fotos del recinto en una grilla asimétrica
(7/5 y 5/7 en escritorio, apiladas en móvil). Al hacer clic en cualquiera se abre
un visor ampliado con flechas, navegación por teclado y cierre con `Esc`.

**Las cuatro fotos ya están cargadas** en `img/`, con estos nombres:

| Archivo | Contenido |
|---|---|
| `img/condominio-1.jpg` | Fachada con los portones verdes de acceso |
| `img/condominio-2.jpg` | Vista aérea del condominio |
| `img/condominio-3.jpg` | Calle interior con camiones y los cerros al fondo |
| `img/condominio-4.jpg` | Fila de bodegas con cortinas de acero |

⚠️ **Los nombres deben ser exactamente esos:** minúsculas, sin espacios, sin tildes
y con una sola extensión. Las fotos originales venían como `Chile espacios-9.jpg.jpeg`
y por eso no se veían: el espacio y la doble extensión rompen la ruta. En un servidor
de internet falla aún más seguido, porque a diferencia de Windows sí distingue
mayúsculas de minúsculas.

Para reemplazar una foto, sobrescribe el archivo manteniendo el mismo nombre — no hay
que tocar el código. Si un archivo falta o está mal nombrado, la tarjeta muestra una
placa verde que dice "Falta img/condominio-N.jpg" en lugar de un ícono roto: esa placa
es la señal de que el nombre no coincide.

**Peso:** las cuatro suman ~1,6 MB (300–450 KB cada una). Funciona, pero si quieres
que cargue más rápido en celular, pásalas por [squoosh.app](https://squoosh.app) y
déjalas bajo 200 KB. Hay más detalle en `img/LEEME.txt`.

Para cambiar los textos que aparecen sobre cada foto, edita el `<figcaption>` de
cada `<figure>`; el texto del visor ampliado sale del atributo `data-caption`.

---

## 6. Mapa

El `<iframe>` de la sección Ubicación apunta a la dirección por búsqueda. Para
usar el pin exacto del recinto: Google Maps → **Compartir** → **Insertar un mapa**
→ copiar el `src` y reemplazarlo en el iframe.

---

## 7. Paleta de marca

Los dos colores de marca están **tomados directamente del logo oficial**: el verde
de la bodega es `brand-700` y el amarillo del portón es `gold-400`, así que los
botones de acción coinciden exactamente con el logo.

| Rol | Token Tailwind | Hex |
|---|---|---|
| **Verde del logo** (íconos, CTAs secundarios) | `brand-700` | `#16803C` |
| Verde oscuro (secciones destacadas) | `brand-900` | `#14532d` |
| Verde muy oscuro (footer) | `brand-950` | `#052e16` |
| Verde claro (fondos suaves, badges) | `brand-50` | `#f0fdf4` |
| **Amarillo del logo** (botones y destacados) | `gold-400` | `#F5C518` |
| Gris claro (fondos secundarios) | `gray-50` / `gray-100` | `#f9fafb` / `#f3f4f6` |
| Gris oscuro (textos) | `gray-700` / `gray-900` | `#374151` / `#111827` |
| Blanco | — | `#ffffff` |

Definida en `tailwind.config` dentro del `<head>`. Cambia los hex ahí y se propaga
a toda la página.

**Sobre el amarillo:** todos los botones amarillos llevan texto verde muy oscuro
(`brand-950`), no blanco. Texto blanco sobre amarillo no alcanza el contraste
mínimo de accesibilidad y se lee mal en pantallas con brillo bajo.

---

## 8. Estructura de secciones

| # | Sección | `id` |
|---|---|---|
| 1 | Header / Navbar sticky (blanco) | — |
| 2 | Hero + formulario express | `#inicio` |
| 3 | Seguridad y confianza (3 tarjetas) | `#seguridad` |
| 4 | **Nuestro Condominio (galería)** | `#condominio` |
| 5 | Bodegas Industriales (B2B) | `#industriales` |
| 6 | Minibodegas — planes | `#minibodegas` |
| 7 | Servicios logísticos | `#servicios` |
| 8 | Ubicación + mapa | `#ubicacion` |
| 9 | Formulario de cotización | `#contacto` |
| 10 | Footer | — |

Cada sección está delimitada por un comentario de bloque en el HTML, en el mismo
orden, para que sea fácil extraerlas como componentes si más adelante se migra a
Astro, Next.js o WordPress.

---

## 9. Precios de las minibodegas

Las tarjetas **no muestran valores**: en lugar del precio dicen "Consulta el valor"
y derivan a cotización. Los tres selectores (hero, contacto y modal) listan sólo la
superficie — 7 m², 14 m², 28 m² — sin UF.

Si más adelante quieren publicar los valores, hay que tocar tres lugares en la
sección `#minibodegas`: el bloque `<p class="mt-6 text-2xl ...">Consulta el valor</p>`
de cada una de las tres tarjetas, y la nota al pie de la sección.

---

## 10. Detalles incluidos

- **Mobile-first**: navbar hamburguesa, tarjetas apiladas, modal a pantalla completa en móvil.
- **Accesibilidad**: HTML semántico, `aria-*` en menú y modal, foco atrapado dentro del modal, cierre con `Esc`, salto al contenido, foco visible, respeta `prefers-reduced-motion`.
- **SEO**: meta description, Open Graph, `canonical` y datos estructurados JSON-LD (`SelfStorage`) con la dirección real para búsqueda local.
- **Conversión**: CTA amarillo fijo en el navbar, botón flotante de WhatsApp, plan de 14 m² destacado como "Más solicitada", CTA en cada sección y formulario express en el hero.

---

## 11. Producción (opcional)

El Tailwind por CDN es cómodo para iterar, pero descarga el runtime completo y
muestra un aviso en la consola. Para publicar, compila el CSS:

```bash
npx tailwindcss -i ./src/input.css -o ./dist/styles.css --minify
```

Luego reemplaza `<script src="https://cdn.tailwindcss.com"></script>` y el bloque
`tailwind.config` por `<link rel="stylesheet" href="dist/styles.css">`, moviendo
la configuración de colores a un `tailwind.config.js`.

---

## 11. Publicación: GitHub + Vercel

El proyecto ya es un repositorio git (rama `main`) con el primer commit hecho.
Para publicarlo:

**1. Crear el repositorio en GitHub.** Entra a [github.com/new](https://github.com/new),
ponle un nombre (por ejemplo `chilespacios-landing`) y créalo **vacío**: sin
README, sin `.gitignore` y sin licencia, porque el proyecto ya los trae.

**2. Subir el código.** Desde esta carpeta, con la dirección que te muestra GitHub:

```bash
git remote add origin https://github.com/TU-USUARIO/chilespacios-landing.git
git push -u origin main
```

La primera vez, Windows abrirá una ventana para iniciar sesión en GitHub.

**3. Conectar con Vercel.** En [vercel.com/new](https://vercel.com/new) elige
"Import Git Repository", selecciona el repositorio y pulsa **Deploy**. No hay
que configurar nada: es un sitio estático y Vercel lo detecta solo.

**Desde ahí, cada cambio se publica solo:** basta con hacer commit y `git push`,
y Vercel actualiza la página en menos de un minuto.
