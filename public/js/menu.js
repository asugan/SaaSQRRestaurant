const catnames = document.getElementsByClassName("selectrow");
const catnames_array = [];

const fetchcurrency = async () => {
  const response = await fetch("https://finans.truncgil.com/today.json");
  const jsonData = await response.json();
  return jsonData.USD.Alış;
};

for (i = 0; i < catnames.length; i++) {
  catnames_array.push(catnames[i].classList[2]);
}

const filterfunc = (name) => {
  const itemname = name.innerText;

  const filtered = catnames_array.filter((item) => item === itemname);
  const otherfiltered = catnames_array.filter(
    (item) => !item.includes(itemname)
  );

  if (
    itemname === "All" ||
    itemname === "Hepsi" ||
    itemname === "все" ||
    itemname === "tous"
  ) {
    for (i = 0; i < otherfiltered.length; i++) {
      const item = document.getElementsByClassName(otherfiltered[i]);
      item[0].style.display = "block";
    }

    for (i = 0; i < filtered.length; i++) {
      const item = document.getElementsByClassName(filtered[i]);
      item[0].style.display = "block";
    }
  } else {
    for (i = 0; i < otherfiltered.length; i++) {
      const item = document.getElementsByClassName(otherfiltered[i]);
      item[0].style.display = "none";
    }

    for (i = 0; i < filtered.length; i++) {
      const item = document.getElementsByClassName(filtered[i]);
      item[0].style.display = "block";
    }
  }
};

const itemprices = document.getElementsByClassName("itemprice");

const kurguncelle = async () => {
  const kur = await fetchcurrency();
  const parsedkur = parseFloat(kur).toFixed(1);

  for (i = 0; i < itemprices.length; i++) {
    const pricefloat = itemprices[i].innerText.split("₺")[0];

    itemprices[i].innerText =
      parseFloat(pricefloat / parsedkur).toFixed(1) + " ₺";
  }
};

kurguncelle();
