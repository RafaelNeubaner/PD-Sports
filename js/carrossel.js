const carrossel = document.querySelector('.slides_autoplay');
const carrosselwrap = document.querySelector('.carrossel-wrap');
const dots = document.querySelectorAll('.dot');
let autoplayInterval;

function iniciarAutoplay() {
    autoplayInterval = setInterval(autoplayCarrossel, 5000);
}

function resetAutoplay() {
    clearInterval(autoplayInterval);
    iniciarAutoplay();
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        atualizarCarrossel();
        resetAutoplay();
    });
});

function atualizarCarrossel() {
    const activeIndex = Array.from(dots).findIndex(dot => dot.classList.contains('active'));
    const offset = -activeIndex * 100;
    carrossel.style.transform = `translateX(${offset}%)`;
}

function autoplayCarrossel() {
    const activeIndex = Array.from(dots).findIndex(dot => dot.classList.contains('active'));
    const nextIndex = (activeIndex + 1) % dots.length;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[nextIndex].classList.add('active');
    atualizarCarrossel();
}

carrossel.addEventListener('mouseenter',() => {
    clearInterval(autoplayInterval);
});

carrossel.addEventListener('mouseleave', () => {
    iniciarAutoplay();
});

carrosselwrap.addEventListener('keydown', (event) => {
    const activeIndex = Array.from(dots).findIndex(dot => dot.classList.contains('active'));
    if (event.key === 'ArrowRight') {
        const nextIndex = (activeIndex + 1) % dots.length;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[nextIndex].classList.add('active');
        atualizarCarrossel();
        resetAutoplay();
    } else if (event.key === 'ArrowLeft') {
        const prevIndex = (activeIndex - 1 + dots.length) % dots.length;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[prevIndex].classList.add('active');
        atualizarCarrossel();
        resetAutoplay();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    dots[0].classList.add('active');
    iniciarAutoplay();
});

document.addEventListener("DOMContentLoaded", () => {
	const container = document.querySelector("#catDestaques");
	if (!container) return;

	const viewport = container.querySelector(".catDestaquesViewport");
	const track = container.querySelector(".catDestaquesTrack");
	const cards = Array.from(container.querySelectorAll(".catCard"));
	const prevBtn = container.querySelector(".catArrow-left");
	const nextBtn = container.querySelector(".catArrow-right");

	if (!viewport || !track || cards.length === 0 || !prevBtn || !nextBtn) return;

	let currentIndex = 0;

	function stepSize() {
		const cardWidth = cards[0].getBoundingClientRect().width;
		const gap = parseFloat(window.getComputedStyle(track).gap || "0");
		return cardWidth + gap;
	}

	function maxOffset() {
		return Math.max(0, track.scrollWidth - viewport.clientWidth);
	}

	function update() {
    // Verifica se estamos em resolução de desktop (onde as setas aparecem)
    if (window.innerWidth > 976) {
        const step = stepSize();
        const offset = Math.min(currentIndex * step, maxOffset());
        currentIndex = Math.max(0, Math.round(offset / step));

        track.style.transform = `translateX(-${offset}px)`;
        prevBtn.disabled = offset <= 0;
        nextBtn.disabled = offset >= maxOffset();
    } else {
        // Se for tablet/mobile, limpa o estilo para o scroll nativo assumir
        track.style.transform = "none";
    }
}

	prevBtn.addEventListener("click", () => {
		currentIndex = Math.max(0, currentIndex - 1);
		update();
	});

	nextBtn.addEventListener("click", () => {
		currentIndex += 1;
		update();
	});

	window.addEventListener("resize", update);
	update();
});
