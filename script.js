// ==========================================
// 1. LÓGICA DO CARROSSEL DE FOTOS (ESTÁTICAS)
// ==========================================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function nextSlide() {
    if (slides.length === 0) return;
    
    // Esconde o slide atual
    slides[currentSlide].classList.remove('active');
    
    // Calcula o próximo índice (volta ao 0 se chegar no fim)
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Mostra o novo slide
    slides[currentSlide].classList.add('active');
}

// Inicia a transição automática a cada 4 segundos se houver slides
if (slides.length > 0) {
    setInterval(nextSlide, 4000);
}


// ==========================================
// 2. LÓGICA DO TOUR VIRTUAL 360 (PANNELLUM)
// ==========================================
function toggleHotspot(hotspotDiv, args) {
    const tooltip = document.getElementById('cardapio-tooltip');
    
    tooltip.style.left = hotspotDiv.offsetLeft + 'px';
    tooltip.style.top = hotspotDiv.offsetTop + 'px';
    tooltip.classList.toggle('active');
}

// AJUSTE DE FOV: Se for celular (tela <= 768px), o FOV inicial fica em 70 (mais próximo)
const fovDinamico = (window.innerWidth <= 768) ? 70 : 100;

// Inicializa o visualizador Pannellum
pannellum.viewer('panorama-container', {
    "type": "equirectangular",
    "panorama": "./assets/pano/foto1.jpeg",
    "autoLoad": true,
    "compass": false,
    "hfov": fovDinamico,
    "minHfov": 50,  // Limite máximo de zoom in
    "maxHfov": 120, // Limite máximo de zoom out para evitar distorções
    "hotSpots": [
        {
            "pitch": 0,
            "yaw": 0,
            "type": "custom",
            "cssClass": "pnm-hotspot pnm-info",
            "clickHandlerFunc": toggleHotspot
        }
    ]
});


// ==========================================
// 3. EVENTOS PARA FECHAR O TOOLTIP
// ==========================================
const panoramaContainer = document.getElementById('panorama-container');
const cardapioTooltip = document.getElementById('cardapio-tooltip');

if (panoramaContainer && cardapioTooltip) {
    // Fecha o tooltip ao arrastar com o mouse (Desktop)
    panoramaContainer.addEventListener('mousedown', function () {
        cardapioTooltip.classList.remove('active');
    });

    // Fecha o tooltip ao arrastar/tocar com o dedo (Mobile)
    panoramaContainer.addEventListener('touchstart', function () {
        cardapioTooltip.classList.remove('active');
    });
}