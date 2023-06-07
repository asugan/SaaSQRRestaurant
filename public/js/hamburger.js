const hamburger = document.getElementsByClassName("hamburger")[0];
const mobilemenu = document.getElementsByClassName("mobilesection")[0];

hamburger.addEventListener("click", function () {
  if (mobilemenu.style.display === "block") {
    mobilemenu.style.display = "none";
  } else {
    mobilemenu.style.display = "block";
  }
});

const langsection = document.getElementsByClassName("langsection")[0];

const showlang = () => {
  langsection.style.display = "block";
};

const removelang = () => {
  langsection.style.display = "none";
};
