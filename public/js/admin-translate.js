let main;
const menuid = document.getElementById("menuid").value;
const click = document.getElementById("clickable");
const inputs = document.getElementById("inputs");

const inputcategory = (val) => {
  main = val;
};

const opentranslate = async () => {
  if (inputs.style.display === "block") {
    inputs.style.display = "none";
  } else {
    inputs.style.display = "block";
  }
};

const submit = async (id) => {
  const loading = document.querySelector(".loading");
  loading.style.display = "flex";

  const lang = id.classList[0];

  await fetch(`http://localhost:3000/translate/${menuid}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lang: lang, main: main }),
  })
    .then((res) => res.json())
    .then((json) => (document.getElementById(lang).value = json))
    .catch((err) => console.error("error:" + err));
  loading.style.display = "none";
};
