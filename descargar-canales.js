require('dotenv').config();
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

// Leer variables de entorno con valores por defecto en caso de no existir
const listFile = process.env.LISTA_ENLACES || process.env.LISTA_CANALES || 'dowload-movies.txt';
const archiveFile = process.env.REGISTRO_DESCARGAS || 'descargas_completadas.txt';
const outputFolderEnv = process.env.CARPETA_DESTINO || 'descargas';
const maxVideos = process.env.MAX_VIDEOS_POR_ENLACE;
const soloAudio = process.env.SOLO_AUDIO === 'true';
const ytDlpExe = process.env.YT_DLP_EJECUTABLE || 'yt-dlp.exe';
const resolucionMaxima = process.env.RESOLUCION_MAXIMA || '1080';
const formatEnv = `bestvideo[ext=mp4][height<=${resolucionMaxima}]+bestaudio[ext=m4a]/best[ext=mp4]/best`;
const mergeFormat = process.env.YT_DLP_FORMATO_SALIDA || 'mp4';
const ignoreErrors = process.env.YT_DLP_IGNORAR_ERRORES === 'true';

// Archivo que contiene la lista de enlaces
const inputFile = path.join(__dirname, listFile);

if (!fs.existsSync(inputFile)) {
    console.error(`El archivo de lista de enlaces no existe: ${listFile}`);
    process.exit(1);
}

// Leer archivo y extraer solo las líneas que empiecen con "http"
const content = fs.readFileSync(inputFile, 'utf-8');
const urls = content.split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('http'));

if (urls.length === 0) {
    console.log('No se encontraron URLs en el archivo.');
    process.exit(0);
}

console.log(`Se encontraron ${urls.length} enlaces para descargar.`);

async function downloadLink(url) {
    return new Promise((resolve) => {
        console.log(`\n======================================================`);
        console.log(`Iniciando descarga del enlace: ${url}`);
        console.log(`======================================================`);

        const ytDlpPath = path.join(__dirname, ytDlpExe);

        // Crear carpeta destino si no existe
        const outputFolder = path.join(__dirname, outputFolderEnv);
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }

        // Configuración de yt-dlp usando variables de entorno
        const args = [];

        if (soloAudio) {
            // Configuración para descargar SOLO audio en MP3
            args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
        } else {
            // Configuración normal para VIDEO (MP4)
            // Formato de video/audio y resolución
            if (formatEnv) {
                args.push('-f', formatEnv);
            }

            // Extensión del archivo final
            if (mergeFormat) {
                args.push('--merge-output-format', mergeFormat);
            }
        }

        // Ignorar errores y seguir
        if (ignoreErrors) {
            args.push('-i');
        }

        // Plantilla de salida de archivo
        args.push('-o', `${outputFolderEnv}/%(title)s.%(ext)s`);

        // Archivo de registro (archive)
        if (archiveFile) {
            args.push('--download-archive', archiveFile);
        }

        // Límite de videos
        if (maxVideos && maxVideos.trim() !== '') {
            args.push('--playlist-end', maxVideos.trim());
        }

        // La URL del canal o playlist
        args.push(url);

        const child = spawn(ytDlpPath, args, { stdio: 'inherit' });

        child.on('close', (code) => {
            if (code !== 0) {
                console.error(`Hubo un problema al descargar ${url} (código ${code})`);
            }
            resolve(); // Resolvemos de todos modos para que pase al siguiente enlace
        });
    });
}

async function run() {
    for (const url of urls) {
        await downloadLink(url);
    }
    console.log('\n======================================================');
    console.log('¡Todas las descargas masivas han finalizado con éxito!');
    console.log('======================================================');
}

run();
