(function () {
  const burgerBtn = document.querySelector(
    ".header-icons .icon-link:last-child",
  );
  if (!burgerBtn) return;

  let mobileMenu = document.getElementById("mobileMenu");
  if (!mobileMenu) {
    mobileMenu = document.createElement("div");
    mobileMenu.id = "mobileMenu";
    mobileMenu.className = "mobile-menu";
    mobileMenu.innerHTML = `
      <div class="mobile-menu-overlay"></div>
      <div class="mobile-menu-container">
        <button class="mobile-menu-close">&times;</button>
        <ul class="mobile-menu-list">
          <li><a href="#">Home</a></li>
          <li><a href="#">Shop</a></li>
          <li><a href="#">Products</a></li>
          <li><a href="#">About</a></li>
          <li><a href="ip.html">Account</a></li>
        </ul>
      </div>
    `;
    document.body.appendChild(mobileMenu);
  }

  const menuOverlay = mobileMenu.querySelector(".mobile-menu-overlay");
  const menuContainer = mobileMenu.querySelector(".mobile-menu-container");
  const closeBtn = mobileMenu.querySelector(".mobile-menu-close");
  const menuLinks = mobileMenu.querySelectorAll(".mobile-menu-list a");

  function openMenu() {
    mobileMenu.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  }

  burgerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openMenu();
  });

  if (menuOverlay) {
    menuOverlay.addEventListener("click", closeMenu);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      closeMenu();
    }
  });
})();
