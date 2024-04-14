const apiUrl = "https://www.googleapis.com/books/v1/volumes";
const maxResults = 40;

const urlFiction = `${apiUrl}?q=subject:fiction&maxResults=${maxResults}`;
fetch(urlFiction)
  .then((response) => response.json())
  .then((json) => {
    const jsonData = json["items"];
    displayBooks("Fiction", "fictionContent", jsonData);
  });

const urlHistory = `${apiUrl}?q=subject:history&maxResults=${maxResults}`;
fetch(urlHistory)
  .then((response) => response.json())
  .then((json) => {
    const jsonData = json["items"];
    displayBooks("History", "historyContent", jsonData);
  });

const urlSelfHelp = `${apiUrl}?q=subject:self-help&maxResults=${maxResults}`;
fetch(urlSelfHelp)
  .then((response) => response.json())
  .then((json) => {
    const jsonData = json["items"];
    displayBooks("SelfHelp", "selfHelpContent", jsonData);
  });

// Function to display books in the specified tabId container
function displayBooks(subject, tabId, jsonData) {
  const container = document.getElementById(tabId);
  if (!container) {
    console.error(`Container not found for ${subject}`);
    return;
  }

  let str = `<div class="grid grid-cols-1 md:grid-cols-4 gap-8 pl-16 pr-16 w-full" id="${tabId}Content">`;
  let bookCount = 0;

  for (let i = 0; i < jsonData.length && bookCount < 4; i++) {
    const book = jsonData[i];
    const saleInfo = book["saleInfo"];
    if (saleInfo && saleInfo["saleability"] === "FOR_SALE") {
      str += `<img src="${
        book["volumeInfo"]["imageLinks"]["thumbnail"]
    }" alt="Image ${bookCount + 1}" id="img${bookCount}" class="w-full h-auto book-item">`;
      bookCount++;
    }
  }
  str += `</div>`;

  container.innerHTML = str;

  // Isme problem hai
  for (bookCount = 0; bookCount<4; bookCount++) {
    if (saleInfo && saleInfo["saleability"] === "FOR_SALE") {
        const image = document.getElementById(`img${bookCount}`);
        if (image) {
        image.addEventListener("click", () => {
            openModal(jsonData[bookCount]);
        });
        }
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
        return `$${saleInfo.listPrice.amount.toFixed(2)}`;
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
    const halfStar = (roundedRating % 1 !== 0);
    const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);
  
    let starsHTML = '';
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
  
    const modalAuthor = document.getElementById('modalBookAuthor');
    modalAuthor.textContent = `Authors: ${authors(data)}`;
    modalAuthor.classList.add("text-gray-700", "mb-2"); 

    const modalPublisher = document.getElementById('modalBookPublisher');
    modalPublisher.textContent = `Publisher: ${displayPublisher(data)}`;
    modalPublisher.classList.add("text-gray-600", "mb-2");
  
    const modalPrice = document.getElementById('modalBookPrice');
    modalPrice.textContent = `Price: ${price(data["saleInfo"])}`;
    modalPrice.classList.add("text-green-600", "font-semibold", "mb-2"); 
  
    const modalRatings = document.getElementById('modalBookRatings');
    modalRatings.innerHTML = `Ratings: ${ratings(data)}`;
    modalRatings.classList.add("flex", "items-center", "mb-2");

    const modalImage = document.getElementById('modalBookImage');
    modalImage.src = data["volumeInfo"]["imageLinks"]["thumbnail"];
    modalImage.alt = data["volumeInfo"]["title"];
    modalImage.classList.add("w-full", "h-auto", "rounded-md");
  
    // Displaying modal
    const modal = document.getElementById("bookModal");
    modal.classList.remove("hidden");
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

function handleBookClick(event) {
  const target = event.target;
  if (target.classList.contains("book-item")) {
    openModal();
  }
}

