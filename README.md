# Descargador Masivo de Canales

Este script te permite descargar de forma masiva videos (como YouTube Shorts o videos regulares) desde múltiples enlaces al mismo tiempo. Además, guarda un registro de los videos que ya has descargado para que, si cancelas el proceso y lo vuelves a iniciar, **no descargue videos repetidos**.

## 🛠️ Requisitos Previos

Antes de empezar, necesitas tener instalados estos programas en tu computadora (Windows):

1. **Node.js**: [Descárgalo aquí](https://nodejs.org/) e instálalo (la opción "LTS" recomendada para la mayoría de los usuarios). Sirve para poder ejecutar el código del script.
2. **Los archivos `yt-dlp.exe` y `ffmpeg.exe`**: Deben estar en esta misma carpeta (ya deberían estar ahí). Son las herramientas internas que usa el programa para descargar los videos y juntarlos con el audio.

---

## ⚙️ Paso 1: Configuración

En esta carpeta encontrarás un archivo llamado **`.env`**. Ábrelo con el Bloc de notas (o cualquier editor de texto). Este archivo controla cómo funciona el programa:

- `LISTA_ENLACES=dowload-movies.txt` 👉 Es el nombre del archivo donde pondrás los links.
- `CARPETA_DESTINO=descargas` 👉 El nombre de la carpeta donde se guardarán los videos. (Se creará automáticamente).
- `MAX_VIDEOS_POR_ENLACE=` 👉 Si quieres poner un límite (útil para canales o playlists), escribe un número ahí (ejemplo: `MAX_VIDEOS_POR_ENLACE=10`). Si lo dejas en blanco, descargará TODO.
- `RESOLUCION_MAXIMA=1080` 👉 El límite de calidad de video. Puedes subirlo a `2160` para tener **4K**, o bajarlo a `720` o `480` si no quieres archivos tan pesados. Todo el código interno ("y demás cosas") ya se arma solito para asegurarte la máxima calidad dentro de ese límite.
- `SOLO_AUDIO=false` 👉 De base está en `false` para descargar los **videos en MP4**. Si quieres descargar **SOLO AUDIO (Música o podcasts) en MP3**, cámbialo a `SOLO_AUDIO=true`.

---

## 📝 Paso 2: Agregar los enlaces

Abre el archivo de texto **`dowload-movies.txt`** y pega los links de lo que quieras descargar. La gran ventaja es que soporta **cualquier tipo de enlace**:
- Enlace a un **Video individual**
- Enlace a un **Short / Reel**
- Enlace a un **Canal completo**
- Enlace a una **Lista de reproducción (Playlist)**

**Reglas importantes:**
- Escribe **un enlace por línea**.
- No pongas comas ni nada extra.
- Ejemplo válido:
  ```text
  https://www.youtube.com/watch?v=EjemploDeVideo123
  https://www.youtube.com/@CanalDeEjemplo/shorts
  ```

---

## 🚀 Paso 3: Ejecutar el programa

1. Abre esta carpeta en tu computadora.
2. Da clic en la barra de direcciones de arriba (donde dice la ruta de la carpeta, por ejemplo `D:\Proyectos\video-downloader`).
3. Borra lo que dice ahí, escribe **`cmd`** y presiona la tecla **Enter**. (Esto abrirá una ventana negra de comandos en esa carpeta).
4. En la ventana negra que se abrió, escribe primero este comando para asegurarte de tener la configuración lista (solo la primera vez):
   ```bash
   npm install
   ```
5. Luego, para iniciar las descargas, escribe el siguiente comando y presiona **Enter**:
   ```bash
   node descargar-canales.js
   ```

¡Y listo! 🎉 El programa te irá mostrando en pantalla el progreso de descarga. Todos los videos irán apareciendo en la carpeta **`descargas`**.

---

### 💡 Preguntas Frecuentes

- **¿Qué pasa si se me va el internet o cierro la ventana negra?**
  No pasa nada. Vuelve a ejecutar el comando `node descargar-canales.js` y el programa se saltará automáticamente los videos que ya descargó gracias al archivo `descargas_completadas.txt`.

- **¿Puedo descargar solo música en formato MP3?**
  ¡Sí! Solo ve al archivo `.env` y cambia la línea `SOLO_AUDIO=false` por `SOLO_AUDIO=true`. Esto ignorará el video y extraerá exclusivamente el audio de altísima calidad en `.mp3`.

- **¿Cómo borro el historial para que vuelva a descargar todo?**
  Simplemente elimina el archivo `descargas_completadas.txt` de esta carpeta.
