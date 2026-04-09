// LÓGICA DO CARROSSEL

  const sliderWrapper = document.getElementById("sliderWrapper");
  const btnLeft = document.getElementById("btnLeftUnits");
  const btnRight = document.getElementById("btnRightUnits");

  if (sliderWrapper && btnLeft && btnRight) {
    
    
    const getScrollAmount = () => {
      const item = sliderWrapper.querySelector(".slider-item");
      return item ? item.offsetWidth + 16 : 300; 
    };

    
    const updateArrowsVisibility = () => {
      
      if (sliderWrapper.scrollLeft <= 0) {
        btnLeft.style.opacity = "0";
        btnLeft.style.pointerEvents = "none"; 
      } else {
        btnLeft.style.opacity = "1";
        btnLeft.style.pointerEvents = "auto"; 
      }

      const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
      
      
      if (sliderWrapper.scrollLeft >= maxScroll - 2) {
        btnRight.style.opacity = "0";
        btnRight.style.pointerEvents = "none";
      } else {
        btnRight.style.opacity = "1";
        btnRight.style.pointerEvents = "auto";
      }
    };

  
    btnLeft.addEventListener("click", () => {
      sliderWrapper.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    btnRight.addEventListener("click", () => {
      sliderWrapper.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    sliderWrapper.addEventListener("scroll", updateArrowsVisibility);
    

    window.addEventListener("resize", updateArrowsVisibility);
    
    updateArrowsVisibility(); 
  }