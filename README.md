# 🎥 Video Downloader Pro

¡Una aplicación de escritorio moderna, ultra-rápida y a prueba de balas para descargar videos y música en máxima calidad desde cientos de plataformas (YouTube, Facebook, Twitter, TikTok, etc.)!

![App Version](https://img.shields.io/badge/Versión-1.0.0-blue.svg)
![Plataforma](https://img.shields.io/badge/Plataforma-Windows-success.svg)
![Licencia](https://img.shields.io/badge/Licencia-MIT-purple.svg)

---

## ✨ Características Principales

*   **Diseño Premium e Intuitivo:** Interfaz moderna (Glassmorphism) con **Modo Claro (☀️) y Modo Oscuro (🌙)** que se sincronizan con tu sistema operativo de forma automática.
*   **Motor Inmortal (Auto-Actualizable):** Si YouTube cambia sus códigos de seguridad y bloquea una descarga, la app se da cuenta, descarga la última versión del motor de evasión en segundo plano, e intenta descargar de nuevo sin que tengas que hacer nada.
*   **Modo Tanque (Resiliencia Extrema):** Ideal para descargar horas de video. Si tu internet parpadea o se cae, el programa no abortará; hará hasta **50 reintentos automáticos** para salvar tu progreso.
*   **Historial Inteligente:** La app recuerda qué videos ya bajaste. Si pegas una lista repetida, omitirá mágicamente los videos que ya tienes para no gastar internet ni espacio.
*   **Filtro Anti-Mixes:** Detecta cuando pegas un enlace de YouTube que esconde una "Lista de Reproducción Infinita" accidental, mutilando ese código para que solo descargues el video que quieres.
*   **Cancelación Instántanea:** Un botón de cancelar que usa `taskkill` en Windows para aniquilar todo el árbol de procesos al instante. ¡Se detiene en el acto!
*   **Consola Integrada:** Mira el progreso en vivo con una barra de porcentaje inteligente que no satura tu pantalla, acompañada de un cronómetro de procesamiento.

## 🚀 Instalación y Uso (Versión Portable)

La forma recomendada de usar esta aplicación en Windows es a través de la versión **Portable** compilada. No requiere instalaciones complejas ni permisos de administrador.

📥 **[Descargar Video Downloader Pro (MediaFire)](https://www.mediafire.com/file/k9yzdj9i45frnzk/VideoDownloaderPro-Windows.zip/file)**

### Pasos:
1.  Descarga el archivo `.zip` desde el enlace de arriba.
2.  Extrae la carpeta en tu computadora (ej. en el Escritorio o Documentos).
3.  Haz doble clic en **`Video Downloader Pro.exe`** (tiene un ícono).
4.  Pega tus enlaces, elige MP4 (Video) o MP3 (Audio) y presiona **Descargar**. ¡Cero instalaciones complejas!

## 💻 Para Desarrolladores (Código Fuente)

Si quieres correr o modificar el código fuente del proyecto:

### 1. Requisitos Previos
- [Node.js](https://nodejs.org/) instalado.
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) (`yt-dlp.exe` debe estar en la carpeta raíz para Windows).
- [FFmpeg](https://ffmpeg.org/) (Opcional pero muy recomendado, para fusionar alta resolución).

### 2. Instalación Local
```bash
# Clonar o descargar este repositorio
cd video-dowloader

# Instalar dependencias de la interfaz (Electron)
npm install

# Iniciar la aplicación en modo desarrollo
npm start
```

### 3. Compilar tu propio ejecutable (.exe)
```bash
# Generará la carpeta "dist/" con el programa empaquetado y listo para usar
npx electron-packager . "Video Downloader Pro" --platform=win32 --arch=x64 --out=dist --overwrite --asar=false --ignore="^\/dist$"
```

---

## 🛠️ Archivos de Configuración Interna
Si lo necesitas, puedes crear un archivo `.env` en la raíz para configuraciones avanzadas:
```env
# Forzar resolución máxima predeterminada
RESOLUCION_MAXIMA=1080

# Ignorar errores severos y forzar continuación
YT_DLP_IGNORAR_ERRORES=true
```

## 📜 Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3 Variables, JavaScript Vanilla.
- **Backend UI:** [Electron.js](https://www.electronjs.org/).
- **Motor de Descarga:** [yt-dlp](https://github.com/yt-dlp/yt-dlp) (Operando como child_process asíncrono).

Desarrollado con pasión para garantizar descargas eternas sin bloqueos. 🚀
