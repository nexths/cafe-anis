let transicaoAtiva = false;

// Detecta se o usuário está acessando por um celular
const isMobileDevice = window.innerWidth < 768;

// O Photo Sphere Viewer nasce sozinho para performar o Little Planet
const planetViewer = new PhotoSphereViewer.Viewer({
    container: 'planet-view',
    panorama: 'assets/pano1.webp',
    navbar: false,
    mousewheel: false,
    touchmoveTwoFingers: false,
    defaultPitch: -Math.PI / 2,
    defaultYaw: 2.72,
    
    // Abre a restrição do componente no celular para permitir um Zoom Out maior
    maxFov: isMobileDevice ? 150 : 140, 
    
    // Configura o planeta para começar menor/afastado no celular, mantendo o padrão no PC
    defaultZoomLvl: isMobileDevice ? 0 : 0, 
    
    fisheye: 2
});

const playButton = document.getElementById('playButton');

playButton.addEventListener('click', () => {
    playButton.classList.add('fade-out');

    setTimeout(() => {
        playButton.style.display = 'none';
    }, 300);

    const duration = 4000;
    const start = performance.now();
    
    // Controla o zoom máximo do planeta dinamicamente para criar um efeito de aproximação mais fluida, especialmente no celular onde o limite é maior
    const limiteZoom = window.innerWidth < 768 ? 35 : 55;

    function animate(now) {
        let progress = (now - start) / duration;
        if (progress > 1) progress = 1;

        const ease = 1 - Math.pow(1 - progress, 4);

        const fisheyeValue = 2 - (ease * 2);
        planetViewer.setOption('fisheye', fisheyeValue);

        const pitchValue = (-Math.PI / 2) + (ease * (Math.PI / 2));
        planetViewer.rotate({ pitch: pitchValue, yaw: 2.72 });

        // Calcula dinamicamente o zoom partindo do ponto inicial afastado até o seu destino original
        const zoomInicial = window.innerWidth < 768 ? 0 : 0;
        const zoomValue = zoomInicial + (ease * (limiteZoom - zoomInicial));
        planetViewer.zoom(zoomValue);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            trocarParaPannellum();
        }
    }

    requestAnimationFrame(animate);
});

function trocarParaPannellum() {
    const planet = document.getElementById('planet-view');
    const pano = document.getElementById('panorama');

    // Acorda o Pannellum por trás enquanto o container do PSV ainda está aceso (Overlap)
    pano.style.display = 'block';

    iniciarTour();

    // Executa o seu crossfade excelente de opacidade
    setTimeout(() => {
        planet.style.opacity = '0'; // Esconde o planeta de forma suave revelando o Pannellum pronto

        // EXTERMÍNIO DE MEMÓRIA E CACHE GRÁFICO DO THREE.JS/PSV
        setTimeout(() => {
            if (planetViewer) {
                planetViewer.destroy(); // Mata instâncias do WebGL purificando a RAM
                planet.innerHTML = '';  // Remove qualquer resquício de lixo do HTML
                planet.style.display = 'none';
                console.log("Photo Sphere Viewer destruído por completo das memórias e processador.");
            }
        }, 400); // Aguarda o fim completo do fade de 0.4s do CSS
    }, 150);
}

function iniciarTour() {
    const isMobile = window.innerWidth < 768;
    const fovInicial = isMobile ? 74.2 : 120.5;

    window.viewer = pannellum.viewer('panorama', {
        "default": {
            "firstScene": "entrada",
            "author": "Café Anis",
            "sceneFadeDuration": 1000,
            "autoLoad": true,
            "autoRotate": -2,
            "hfov": fovInicial,
            "maxHfov": isMobile ? 90 : 125
        },

        "scenes": {
            "entrada": {
                "panorama": "assets/pano1.webp",
                "pitch": 0,
                "yaw": 0,
                "hotSpots": [
                    {
                        "pitch": -5,
                        "yaw": 10,
                        "type": "info",
                        "cssClass": "hotspot-pulse",
                        "clickHandlerFunc": function () {
                            irPara('loja', 10, 0, 30);
                        }
                    }
                ]
            },

            "loja": {
                "panorama": "assets/pano2.webp",
                "hotSpots": [
                    {
                        "pitch": -10,
                        "yaw": 15,
                        "type": "info",
                        "cssClass": "hotspot-pulse",
                        "clickHandlerFunc": function () {
                            irPara('laboratorio', 15, 0, 0);
                        }
                    },
                    {
                        "pitch": -10,
                        "yaw": -155,
                        "type": "info",
                        "cssClass": "hotspot-pulse",
                        "clickHandlerFunc": function () {
                            irPara('entrada', -155, 0, -155);
                        }
                    }
                ]
            },

            "laboratorio": {
                "panorama": "assets/pano3.webp",
                "hotSpots": [
                    {
                        "pitch": -10,
                        "yaw": -188,
                        "type": "info",
                        "cssClass": "hotspot-pulse",
                        "clickHandlerFunc": function () {
                            irPara('loja', -188, 0, -170);
                        }
                    }
                ]
            }
        }
    });

    // =========================================================================
    // O SEU PRELOAD DE UMA EM UMA (SOB DEMANDA)
    // =========================================================================
    const cacheImagensGatilho = {};

    function baixarImagemUnica(caminho) {
        if (cacheImagensGatilho[caminho]) return; // Se já foi baixada antes, ignora
        
        const img = new Image();
        img.src = caminho;
        img.onload = () => {
            cacheImagensGatilho[caminho] = true; // Registra que o download terminou
            console.log(`Preload cirúrgico concluído: ${caminho}`);
        };
    }

    // Ouvinte do Pannellum: Dispara toda vez que uma cena termina de carregar na tela
    window.viewer.on('load', function () {
        const cenaAtual = window.viewer.getScene();
        console.log(`Usuário entrou na cena: ${cenaAtual}`);

        // REGRAS DE GATILHO: Baixa apenas a próxima imagem conectada
        if (cenaAtual === "entrada") {
            baixarImagemUnica("assets/pano2.webp"); // Baixa só a loja
            
          //  if (isMobile) {
          //      window.viewer.setHfov(76);
          //  }
        } 
        else if (cenaAtual === "loja") {
            baixarImagemUnica("assets/pano3.webp"); // Baixa só o laboratório
        }
        else if (cenaAtual === "laboratorio") {
            baixarImagemUnica("assets/pano2.webp"); // Baixa a entrada caso queira voltar
        }
    });
}

function irPara(cena, yawClick, pDestino, yDestino) {
    if (transicaoAtiva) return;
    transicaoAtiva = true;

    const pano = document.getElementById('panorama');
    const fovPadrao = window.innerWidth < 768 ? 80 : 110;

    window.viewer.stopAutoRotate();

    const isMobile = window.innerWidth < 768;
    const zoomInDinamico = isMobile ? 55 : 80;

    window.viewer.lookAt(0, yawClick, zoomInDinamico, 1000);

    pano.style.filter = 'blur(7px) grayscale(20%)';

    setTimeout(function () {
        const isMobile = window.innerWidth < 768;
        const fovDestino = cena === "entrada" ? (isMobile ? 75 : 110) : fovPadrao;

        window.viewer.loadScene(cena, pDestino, yDestino, fovDestino);

        pano.style.filter = 'blur(0px) grayscale(0%)';
        window.viewer.startAutoRotate(-2);

        setTimeout(function () {
            transicaoAtiva = false;
        }, 500);

    }, 1200);
}

// Força o redimensionamento matemático do container sem saltos caso giren a tela
window.addEventListener('resize', () => {
    if (window.viewer) {
        window.viewer.resize();
    }
});