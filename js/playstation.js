// defining constant
const CART_KEY = "cartItems"
const PRODUCTS_KEY = "products"

// function to get the data
function getData(){
  const productsStr = sessionStorage.getItem(PRODUCTS_KEY)
  if (!productsStr) {
    fetch("../data/data.json")
        .then(response => response.json())
        .then(products => {
          // populate home page with products
          populateHomePage(products)
          // save products data to session storage
          const productsStr = JSON.stringify(products)
          sessionStorage.setItem(PRODUCTS_KEY, productsStr)
        })
        .catch(error => console.warn(error))
  }
  else {
    const products = JSON.parse(productsStr)
     // populate home page with products
     populateHomePage(products)
     updateNumberOfCartItems()

  }
}


getData()

// update the number of items in the shopping cart on page load
document.onload = function() {
  updateNumberOfCartItems()
}()


/* EVENT HANDLERS */
// function to handle add to cart action
function handleAddToCart(e) {
  e = e || window.event
  const target = e.target || e.srcElement
  // update session storage
  const dataProductStr = target.parentElement.getAttribute("data-product")
  updateSessionStorage(dataProductStr)
  // toggle .added-to-cart products with the same id in other categories
  updateSameProductInDifferentCategories(e)
  // update number of items on the shopping cart item
  updateNumberOfCartItems()
}


/* HELPING FUNCTIONS */
// function to populate home page
function populateHomePage(products) {
  let ps4Div = document.querySelector("#ps4 .game-category")

  products.forEach(product => {
    const id = product.id
    const imgSrc = product.img_src
    const name = product.name
    const price = product.price

    // building the PS4 section
    if (product.devices.includes("PS4")) {
      ps4Div.innerHTML += generateProductDiv(id, imgSrc, name, price)
    }
  })
}

// function to generate .product div
function generateProductDiv (id, imgSrc, name, price) {
  return `
  <div
    class="product product-number-${id}"
    data-product='{"id": "${id}", "count": "1", "name": "${name}", "price": "${price}", "imgSrc": "${imgSrc}"}'
  >
    <a href="./product.html?id=${id}">
      <img src="${imgSrc}" alt="${name}" />
      <h3 class="center-text">${name}</h3>
      <p class="center-text">$${price}</p>
    </a>
    <i
      class="far fa-heart add-to-favourites"
      title="Add to Favourites"></i>
    <i
      onclick="handleAddToCart(event)"
      class="fas fa-cart-plus add-to-cart ${idIsInCart(id) ? "added-to-cart": ""}"
      title="Add to Cart"></i>
  </div>
  `
}

// function to update local storage 
function updateSessionStorage (itemString) {
  let currentCartStr = sessionStorage.getItem(CART_KEY)
  if (!currentCartStr) {
    currentCartStr = "[]"
    sessionStorage.setItem(CART_KEY, currentCartStr)
  }
  let currentCart = JSON.parse(currentCartStr)
  const itemObject = JSON.parse(itemString)
  const indexOfItemInCurrentCart = checkInCart(itemObject, currentCart)

  if (indexOfItemInCurrentCart === -1) {
    currentCart.push(itemObject)
  } else {
    currentCart = currentCart.filter((cartItem, index) => index !== indexOfItemInCurrentCart)
  }
  currentCartStr = JSON.stringify(currentCart)
  sessionStorage.setItem(CART_KEY, currentCartStr)
  // return itemObject
}

// function to check if an item (obj) is in the cart (array of obj)
// it the item exists => returns the index; otherwiser => returns -1
function checkInCart (seekedItem, cartItems) {
  // casting strings to object/arrays
  if (typeof seekedItem === "string") {
    seekedItem = JSON.parse(seekedItem)
  }
  if (typeof cartItems === "string") {
    cartItems = JSON.parse(cartItems)
  }
  // checking if the item exists in cart
  let indexOfItem = -1;
  cartItems.forEach((cartItem, index) => {
    if(+seekedItem.id === +cartItem.id) indexOfItem = index
  })
  return indexOfItem
}

// get the number of items in the cart
function updateNumberOfCartItems () {
  const cartItems = JSON.parse(sessionStorage.getItem(CART_KEY)) || []
  let numberOfCartItemsContainer = document.querySelector(".number-of-cart-items")
  numberOfCartItemsContainer.innerText = cartItems.length
  numberOfCartItemsContainer.style.display = cartItems.length ? "inline" : "none"
}

// get all products with the same id in all categories
// argument: click event
// action: selects all products with the same id but mentioned in different categories (e.g. PC, PS4..) and toggle .added-to-cart to them to indicate to the user that these are already in the cart
function updateSameProductInDifferentCategories(event) {
  const classNameWithId = event.target.parentElement.classList[1]
  const similarProducts = document.querySelectorAll(`.${classNameWithId}`)
  similarProducts.forEach(product => product.querySelector("i.add-to-cart").classList.toggle("added-to-cart"))
}

// a function that takes in the id of an item and return true if it is in the shopping cart (session storage); otherwise it returns false
function idIsInCart(id) {
  const cartItems = JSON.parse(sessionStorage.getItem(CART_KEY)) || []
  let hasItem = false
  cartItems.forEach(item => {
    if (+item.id === +id) {
      hasItem = true
    }
  })
  return hasItem
}