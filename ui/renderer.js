const urlInput = document.getElementById('urlInput');
const tagsContainer = document.getElementById('tagsContainer');
const formatSelect = document.getElementById('formatSelect');
const resSelect = document.getElementById('resSelect');
const resGroup = document.getElementById('resGroup');
const forceRedownload = document.getElementById('forceRedownload');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const downloadBtn = document.getElementById('downloadBtn');
const cancelBtn = document.getElementById('cancelBtn');
const logOutput = document.getElementById('logOutput');
const statusDot = document.querySelector('.status-dot');
const themeToggle = document.getElementById('themeToggle');
const processTimer = document.getElementById('processTimer');

let urlList = [];
let timerInterval;
let startTime;

// Funciones del Cronómetro
function startTimer() {
    clearInterval(timerInterval);
    processTimer.style.display = 'inline';
    processTimer.textContent = '00:00';
    startTime = Date.now();
    
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        processTimer.textContent = `${mins}:${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Función para mostrar Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = type === 'success' ? '✅' : '⚠️';
    toast.innerHTML = `<span style="font-size: 16px;">${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// Renderizar Tags
function renderTags() {
    // Eliminar todos los tags actuales
    document.querySelectorAll('.tag').forEach(tag => tag.remove());
    
    // Insertar antes del input
    urlList.forEach((url, index) => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            <span>${url.length > 40 ? url.substring(0, 40) + '...' : url}</span>
            <div class="close-btn" data-index="${index}">✕</div>
        `;
        tagsContainer.insertBefore(tag, urlInput);
    });

    // Añadir event listeners a los botones de cerrar
    document.querySelectorAll('.tag .close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            urlList.splice(idx, 1);
            renderTags();
        });
    });
}

// Procesar texto para extraer URLs
function processUrls(text) {
    const newUrls = text.split(/[\n,\s]+/)
        .map(line => line.trim())
        .filter(line => line.startsWith('http') && !urlList.includes(line));
    
    if (newUrls.length > 0) {
        urlList = [...urlList, ...newUrls];
        renderTags();
        urlInput.value = '';
    }
}

// Eventos del Input de Tags
urlInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    processUrls(pastedText);
});

urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        processUrls(urlInput.value);
    }
});

// Focus en el contenedor enfoca el input
tagsContainer.addEventListener('click', () => {
    urlInput.focus();
});

// Mostrar/Ocultar resolución si es audio
formatSelect.addEventListener('change', (e) => {
    if (e.target.value === 'audio') {
        resGroup.style.opacity = '0.3';
        resSelect.disabled = true;
    } else {
        resGroup.style.opacity = '1';
        resSelect.disabled = false;
    }
});

// Funciones de utilidad
function appendLog(text) {
    if (text.trim() === '') return;
    
    // Separar por líneas (yt-dlp manda \r y \n mezclados)
    const lines = text.split(/\r|\n/).filter(l => l.trim() !== '');
    
    for (let line of lines) {
        // Ocultar warnings técnicos innecesarios para el usuario
        if (line.includes('WARNING:') || line.includes('No supported JavaScript runtime')) continue;
        
        // Detectar si es una línea de porcentaje de progreso
        const isProgress = line.includes('% de') || line.includes('% of') || line.match(/\d+\.\d+%/);
        const lastChild = logOutput.lastElementChild;
        
        // Si la línea actual es progreso, y la última también lo era, la sobreescribimos
        if (isProgress && lastChild && lastChild.dataset.progress === 'true') {
            lastChild.textContent = line.trim();
        } else {
            // Sino, creamos una línea nueva limpia
            const div = document.createElement('div');
            div.textContent = line.trim();
            if (isProgress) div.dataset.progress = 'true';
            logOutput.appendChild(div);
        }
    }
    
    setTimeout(() => {
        logOutput.scrollTop = logOutput.scrollHeight;
    }, 10);
}

// Inicializar y manejar cambio de tema
const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)');
const savedTheme = localStorage.getItem('theme');

function applyTheme(isLight) {
    if (isLight) {
        document.body.classList.add('light-theme');
        themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('light-theme');
        themeToggle.textContent = '🌙';
    }
}

// Carga inicial: Prioriza guardado, luego sistema
if (savedTheme === 'light' || (savedTheme === null && systemPrefersLight.matches)) {
    applyTheme(true);
} else {
    applyTheme(false);
}

// Escuchar cambios en vivo del sistema operativo (solo si el usuario no forzó uno manualmente)
systemPrefersLight.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches);
    }
});

themeToggle.addEventListener('click', () => {
    const isLightNow = !document.body.classList.contains('light-theme');
    applyTheme(isLightNow);
    localStorage.setItem('theme', isLightNow ? 'light' : 'dark');
});

// Limpiar historial
clearHistoryBtn.addEventListener('click', async () => {
    clearHistoryBtn.disabled = true;
    const success = await window.electronAPI.clearHistory();
    
    if (success) {
        showToast('Historial limpiado correctamente', 'success');
        appendLog('🗑️ El archivo de historial ha sido eliminado.');
    } else {
        showToast('Error al limpiar el historial', 'error');
    }
    clearHistoryBtn.disabled = false;
});

// Iniciar descarga
downloadBtn.addEventListener('click', async () => {
    // Procesar si hay algo escrito que no le dieron Enter
    if (urlInput.value.trim().startsWith('http')) {
        processUrls(urlInput.value);
    }
    
    if (urlList.length === 0) {
        logOutput.innerHTML = '';
        appendLog('⚠️ Por favor, ingresa al menos una URL.');
        showToast('Debes agregar al menos una URL válida.', 'error');
        return;
    }

    // Pedir carpeta de destino
    const outputFolder = await window.electronAPI.selectDirectory();
    if (!outputFolder) {
        // El usuario canceló la selección de carpeta
        return;
    }

    // Cambiar UI a modo cargando
    downloadBtn.style.display = 'none';
    cancelBtn.style.display = 'flex';
    cancelBtn.innerHTML = '<span>🛑 Cancelar Descarga</span>';
    cancelBtn.disabled = false;
    statusDot.classList.add('active');
    logOutput.innerHTML = '';
    appendLog(`Carpeta de destino: ${outputFolder}`);
    appendLog(`Iniciando proceso de descarga para ${urlList.length} enlace(s)...`);

    // Filtro anti-playlists infinitas (Quita parámetros de lista si es un video)
    const cleanUrls = urlList.map(u => {
        try {
            const urlObj = new URL(u);
            if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
                urlObj.searchParams.delete('list');
                urlObj.searchParams.delete('index');
                urlObj.searchParams.delete('start_radio');
                return urlObj.toString();
            }
            return u;
        } catch(e) { return u; }
    });

    // Reiniciar y arrancar el cronómetro
    startTimer();

    const options = {
        urls: cleanUrls,
        soloAudio: formatSelect.value === 'audio',
        resolucion: resSelect.value,
        outputFolder: outputFolder,
        forceRedownload: forceRedownload.checked
    };

    // Enviar instrucción al proceso principal de Electron
    window.electronAPI.startDownload(options);
});

// Cancelar descarga
cancelBtn.addEventListener('click', () => {
    cancelBtn.disabled = true;
    cancelBtn.innerHTML = '<span>⏳ Cancelando...</span>';
    window.electronAPI.cancelDownload();
});

// Escuchar progreso desde yt-dlp
window.electronAPI.onDownloadProgress((event, data) => {
    let text = data.toString().trim();
    
    // Traducciones comunes sobre la marcha de las salidas en inglés de yt-dlp
    text = text.replace(/\[download\]/gi, '[Descargando]')
               .replace(/\[ExtractAudio\]/gi, '[Procesando Audio]')
               .replace(/\[Merger\]/gi, '[Ensamblando Video]')
               .replace(/Destination:/gi, 'Destino:')
               .replace(/of/g, 'de')
               .replace(/at/g, 'a')
               .replace(/ETA/g, 'Tiempo est.:')
               .replace(/Deleting original file/gi, 'Borrando archivo temporal')
               .replace(/Downloading video/gi, 'Obteniendo video')
               .replace(/Downloading playlist:/gi, 'Descargando lista:')
               .replace(/Finished downloading playlist:/gi, 'Lista completada:')
               .replace(/Downloading item/gi, 'Descargando elemento')
               .replace(/has already been downloaded/gi, 'ya fue descargado previamente.')
               .replace(/has already been recorded in the archive/gi, 'ya está registrado en el historial y fue omitido.');
    
    appendLog(text);
});

// Escuchar cuando termina
window.electronAPI.onDownloadComplete((event, code) => {
    downloadBtn.style.display = 'flex';
    cancelBtn.style.display = 'none';
    downloadBtn.classList.remove('loading');
    downloadBtn.disabled = false;
    statusDot.classList.remove('active');
    
    stopTimer();
    
    if (code === 0) {
        appendLog('\n✅ ¡Descarga finalizada con éxito!');
        showToast('¡Descarga finalizada con éxito!', 'success');
        urlInput.value = '';
        renderTags(); // Actualizar UI
    } else if (code === -1) {
        processTimer.style.display = 'none';
        appendLog(`❌ Descarga cancelada.`);
        showToast('Descarga cancelada', 'error');
    } else {
        processTimer.style.display = 'none';
        appendLog(`❌ La descarga terminó con errores.`);
        showToast('Error en la descarga', 'error');
    }
});
