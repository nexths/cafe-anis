// ==========================================
// 1. CARROSSEL DE FOTOS
// ==========================================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function nextSlide() {
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

if (slides.length > 0) {
    setInterval(nextSlide, 4000);
}


// ==========================================
// 2. CONTROLE DO TOUR HÍBRIDO (PSV + PANNELUM)
// ==========================================
let transicaoAtiva = false;
let planetViewer = null;

// Aguarda o HTML carregar 100% para evitar que o PSV quebre ao ler o container
document.addEventListener("DOMContentLoaded", () => {
    
    // Inicializa a visão "Little Planet" usando o Photo Sphere Viewer
    planetViewer = new PhotoSphereViewer.Viewer({
        container: 'planet-view',
        panorama: './assets/pano/foto1.jpg', // Imagem inicial (Fachada)
        navbar: false,
        mousewheel: false,
        touchmoveTwoFingers: false,
        defaultPitch: -Math.PI / 2, // Olhando totalmente para baixo
        defaultYaw: 0,
        defaultZoomLvl: 0,
        fisheye: 2 // Força o efeito esférico de planeta
    });

    const playButton = document.getElementById('playButton');

    // Dispara a animação de introdução ao clicar no Play
    if (playButton) {
        playButton.addEventListener('click', () => {
            
            // Suaviza o sumiço do botão
            playButton.style.opacity = '0';
            playButton.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                document.getElementById('tour-overlay').style.display = 'none';
            }, 300);

            const duration = 4000; // Tempo da animação (4 segundos)
            const start = performance.now();
            const limiteZoom = window.innerWidth < 768 ? 16.6 : 50;

            // Trava para garantir que o Pannellum só seja chamado UMA vez no fundo
            let pannellumPreCarregado = false;

            function animate(now) {
                let progress = (now - start) / duration;
                if (progress > 1) progress = 1;

                // Efeito de acaleração suave (Cubic Ease-Out)
                const ease = 1 - Math.pow(1 - progress, 4);

                // Abre o ângulo da lente tirando o olho de peixe
                const fisheyeValue = 2 - (ease * 2);
                if (planetViewer) planetViewer.setOption('fisheye', fisheyeValue);

                // Levanta a cabeça da câmera para o horizonte
                const pitchValue = (-Math.PI / 2) + (ease * (Math.PI / 2));
                if (planetViewer) planetViewer.rotate({ pitch: pitchValue, yaw: 0 });

                // Aplica o zoom de aproximação
                const zoomValue = ease * limiteZoom;
                if (planetViewer) planetViewer.zoom(zoomValue);

                // ============================================================
                // PRÉ-CARREGAMENTO EM SEGUNDO PLANO (AOS 85% DA ANIMAÇÃO)
                // Lança o Pannellum por baixo enquanto a câmera ainda se mexe
                // ============================================================
                if (progress >= 0.85 && !pannellumPreCarregado) {
                    pannellumPreCarregado = true;
                    
                    const pano = document.getElementById('panorama');
                    pano.style.display = 'block';
                    pano.style.opacity = '0'; // Invisível por enquanto
                    
                    iniciarTourPannellum(); // Liga o motor do Pannellum em background
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // CÓDIGO NOVO: Quando chega em 100%, faz a fusão direta e limpa a memória
                    const planet = document.getElementById('planet-view');
                    const pano = document.getElementById('panorama');

                    pano.style.transition = 'opacity 0.4s ease';
                    if (planet) planet.style.transition = 'opacity 0.4s ease';

                    requestAnimationFrame(() => {
                        pano.style.opacity = '1';  // Mostra o Pannellum que já estava carregado
                        if (planet) planet.style.opacity = '0'; // Some o Little Planet

                        // Limpa o motor antigo da memória após o fade acabar
                        setTimeout(() => {
                            if (planetViewer) {
                                planetViewer.destroy();
                                planetViewer = null;
                            }
                            if (planet) {
                                planet.innerHTML = '';
                                planet.style.display = 'none';
                            }
                        }, 400);
                    });
                }
            }

            requestAnimationFrame(animate);
        });
    }
});


// ==========================================
// 3. ESTRUTURA DE CENAS DO PANNELUM
// ==========================================
function iniciarTourPannellum() {
    const isMobile = window.innerWidth < 768;
    const fovInicial = isMobile ? 88 : 101.75;

    window.viewer = pannellum.viewer('panorama', {
        "default": {
            "firstScene": "fachada",            
            "sceneFadeDuration": 1000,
            "autoLoad": true,
            "autoRotate": -2, // Inicia girando devagar para a esquerda
            "hfov": fovInicial,
            "compass": false,
            "showCompass": false,
            "showFullscreenCtrl": false,
            "showZoomCtrl": false,
            "orientationOnMove": false
        },

        "scenes": {
            "fachada": {
                "panorama": "./assets/pano/foto1.jpg",
                "pitch": 0,
                "yaw": -41.83,
                "hotSpots": [
                    {
                        "pitch": -5,
                        "yaw": -43,
                        "type": "info",
                        "cssClass": "hotspot-pulse",
                        "clickHandlerFunc": function () {
                            irPara('mesas', -43, 0, 50);
                        }
                    }
                ]
            },

            "mesas": {
                "panorama": "./assets/pano/foto2.jpg",
                "hotSpots": [
                    {
                        "pitch": -10,
                        "yaw": -67,
                        "type": "info",
                        "cssClass": "hotspot-pulse",
                        "clickHandlerFunc": function () {
                            irPara('esquerda', -67, 0, -120);
                        }
                    },
                    {
                        "pitch": -10,
                        "yaw": -133,
                        "type": "info",
                        "cssClass": "hotspot-pulse",
                        "clickHandlerFunc": function () {
                            irPara('fachada', -135, 0, 150);
                        }
                    }
                ]
            },

            "esquerda": {
                "panorama": "./assets/pano/foto3.jpg",
                "hotSpots": [
                    {
                        "pitch": -10,
                        "yaw": 50,
                        "type": "info",
                        "cssClass": "hotspot-pulse",
                        "clickHandlerFunc": function () {
                            irPara('mesas', 50, -10, 115);
                        }
                    }
                ]
            }
        }
    });

    // TRAVA DE SEGURANÇA VISUAL COM RECUO SUAVE ATIVADO PARA O MOBILE
    window.viewer.on('scenechange', function() {
        const pano = document.getElementById('panorama');
        const isMobile = window.innerWidth < 768;
        
        // Se for celular, faz o recuo deslizando de mansinho (1.2s) para tirar o tranco do "pulo"
        if (isMobile) {
            const yawAtual = window.viewer.getYaw();
            window.viewer.lookAt(0, yawAtual, 88, 1200);
        }
        
        setTimeout(function() {
            // Faz o blur sumir progressivamente acompanhando o fim do afastamento
            pano.style.transition = 'filter 0.6s ease-in-out'; 
            pano.style.filter = 'blur(0px) grayscale(0%)';
            
            window.viewer.startAutoRotate(-2);
            transicaoAtiva = false; 
        }, 400); 
    });
}


// ==========================================
// 4. LÓGICA DE TRANSIÇÃO COM BLUR PROGRESSIVO
// ==========================================
function irPara(cena, yawClick, pDestino, yDestino) {
    if (transicaoAtiva) return;
    transicaoAtiva = true;

    const pano = document.getElementById('panorama');
    const fovPadrao = window.innerWidth < 768 ? 80 : 110;

    window.viewer.stopAutoRotate();
    
    // 1. O Zoom começa aqui e vai levar 1100ms para chegar no fundo
    window.viewer.lookAt(0, yawClick, 55, 1100); 

    // 2. Configuramos a transição do CSS para durar exatamente os mesmos 1.1s do zoom
    pano.style.transition = 'filter 1.1s ease-out';
    
    // 3. O blur aumenta progressivamente junto com a caminhada
    pano.style.filter = 'blur(5px) grayscale(20%)';

    // 4. Quando a caminhada e o blur chegam no máximo (1100ms), o motor troca a cena
    setTimeout(function () {
        const isMobile = window.innerWidth < 768;
        const fovDestino = cena === "fachada" ? (isMobile ? 75 : 110) : fovPadrao;

        window.viewer.loadScene(cena, pDestino, yDestino, fovDestino);

    }, 1100); 
}


// ============================================================
// LÓGICA ISOLADA DO BOTÃO DE TELA CHEIA (SEM ALTERAR O TOUR)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const container = document.getElementById('panorama-container');
            
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) { /* Safari / iOS */
                    container.webkitRequestFullscreen();
                } else if (container.msRequestFullscreen) { /* IE11 */
                    container.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        });
    }
});