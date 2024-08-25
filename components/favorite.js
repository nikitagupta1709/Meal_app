// Wait until the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve the list of favorite meals from localStorage, or initialize an empty array if none exist
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Get the container element where favorite meals will be displayed
  const favContainer = document.getElementById("favorites-list");

  // Check if there are any favorite meals in the list
  if (favorites?.length > 0) {
    // Loop through each favorite meal and create a corresponding HTML element
    favorites.forEach((meal) => {
      const favoriteItem = document.createElement("div");
      favoriteItem.className = "favorite-item";

      // Set the inner HTML of the favorite item, including image, name, category, and area
      favoriteItem.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3 class="meal-name" data-id="${meal.idMeal}">
        ${
          meal.strMeal.length > 12
            ? `${meal.strMeal.substring(0, 12)}...`
            : meal.strMeal
        }
        </h3>
        <p>${meal.strCategory}</p>
        <p>${meal.strArea}</p>
        <button class="remove-favorite" data-id="${
          meal.idMeal
        }"><i class="fas fa-heart-broken"></i></button>
      `;

      // Append the favorite item to the container
      favContainer.appendChild(favoriteItem);
    });

    // Add event listener to handle click events within the favorites container
    favContainer.addEventListener("click", (event) => {
      // Check if the clicked element is a meal name
      const mealNameElement = event.target.closest(".meal-name");
      // Check if the clicked element is a remove button
      const removeButton = event.target.closest(".remove-favorite");

      // If a meal name is clicked, navigate to the meal details page
      if (mealNameElement) {
        const mealId = mealNameElement.dataset.id;
        if (mealId) {
          window.location.href = `../details.html?id=${mealId}`;
        }
      }

      // If a remove button is clicked, remove the meal from favorites
      if (removeButton) {
        const mealId = removeButton.dataset.id;
        if (mealId) {
          removeFavorite(mealId);
          // Remove the meal item from the DOM
          removeButton.closest(".favorite-item").remove();
        }
      }
    });
  } else {
    // If no favorite meals are found, display a message
    favContainer.innerHTML = `
      <p class="no-data">No meals found!! Please search and add meals. </p>
    `;
  }
});

// Function to remove a meal from the favorites list
function removeFavorite(mealId) {
  // Retrieve the current list of favorite meals from localStorage
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Filter out the meal that needs to be removed
  const updatedFavorites = favorites.filter((meal) => meal.idMeal !== mealId);

  // Update the localStorage with the new list of favorites
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

  // Get the container element for the favorites list
  const favContainer = document.getElementById("favorites-list");

  // If no favorite meals are left, display a message
  if (updatedFavorites?.length === 0) {
    favContainer.innerHTML = "<p>No favorite meals found.</p>";
  }
}
