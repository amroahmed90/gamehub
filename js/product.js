/* DEFINING CONSTANTS */
const CART_KEY = "cartItems"

// function to get the data
function getData(){  
  return fetch("../data/data.json")
            .then(response => response.json())
            .then(results => results)
            .catch(error => console.warn(error))
}

const queryString = document.location.search
const params = new URLSearchParams(queryString)
const id = +params.get("id")

let productDetailsDiv = document.querySelector(".product-details")

// in case the product with the given id does npt exist
productDetailsDiv.innerHTML = `
    <div style="color:red; text-align:center">Such ID Does Not exist!</div>
    <div style="color:red; text-align:center"><a href="index.html">Go Back</a></div>      
    `
getData().then(products => {
  products.forEach(product => {
    if (product.id === id) {
      const productObj = {}
      productObj.name = product.name
      productObj.imgSrc = product.img_src
      productObj.price = product.price
      productObj.genre = product.genre.toString()
      productObj.releaseDate = product.release_date
      productObj.devices = product.devices.toString()
      productObj.rating = product.rating
      productObj.details = product.details
      
      document.querySelector("h2").innerText =  productObj.name

      productDetailsDiv.innerHTML = generateProductDetails(productObj)
    }
  })
})

// update the number of items in the shopping cart on page load
document.onload = function() {
  updateNumberOfCartItems()
}()


/* HELPING FUNCTIONS */
// building the main section
function generateProductDetails (productObj) {
  const productStr = JSON.stringify(productObj)
  const name = productObj.name
  const imgSrc = productObj.imgSrc
  const price = productObj.price
  const genre = productObj.genre
  const releaseDate = productObj.releaseDate
  const devices = productObj.devices
  const rating = productObj.rating
  const details = productObj.details
  return `
  <img 
    src="${imgSrc}"
    alt="${name}"
    class="poster"
  />
  <div class="left-floated-details">
    <p>Price: <span class="data">$${price}</span></p>
    <p>
      Genre: <span class="data">${genre}</span>
    </p>
    <p>Release Date: <span class="data">${releaseDate}</span></p>
    <p>Device: <span class="data">${devices}</span></p>
    <p>
      Rating:
      ${rating}
    </p>
  </div>
  <div class="unfloated-details">
    <p>Details:</p>
    <p class="data">
      ${details}
    </p>
  </div>
  <div class="buttons">
    <button 
      class="btn-cart"
      style="background:${idIsInCart(id) ? 'red': ''}"
      onclick='handleUpdateCart(${productStr})'
    >
      ${idIsInCart(id) ? "Added to cart" : "Add to Cart"}
    </button>
    <button class="btn-favourites">Add to Favourites</button>
  </div>
  `
}

/* EVENT FUNCTIONS */
// function to handle add to cart action
function handleUpdateCart(productObj) {  
  let cartItems = JSON.parse(sessionStorage.getItem(CART_KEY))
  const hasItem = idIsInCart(id)
  const btnCart = document.querySelector(".btn-cart")
  if(hasItem) {
    cartItems = cartItems.filter(item => +item.id !== id)
    btnCart.innerHTML = "Add to cart"
    btnCart.style.background = "#34942d"
  } else {
    cartItems.push({id, count:1, name:productObj.name, imgSrc:productObj.imgSrc, price:productObj.price})
    btnCart.innerHTML = "Added to cart"
    btnCart.style.background = "red"
  }
  cartItems = JSON.stringify(cartItems)
  sessionStorage.setItem(CART_KEY, cartItems)
  updateNumberOfCartItems()
}



/* HELPING FUNCTIONS */
// a function that takes in the id of an item and return true if it is in the shopping cart (session storage); otherwise it returns false
function idIsInCart(productId) {
  const cartItems = JSON.parse(sessionStorage.getItem(CART_KEY))
  let hasItem = false
  cartItems.forEach(item => {
    if (+item.id === +productId) {
      hasItem = true
    }
  })
  return hasItem
}

// get the number of items in the cart
function updateNumberOfCartItems () {
  const cartItems = JSON.parse(sessionStorage.getItem(CART_KEY))
  let numberOfCartItemsContainer = document.querySelector(".number-of-cart-items")
  numberOfCartItemsContainer.innerText = cartItems.length
  numberOfCartItemsContainer.style.display = cartItems.length ? "inline" : "none"
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