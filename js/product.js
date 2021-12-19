// function to get the data
function getData(){  
  return fetch("../data/data.json")
            .then(response => response.json())
            .then(results => results)
            .catch(error => console.warn(error))
}

const queryString = document.location.search
const params = new URLSearchParams(queryString)
const id = params.get("id")

let productDetailsDiv = document.querySelector(".product-details")

getData().then(products => {
  products.forEach(product => {
    if (product.id === +id) {
      const name = product.name
      const imgSrc = product.img_src
      const price = product.price
      const genre = product.genre.toString()
      const releaseDate = product.release_date
      const devices = product.devices.toString()
      const rating = product.rating
      const details = product.details
      
      productDetailsDiv.innerHTML = generateProductDetails(name, imgSrc, price, genre, releaseDate, devices, rating, details)
    }
  })
})

/* HELPING FUNCTIONS */
// building the main section
function generateProductDetails (name, imgSrc, price, genre, releaseDate, devices, rating, details) {
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
    <button class="btn-cart">Add to Cart</button>
    <button class="btn-favourites">Add to Favourites</button>
  </div>
  `
}