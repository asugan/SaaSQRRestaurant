const cart = [];

const sendid = async (id) => {
  const urunid = id.classList[0];

  const select = document.getElementsByClassName(
    `uruncontainer ${id.classList[0]}`
  );

  const selectelement = select[0].parentElement;
  const urunadi = selectelement.getElementsByClassName("itemname")[0].innerHTML;
  const fiyat = selectelement.getElementsByClassName("itemprice")[0].innerHTML;

  cart.push({ id: urunid, urunadi: urunadi, fiyat: fiyat });

  console.log(cart);
};

const submit = async () => {
  /* const formData = new FormData();
  formData.append("name", urunadi);
  formData.append("id", urunid);
  formData.append("price", fiyat) */

  await fetch("http://localhost:3000/order", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cart),
  });
};
