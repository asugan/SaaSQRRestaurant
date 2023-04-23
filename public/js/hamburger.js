const hamburger = document.getElementsByClassName("hamburger")[0];
const mobilemenu = document.getElementsByClassName("mobilesection")[0];

hamburger.addEventListener("click", function () {
  if (mobilemenu.style.display === "block") {
    mobilemenu.style.display = "none";
  } else {
    mobilemenu.style.display = "block";
  }
});
