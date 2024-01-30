function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function () {
  // Show popup when page loads
  var popup = document.getElementById("popupOverlay");
  popup.style.display = "block";
  // Prevent scrolling
  document.body.classList.add("no-scroll");
});

function closePopup() {
  // Hide popup
  document.getElementById("popupOverlay").style.display = "none";
  // Enable scrolling
  document.body.classList.remove("no-scroll");
}
