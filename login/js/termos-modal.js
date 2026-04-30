export function initTermsModal({ openSelector, modalSelector, closeSelector } = {}) {
  const openLink = document.querySelector(openSelector);
  const modal = document.querySelector(modalSelector);
  const closeButton = document.querySelector(closeSelector);

  if (!openLink || !modal) {
    return;
  }

  const openModal = () => {
    modal.classList.add("is-open");
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
  };

  openLink.addEventListener("click", (event) => {
    event.preventDefault();
    openModal();
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
