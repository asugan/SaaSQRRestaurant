let main;
let main2;
const menuid = document.getElementById("menuid").value;
const click = document.getElementById("clickable");
const inputs = document.getElementById("inputs");

// Urun Edit Sayfası Input loaderları

const onload = async () => {
  const urunadi = document.getElementById("urunadi").value;
  const urundescription = document.getElementById("urundescription").value;

  inputcategory(urunadi);
  inputurundescription(urundescription);
};

const onloadkategori = async () => {
  const urunadi = document.getElementById("urunadi").value;

  inputcategory(urunadi);
};

//////////////////////////////////////

const inputcategory = (val) => {
  main = val;
};

const inputurundescription = (val) => {
  main2 = val;
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

const submitdesc = async (id) => {
  const loading = document.querySelector(".loading");
  loading.style.display = "flex";

  const lang = id.classList[0];

  await fetch(`http://localhost:3000/translate/${menuid}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lang: lang, main: main2 }),
  })
    .then((res) => res.json())
    .then((json) => (document.getElementById("desc" + lang).value = json))
    .catch((err) => console.error("error:" + err));
  loading.style.display = "none";
};
