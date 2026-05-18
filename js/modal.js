document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const openButtons = document.querySelectorAll(".btn-subscribe");
  const closeBtn = modal.querySelector(".modal-close");

  function openModal() {
    modal.style.display = "block";
  }
  function closeModal() {
    modal.style.display = "none";
  }

  openButtons.forEach((btn) => btn.addEventListener("click", openModal));
  closeBtn.addEventListener("click", closeModal);

  // Закриття по кліку поза вікном
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Закриття по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") closeModal();
  });
});
