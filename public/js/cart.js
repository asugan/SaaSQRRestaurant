const cart = [];
const orderinput = document.getElementsByClassName("orderinput")[0];
// const numberinput = document.getElementsByClassName("numberinput")[0];

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function sumArray(array) {
  let sum = 0;

  array.forEach((item) => {
    sum += item;
  });

  return sum;
}

const sendid = async (id) => {
  const urunid = id.classList[0];

  const select = document.getElementsByClassName(
    `uruncontainer ${id.classList[0]}`
  );

  const selectelement = select[0].parentElement;
  const urunadi = selectelement.getElementsByClassName("itemname")[0].innerHTML;
  const fiyat = selectelement.getElementsByClassName("itemprice")[0].innerHTML;
  const adet = selectelement.getElementsByClassName("numberinput")[0].value;
  const cartadet = document.getElementsByClassName("bagspan")[0];

  cart.push({ id: urunid, urunadi: urunadi, fiyat: fiyat, adet: adet });

  const fiyatlar = cart.map((i) => {
    return Number(i.fiyat.split("₺")[0] * i.adet);
  });

  let mycart = document.getElementsByClassName("cartinside")[0];
  let myfiyatlar = document.getElementsByClassName("maliyet")[0];
  let htmlcart = "";
  cartadet.innerHTML = cart.length;

  for (let i = 0; i < cart.length; i++) {
    htmlcart += `
        <div class="row">
          <div class="col-2">
            <h5>${cart[i].adet}</h5>
          </div>
          <div class="col-8">
            <h5>${cart[i].urunadi}</h5>
          </div>
          <div class="col-2">
            <h5>${cart[i].fiyat}</h5>
          </div>
        </div>
    `;
  }

  mycart.innerHTML = htmlcart;
  myfiyatlar.innerHTML = `<h3 class="text-center">Toplam: ${sumArray(
    fiyatlar
  )} ₺</h3>`;
};

const submit = async () => {
  await fetch("http://localhost:3000/order", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cart),
  })
    .then((res) => res.json())
    .then(await delay(1500))
    .then((json) => (window.location.href = `/order/getorder/${json}`))
    .catch((err) => console.error("error:" + err));
};

const valueup = (id) => {
  const select = document.getElementsByClassName(
    `uruncontainer ${id.classList[0]}`
  );

  const selectelement = select[0].parentElement;

  const numberinput = selectelement.getElementsByClassName("numberinput")[0];

  if (numberinput.value < 10) {
    numberinput.value++;
  }
};

const valuedown = (id) => {
  const select = document.getElementsByClassName(
    `uruncontainer ${id.classList[0]}`
  );

  const selectelement = select[0].parentElement;

  const numberinput = selectelement.getElementsByClassName("numberinput")[0];

  if (numberinput.value > 1) {
    numberinput.value--;
  }
};
