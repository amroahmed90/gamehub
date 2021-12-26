/* GETTING SORT INPUTS VALUES */
class Sort {
  constructor () {
    this.value = this.returnRadioValue("sort")
  }
  returnRadioValue(inputName) {
    const radioElements = document.getElementsByName(inputName)
    let value = ""
    radioElements.forEach(el => {
      if (el.checked) value = el.value
    })
    return value
  }
}

function applySort() {
  const sortObj = new Sort
  const sortValue = sortObj.value
  let cartItems = JSON.parse(sessionStorage.getItem("products")) || []
  // sorting them items
  const sortedCartItems = sortArrayBasedOnValue(sortValue, cartItems)
  // empty all sections on the page; exept for the #filter-sort-results section
  const allsections = document.querySelectorAll("section")
  allsections.forEach(section => {
    if (section.id !== "filter-sort-results") {
      section.innerHTML = ""
    } else {
      section.querySelector(".game-category").innerHTML = ""
    }
  })
  // printing sorted items to the page
  const filterSortSection = document.querySelector("#filter-sort-results .game-category")
  sortedCartItems.forEach(item => {
    filterSortSection.innerHTML += generateProductDiv(item.id, item.img_src, item.name, item.price)
  })
}

function sortArrayBasedOnValue(sortValue, array) {
  switch (sortValue) {
    case "price-low-to-high":
      array.sort((a,b) => (a.price > b.price) ? 1 : (a.price < b.price) ? -1 : 0)
      break;
    
    case "price-high-to-low":
      array.sort((a,b) => (a.price < b.price) ? 1 : (a.price > b.price) ? -1 : 0)
      break;
    
    case "date-old-to-new":
      array.sort((a,b) => (a.release_date_formatted > b.release_date_formatted) ? 1 : (a.release_date_formatted < b.release_date_formatted) ? -1 : 0)
      break;
    
    case "date-new-to-old":
      array.sort((a,b) => (a.release_date_formatted < b.release_date_formatted) ? 1 : (a.release_date_formatted > b.release_date_formatted) ? -1 : 0)
      break;
    
    case "alpha-a-to-z":
      array.sort((a,b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0)
      break;

    case "alpha-z-to-a":
      array.sort((a,b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0)
      break;
    default:
      break;
  }
  return array
}
