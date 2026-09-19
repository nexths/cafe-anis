// ==========================================
// CARROSSEL DE FOTOS
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
    setInterval(nextSlide, 3500);
}

// ==========================================
// BOTÃO TOUR VIRTUAL
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const openTourBtn = document.getElementById('openTourBtn');

    if (openTourBtn) {
        openTourBtn.addEventListener('click', () => {

              window.open('./tour-cafe-anis/index.html', '_blank');
            
            

        });
    }
});