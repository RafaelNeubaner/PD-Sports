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
		const step = stepSize();
		const offset = Math.min(currentIndex * step, maxOffset());
		currentIndex = Math.max(0, Math.round(offset / step));

		track.style.transform = `translateX(-${offset}px)`;
		prevBtn.disabled = offset <= 0;
		nextBtn.disabled = offset >= maxOffset();
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
