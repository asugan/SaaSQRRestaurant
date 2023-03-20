/* const itemname = document.getElementsByClassName("itemname");
const itemprice = document.getElementsByClassName("itemprice");

const items_array = [];

for (i = 0; i < itemname.length; i++) {
  items_array.push({
    id: i,
    yemekadi: itemname[i].innerHTML,
    fiyat: itemprice[i].innerHTML,
    count: 1,
  });
}

function appendNode(parent, element) {
  parent.appendChild(element);
}

function getDiv(container) {
  return document.getElementById(container);
}

function createNode(node) {
  let element = document.createElement(node);
  return element;
}

function displayItems(items, container) {
  let items_container = getDiv(container);
  items_container.innerHTML = "";

  for (let i = 0; i < items.length; i++) {
    let item = items[i];

    let item_node = createNode("li");
    item_node.setAttribute("id", item.id);

    if (item.count > 0) {
      item_node.innerHTML = `${item.yemekadi} 
            <span id="badge">${item.count}</span>`;
      appendNode(items_container, item_node);
    }
  }
}

displayItems(items_array, "items");

console.log(items_array); */

const cart = [];

const sendid = (id) => {
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
