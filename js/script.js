// function to get the data
function getData(){  
  return fetch("../data/data.json")
            .then(response => response.json())
            .then(results => results)
            .catch(error => console.warn(error))
}

const generateProductDiv = (id, imgSrc, name, price) => {
  return `
  <div class="product">
    <a href="./product.html?id=${id}">
      <img src="${imgSrc}" alt="${name}" />
      <h3 class="center-text">${name}</h3>
      <p class="center-text">$${price}</p>
    </a>
    <i
      class="far fa-heart add-to-favourites"
      title="Add to Favourites"></i>
     <i
      class="fas fa-cart-plus add-to-cart"
      title="Add to Cart"></i>
  </div>
  `
}

getData().then(products => {
  let newReleasesDiv = document.querySelector("#new-releases .game-category")

  let ps4Div = document.querySelector("#ps4 .game-category")
  let pcDiv = document.querySelector("#pc .game-category")
  let xboxDiv = document.querySelector("#xbox .game-category")

  products.forEach(product => {
    const id = product.id
    const imgSrc = product.img_src
    const name = product.name
    const price = product.price

    // building the new releases section
    if (product.new_arrivals) {
      newReleasesDiv.innerHTML += generateProductDiv(id, imgSrc, name, price)
    }

    // building the PC section
    if (product.devices.includes("PC")) {
      pcDiv.innerHTML += generateProductDiv(id, imgSrc, name, price)
    }

    // building the PS4 section
    if (product.devices.includes("PS4")) {
      ps4Div.innerHTML += generateProductDiv(id, imgSrc, name, price)
    }

    // building the XBOX section
    if (product.devices.includes("XBOX")) {
      xboxDiv.innerHTML += generateProductDiv(id, imgSrc, name, price)
    }
  })
})

