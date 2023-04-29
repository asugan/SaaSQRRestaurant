const catnames = document.getElementsByClassName("selectrow");
const catnames_array = [];
const prices_array = [];
const firstvalue = document.getElementById("money").selectedOptions[0].value;

const fetchcusd = async () => {
  const response = await fetch("https://finans.truncgil.com/today.json");
  const jsonData = await response.json();
  return jsonData.USD.Alış;
};

const fetchceur = async () => {
  const response = await fetch("https://finans.truncgil.com/today.json");
  const jsonData = await response.json();
  return jsonData.EUR.Alış;
};

const itemprices = document.getElementsByClassName("itemprice");

for (i = 0; i < itemprices.length; i++) {
  const lastletter = itemprices[i].innerText.slice(-1);
  const pricefloat = itemprices[i].innerText.split(lastletter)[0];
  prices_array.push(pricefloat);
}

const kurguncelle = async (tag) => {
  const kurusd = await fetchcusd();
  const kureur = await fetchceur();
  const parsedkurusd = parseFloat(kurusd).toFixed(1);
  const parsedkureur = parseFloat(kureur).toFixed(1);

  if (firstvalue === "₺") {
    if (tag === "$") {
      for (i = 0; i < itemprices.length; i++) {
        itemprices[i].innerText =
          parseFloat(prices_array[i] / parsedkurusd).toFixed(1) + ` ${tag}`;
      }
    } else if (tag === "€") {
      for (i = 0; i < itemprices.length; i++) {
        itemprices[i].innerText =
          parseFloat(prices_array[i] / parsedkureur).toFixed(1) + ` ${tag}`;
      }
    } else {
      for (i = 0; i < itemprices.length; i++) {
        itemprices[i].innerText = parseFloat(prices_array[i]) + ` ₺`;
      }
    }
  } else if (firstvalue === "$") {
    if (tag === "₺") {
      for (i = 0; i < itemprices.length; i++) {
        itemprices[i].innerText =
          parseFloat(prices_array[i] * parsedkurusd).toFixed(1) + ` ${tag}`;
      }
    } else if (tag === "€") {
      for (i = 0; i < itemprices.length; i++) {
        itemprices[i].innerText =
          parseFloat((prices_array[i] * parsedkurusd) / parsedkureur).toFixed(
            1
          ) + ` ${tag}`;
      }
    } else {
      for (i = 0; i < itemprices.length; i++) {
        itemprices[i].innerText = parseFloat(prices_array[i]) + ` $`;
      }
    }
  } else if (firstvalue === "€") {
    if (tag === "₺") {
      for (i = 0; i < itemprices.length; i++) {
        itemprices[i].innerText =
          parseFloat(prices_array[i] * parsedkureur).toFixed(1) + ` ${tag}`;
      }
    } else if (tag === "$") {
      for (i = 0; i < itemprices.length; i++) {
        itemprices[i].innerText =
          parseFloat((prices_array[i] * parsedkureur) / parsedkurusd).toFixed(
            1
          ) + ` ${tag}`;
      }
    } else {
      for (i = 0; i < itemprices.length; i++) {
        itemprices[i].innerText = parseFloat(prices_array[i]) + ` €`;
      }
    }
  } else {
    return;
  }
};

const select = async () => {
  var selectedValue = document.getElementById("money").value;

  await kurguncelle(selectedValue);
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
