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
