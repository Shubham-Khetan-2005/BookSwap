const apiUrl = "https://www.googleapis.com/books/v1/volumes";
const maxResults = 40;

f();
async function f() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
//   console.log(category);
//   console.log(document.getElementById("name"));
  document.querySelector("#name").innerHTML=category;
  if (category === "fiction") {
    // Populate book content for Fiction category
    document.querySelector("#name").innerHTML = "FICTION";  
  } else if (category === "history") {
    // Populate book content for Non-Fiction category
    document.querySelector("#name").innerHTML = "HISTORY";
  } else if (category === "self-help") {
    // Populate book content for Self-Help category
    document.querySelector("#name").innerHTML = "SELF HELP";
  } else {
    // Handle unknown category or no category provided
    document.getElementById("#name").innerHTML ="No books found for this category."; 
    return false;
  }
  const url = `${apiUrl}?q=subject:${category}&maxResults=${maxResults}`;
  await fetch(url)
    .then((response) => response.json())
    .then((json) => {
      const jsonData = json.items;
      displayBooks(jsonData);
    });
}
// Function to display books in the specified tabId container
function displayBooks(jsonData) {
  const container = document.getElementById("PageContent");
  if (!container) {
    console.error(`Container not found`);
    return;
  }

  let str = ``;
  for (let i = 0; i < jsonData.length; i++) {
    try {
      const details = jsonData[i].volumeInfo;
      str += `<div class="bg-white border rounded-lg overflow-hidden shadow-md">
      <img src="${details.imageLinks.thumbnail}" alt="${details.title}" id="img${i}" class="w-full h-48 object-cover">
      <div class="p-4">
          <h3 class="text-lg font-semibold mb-2">${details.title}</h3>
          <p class="text-sm text-gray-700 mb-2">By ${details.authors}</p>
      </div>
  </div>`;
    } catch (error) {}
  }

  container.innerHTML = str;

  for (let i = 0; i < jsonData.length; i++) {
    const image = document.getElementById(`img${i}`);
    if (image) {
      image.addEventListener("click", () => {
        openModal(jsonData[i]);
      });
    }
  }
}

function authors(data) {
  if (data && data.volumeInfo.authors) {
    const authorList = data.volumeInfo.authors.join(", ");
    return authorList;
  }
  return "Unknown";
}

function displayPublisher(data) {
  if (data && data.volumeInfo && data.volumeInfo.publisher) {
    return data.volumeInfo.publisher;
  }
  return "Publisher information not available";
}

function price(saleInfo) {
  if (saleInfo && saleInfo.saleability === "FOR_SALE") {
    // Check if price is provided
    if (saleInfo.listPrice && saleInfo.listPrice.amount) {
      return `${saleInfo.listPrice.amount.toFixed(2)}`;
    } else {
      return "Price not available";
    }
  } else {
    return "Not for sale";
  }
}

function ratings(data) {
  if (data && data.volumeInfo.averageRating) {
    const averageRating = data.volumeInfo.averageRating;
    const starsHTML = getStarsHTML(averageRating);
    return starsHTML;
  }
  return "Not rated";
}

function getStarsHTML(rating) {
  const maxRating = 5;
  const roundedRating = Math.round(rating * 2) / 2; // Round rating to nearest 0.5
  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  let starsHTML = "";
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<span class="material-icons">star</span>';
  }
  // Add half star if applicable
  if (halfStar) {
    starsHTML += '<span class="material-icons">star_half</span>';
  }
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<span class="material-icons">star_border</span>';
  }

  return starsHTML;
}

function openModal(data) {
  const modalTitle = document.getElementById("modalBookTitle");
  modalTitle.textContent = data["volumeInfo"]["title"];
  modalTitle.classList.add("text-lg", "font-bold", "mb-2");

  const modalAuthor = document.getElementById("modalBookAuthor");
  modalAuthor.textContent = `Authors: ${authors(data)}`;
  modalAuthor.classList.add("text-gray-700", "mb-2");

  const modalPublisher = document.getElementById("modalBookPublisher");
  modalPublisher.textContent = `Publisher: ${displayPublisher(data)}`;
  modalPublisher.classList.add("text-gray-600", "mb-2");

  const modalPrice = document.getElementById("modalBookPrice");
  modalPrice.textContent = `Price: Rs. ${price(data["saleInfo"])}`;
  modalPrice.classList.add("text-green-600", "font-semibold", "mb-2");

  const modalRatings = document.getElementById("modalBookRatings");
  modalRatings.innerHTML = `Ratings: ${ratings(data)}`;
  modalRatings.classList.add("flex", "items-center", "mb-2");

  const modalImage = document.getElementById("modalBookImage");
  modalImage.src = data["volumeInfo"]["imageLinks"]["thumbnail"];
  modalImage.alt = data["volumeInfo"]["title"];
  modalImage.classList.add("w-full", "h-auto", "rounded-md");

  const previewButton = document.getElementById("preview");
  previewButton.addEventListener("click", () => {
    preview(data);
  });

  // Displaying modal
  const modal = document.getElementById("bookModal");
  modal.classList.remove("hidden");
}

function preview(data) {
  if (data["volumeInfo"]["previewLink"]) {
    window.open(data["volumeInfo"]["previewLink"], "_blank");
  } else {
    alert("Preview not available for this book.");
  }
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("bookModal");
  modal.classList.add("hidden");
}

// Placeholder functions for buyNow and addToCart actions
function buyNow() {
  alert("Buy Now clicked");
}

function addToCart() {
  alert("Add to Cart clicked");
}