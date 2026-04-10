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
export function iniciarCarrossel(wrapperId, btnLeftId, btnRightId) {
  const sliderWrapper = document.getElementById(wrapperId);
  const btnLeft = document.getElementById(btnLeftId);
  const btnRight = document.getElementById(btnRightId);

  if (!sliderWrapper || !btnLeft || !btnRight) return;

  const updateArrowsVisibility = () => {
    const scrollLeft = sliderWrapper.scrollLeft;
    const scrollWidth = sliderWrapper.scrollWidth;
    const clientWidth = sliderWrapper.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    if (scrollLeft <= 5) {
      btnLeft.style.opacity = "0";
      btnLeft.style.pointerEvents = "none";
      btnLeft.style.visibility = "hidden";
    } else {
      btnLeft.style.opacity = "1";
      btnLeft.style.pointerEvents = "auto";
      btnLeft.style.visibility = "visible";
    }

    if (scrollLeft >= maxScroll - 5) {
      btnRight.style.opacity = "0";
      btnRight.style.pointerEvents = "none";
      btnRight.style.visibility = "hidden";
    } else {
      btnRight.style.opacity = "1";
      btnRight.style.pointerEvents = "auto";
      btnRight.style.visibility = "visible";
    }
  };

  const getScrollAmount = () => {
    const item = sliderWrapper.querySelector(".slider-item");
    return item ? item.offsetWidth + 16 : 300;
  };


  btnLeft.onclick = () => {
    sliderWrapper.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  };

  btnRight.onclick = () => {
    sliderWrapper.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  };

  sliderWrapper.addEventListener("scroll", updateArrowsVisibility);
  window.addEventListener("resize", updateArrowsVisibility);


  updateArrowsVisibility();
}
