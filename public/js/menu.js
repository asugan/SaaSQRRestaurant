const catnames = document.getElementsByClassName("selectrow");
const catnames_array = [];

for (i = 0; i < catnames.length; i++) {
  catnames_array.push(catnames[i].classList[2]);
}

const filterfunc = (name) => {
  const itemname = name.innerText;

  const filtered = catnames_array.filter((item) => item === itemname);
  const otherfiltered = catnames_array.filter(
    (item) => !item.includes(itemname)
  );

  if (itemname === "Hepsi") {
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