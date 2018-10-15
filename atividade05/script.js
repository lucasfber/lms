let accordionTitleWrapper = document.querySelector(".accordion-title-wrapper");
let accordionBody = document.querySelector(".accordion-body");
let title = document.querySelector(".accordion-title");
title.addEventListener("click", function() {
  accordionBody.classList.toggle("collapse");
});

let sideMenu = document.querySelector(".side-menu");
let mainContent = document.querySelector(".main-content");

let btnMenu = document.querySelector(".btn-menu");
btnMenu.addEventListener("click", function() {
  if (sideMenu.style.width === "30%") {
    sideMenu.style.width = "0";
    mainContent.style.width = "100%";
    return;
  }
  sideMenu.style.width = "30%";
  mainContent.style.width = "70%";
});
