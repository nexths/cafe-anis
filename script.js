// ==========================================
// 1. CARROSSEL
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
// 2. CONFIGURAÇÃO DAS CENAS
// ==========================================
const scenes = {

    fachada: {

        panorama: './assets/pano/foto1.jpg',

        startYaw: 0,

        hotspots: [
            {
                pitch: -0.1,
                yaw: -0.07,
                target: 'mesas'
            }
        ]

    },

    mesas: {

        panorama: './assets/pano/foto2.jpg',

        // AJUSTE FINO AQUI
        startYaw: 3.35,

        hotspots: [
            {
                pitch: -0.1,
                yaw: 3.35,
                target: 'fachada'
            },

            {
                pitch: -0.2,
                yaw: -1.57,
                target: 'esquerda'
            }
        ]

    },

    esquerda: {

        panorama: './assets/pano/foto3.jpg',

        // AJUSTE FINO AQUI
        startYaw: 0.8,

        hotspots: [
            {
                pitch: -0.2,
                yaw: 0.8,
                target: 'mesas'
            }
        ]

    }

};
Object.values(scenes).forEach(scene => {

    const img = new Image();

    img.src = scene.panorama;

});

// ==========================================
// 3. VIEWER
// ==========================================
const viewer = new PhotoSphereViewer.Viewer({

    container: document.querySelector('#panorama-container'),

    panorama: './assets/pano/foto1.jpg',

    navbar: [
        'fullscreen'
    ],

    moveInertia: true,

    mousewheel: false,

    fisheye: 2,

    defaultZoomLvl: 0,

    defaultPitch: -Math.PI / 2,

    defaultYaw: 0,

    plugins: [
        [PhotoSphereViewer.MarkersPlugin, {}]
    ]

});

// ==========================================
// 4. HOTSPOTS
// ==========================================
function criarHotspots(scene) {

    const markers =
        viewer.getPlugin(
            PhotoSphereViewer.MarkersPlugin
        );

    if (!markers) return;

    markers.clearMarkers();

    scene.hotspots.forEach((hotspot, index) => {

        markers.addMarker({

            id: 'hotspot-' + index,

            position: {
                yaw: hotspot.yaw,
                pitch: hotspot.pitch
            },

            html:
                '<div class="custom-hotspot"></div>',

            anchor: 'center center'

        });

        setTimeout(() => {

            const marker =
                markers.getMarker(
                    'hotspot-' + index
                );

            if (
                marker &&
                marker.domElement
            ) {

                marker.domElement.addEventListener('pointerup', (e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 trocarCena(hotspot);
});
            }

        }, 50);

    });

}

// ==========================================
// 5. TRANSIÇÃO SUAVE
// ==========================================
function trocarCena(hotspot) {

    const cenaNova =
        scenes[hotspot.target];

    const container =
        document.getElementById(
            'panorama-container'
        );

    if (viewer.isTransitioning) return;

    viewer.isTransitioning = true;

    // blur suave
    container.style.transition =
        'filter 1.2s ease';

    container.style.filter =
        'blur(6px)';

    // pega zoom atual
    let zoomAtual = viewer.getZoomLevel();

    // anima zoom IN suavemente
    const zoomIn = setInterval(() => {

        zoomAtual += 1;

        viewer.zoom(zoomAtual);

        if (zoomAtual >= 70) {

            clearInterval(zoomIn);

        }

    }, 16);

    // espera animação
    setTimeout(() => {

        viewer.setPanorama(

            cenaNova.panorama,

            {

                transition: false,

                position: {

                    yaw: cenaNova.startYaw,

                    pitch: 0

                }

            }

        )

        .then(() => {

            criarHotspots(cenaNova);

            // remove blur
            container.style.filter =
                'blur(0px)';

            // zoom OUT suave
            viewer.zoom(50);

        })

        .finally(() => {

            viewer.isTransitioning = false;

        });

    }, 950);

}

// ==========================================
// 6. INTRO CINEMATOGRÁFICA
// ==========================================
const overlay =
    document.getElementById(
        'tour-overlay'
    );

const playButton =
    document.getElementById(
        'playButton'
    );

playButton.addEventListener(
    'click',
    () => {

        overlay.style.opacity = '0';

        setTimeout(() => {

            overlay.style.display = 'none';

        }, 1000);

        const duration = 4000;

        const start =
            performance.now();

        function efeitoVideo(now) {

            let progress =
                (now - start) / duration;

            if (progress > 1) {
                progress = 1;
            }

            const ease =
                1 - Math.pow(
                    1 - progress,
                    4
                );

            // remove little planet
            viewer.setOption(

                'fisheye',

                2 - (ease * 2)

            );

            // sobe câmera
            viewer.rotate({

                pitch:
                    (-Math.PI / 2) +
                    (
                        ease *
                        (Math.PI / 2)
                    ),

                yaw: 0

            });

            // zoom suave
            viewer.zoom(ease * 50);

            if (progress < 1) {

                requestAnimationFrame(
                    efeitoVideo
                );

            } else {

                criarHotspots(
                    scenes.fachada
                );

            }

        }

        requestAnimationFrame(
            efeitoVideo
        );

    }
);