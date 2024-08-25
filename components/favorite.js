document.addEventListener("DOMContentLoaded", async () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favContainer = document.getElementById("favorites-list");
  if (favorites?.length > 0) {
    favorites.forEach((meal) => {
      const favoriteItem = document.createElement("div");
      favoriteItem.className = "favorite-item";

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

      favContainer.appendChild(favoriteItem);
    });
    favContainer.addEventListener("click", (event) => {
      const mealNameElement = event.target.closest(".meal-name");
      const removeButton = event.target.closest(".remove-favorite");
      if (mealNameElement) {
        const mealId = mealNameElement.dataset.id;
        if (mealId) {
          window.location.href = `../details.html?id=${mealId}`;
        }
      }

      if (removeButton) {
        const mealId = removeButton.dataset.id;
        if (mealId) {
          removeFavorite(mealId);
          removeButton.closest(".favorite-item").remove();
        }
      }
    });
  } else {
    favContainer.innerHTML = `
      <p class="no-data">No meals found!! Please search and add meals. </p>
    `;
  }
});

function removeFavorite(mealId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const updatedFavorites = favorites.filter((meal) => meal.idMeal !== mealId);
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  const favContainer = document.getElementById("favorites-list");
  if (updatedFavorites?.length === 0) {
    favContainer.innerHTML = "<p>No favorite meals found.</p>";
  }
}
