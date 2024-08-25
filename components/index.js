// Get the search input and autocomplete list elements from the DOM
const search = document.getElementById("search");
const autocompleteList = document.getElementById("autocomplete-list");

// Function to clear the autocomplete list
function clearAutocompleteList() {
  autocompleteList.innerHTML = "";
}

// Function to search for meals based on the user's input
async function searchedMeal(value) {
  // If the input is empty, clear the autocomplete list and exit the function
  if (!value) {
    clearAutocompleteList();
    return;
  }
  // Fetch meals from TheMealDB API based on the search input
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
  );
  const data = await res.json();
  // Display the list of matching meals
  showMealisList(data?.meals);
}

// Function to debounce the search input, adding a delay before executing the search
function debounce(func, delay) {
  let timeoutId;
  return (...prev) => {
    // Clear the previous timeout if the user types again within the delay period
    if (timeoutId) clearTimeout(timeoutId);
    // Set a new timeout to execute the search function after the delay
    timeoutId = setTimeout(() => {
      func(...prev);
    }, delay);
  };
}

// Create a debounced version of the search function with a 500ms delay
const debouncedSearch = debounce(searchedMeal, 500);

// Add an event listener to the search input to trigger the debounced search on each input
search.addEventListener("input", (event) => {
  const val = event.target.value;
  debouncedSearch(val);
});

// Add an event listener to the document to clear the autocomplete list when clicking outside the search area
document.addEventListener("click", (event) => {
  if (
    !search.contains(event.target) &&
    !autocompleteList.contains(event.target)
  ) {
    clearAutocompleteList();
  }
});

// Function to display the list of meals in the autocomplete dropdown
function showMealisList(meals) {
  // Clear any previous autocomplete results
  clearAutocompleteList();

  // Get the list of favorite meals from localStorage
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // If meals are found, create a list item for each meal
  if (meals) {
    meals.forEach((meal) => {
      // Check if the meal is already in the favorites list
      const isFavorited = favorites.some(
        (favorite) => favorite.idMeal === meal.idMeal
      );
      const listItem = document.createElement("li");

      // Set the inner HTML of the list item with the meal name and a favorite button
      listItem.innerHTML = `
        <div class="searchcontainer">
          <span class="meal-navigate" data-id="${meal.idMeal}">${
        meal.strMeal
      }</span>
          <button class="favorite-btn ${
            isFavorited ? "favorited" : ""
          }" data-id="${meal.idMeal}">
                <i class="fas fa-heart"></i>
            </button>
        </div>
      `;

      // Add an event listener to each list item for navigation and favoriting functionality
      listItem.addEventListener("click", (event) => {
        // Navigate to the meal's details page if the meal name is clicked
        const mealNameElement = event.target.closest(".meal-navigate");
        if (mealNameElement) {
          const mealId = mealNameElement.dataset.id;
          if (mealId) {
            window.location.href = `../details.html?id=${mealId}`;
          }
        }
        // Toggle the favorite status of the meal if the favorite button is clicked
        const addButton = event.target.closest(".favorite-btn");
        if (addButton) {
          const mealId = addButton.dataset.id;
          if (mealId) {
            toggleFavorite(mealId, addButton);
          }
        }
      });
      // Append the list item to the autocomplete list
      autocompleteList.appendChild(listItem);
    });
  } else {
    // If no meals are found, display a "No results found" message
    const listItem = document.createElement("li");
    listItem.textContent = "No results found";
    autocompleteList.appendChild(listItem);
  }
}

// Function to toggle the favorite status of a meal
async function toggleFavorite(mealId, button) {
  // Retrieve the list of favorite meals from localStorage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const mealIndex = favorites.findIndex((meal) => meal.idMeal === mealId);

  if (mealIndex === -1) {
    // If the meal is not in the favorites list, fetch its details and add it to the list
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await res.json();
    const meal = data?.meals[0];

    favorites.push(meal);
    button.classList.add("favorited");
  } else {
    // If the meal is already in the favorites list, remove it from the list
    favorites = favorites.filter((meal) => meal.idMeal !== mealId);
    button.classList.remove("favorited");
  }

  // Update the favorites list in localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
