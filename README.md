# PassTo

> PassTo es una web estática para descubrir y gestionar entradas a eventos. Proyecto académico desarrollado como ejercicio práctico en la materia "El Emprendedor Digital".

## Descripción

PassTo muestra eventos, permite comprar/gestionar tickets (simulado en local) y contiene páginas informativas como historial, preguntas frecuentes y soporte. Está pensada como una aplicación estática (HTML/CSS/JS) sin backend centralizado; los datos se manejan localmente para la demostración.

## Estado

- Tipo: Demo / prototipo educativo
- Funcionamiento: estático (sin base de datos ni servidor remoto)

## Tecnologías

- HTML5
- CSS3
- JavaScript (ES6)

## Características principales

- Página principal `index.html` con carrusel y búsqueda
- Páginas de eventos (`src/evento.html`, `src/mis-eventos.html`, `src/mistickets.html`)
- Preguntas frecuentes y soporte (`src/preguntas-frecuentes.html`, `src/soporte.html`)
- Separación de activos en `css/`, `js/` e `img/`

## Estructura del proyecto

- `index.html` — página de entrada (raíz)
- `src/` — páginas adicionales (eventos, historia, FAQ, soporte, etc.)
- `css/` — hojas de estilo
- `js/` — scripts JavaScript
- `img/` — imágenes y activos multimedia

Ejemplo (resumido):

```
passto/
├─ index.html
├─ src/
│  ├─ evento.html
│  ├─ historia.html
│  ├─ mistickets.html
│  └─ ...
├─ css/
├─ js/
└─ img/
```

## Ejecutar localmente

Recomendado: servir el directorio `passto/` con un servidor estático. Opciones rápidas:

- Con Python 3 (desde la carpeta `passto`):

```bash
python3 -m http.server 8000
# Abrir http://localhost:8000
```

- Usar la extensión Live Server de VS Code: abrir la carpeta `passto/` y pulsar *Go Live*.

Nota: las páginas dentro de `src/` usan rutas relativas a `index.html` en la raíz (`../index.html`) — no cambiar la estructura sin actualizar rutas.


## Autores

- Casal Naiara
- Elizondo Gabriel
- Kolarik Danilo
- Kolarik Daniela
- Srdos Silvana
