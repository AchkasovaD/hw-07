document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".btn-readmore");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const infoBlock = document.getElementById(targetId);
      if (infoBlock) {
        infoBlock.classList.toggle("expanded");
        // Змінюємо текст кнопки
        if (infoBlock.classList.contains("expanded")) {
          this.textContent = "Read less";
        } else {
          this.textContent = "Read more";
        }
      }
    });
  });
});
