function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function () {
  var popup = document.getElementById("popupOverlay");
  popup.style.display = "block";
  document.body.classList.add("no-scroll");
});

function updateCopyrightYear() {
  const currentYear = new Date().getFullYear();
  const copyrightElement = document.getElementById("copyright");
  if (copyrightElement) {
    copyrightElement.textContent = currentYear;
  }
}

window.addEventListener("load", function () {
  updateCopyrightYear();
});

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
  document.body.classList.remove("no-scroll");
}
