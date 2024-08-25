document.addEventListener("DOMContentLoaded", async () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favContainer = document.getElementById("favorites-list");
  if (favorites?.length > 0) {
    favorites.forEach((meal) => {
      const favoriteItem = document.createElement("div");
      favoriteItem.className = "favorite-item";

      favoriteItem.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3 class="meal-name" data-id="${meal.idMeal}">${meal.strMeal}</h3>
      <p>${meal.strCategory}</p>
      <p>${meal.strArea}</p>
      <button class="remove-favorite" data-id="${meal.idMeal}"><i class="fas fa-heart-broken"></i></button>
  `;

      favContainer.appendChild(favoriteItem);
    });
    favContainer.addEventListener("click", (event) => {
      const mealNameElement = event.target.closest(".meal-name");
      console.log("mealNameElement", mealNameElement);
      const removeButton = event.target.closest(".remove-favorite");
      console.log("removeButton", removeButton);
      if (mealNameElement) {
        const mealId = mealNameElement.dataset.id;
        if (mealId) {
          window.location.href = `../details.html?id=${mealId}`;
        }
      }

      // Handle remove favorite button click
      if (removeButton) {
        const mealId = removeButton.dataset.id;
        if (mealId) {
          removeFavorite(mealId);
          removeButton.closest(".favorite-item").remove();
        }
      }
    });
  } else {
    favContainer.innerHTML = "<p>No favorite meals found.</p>";
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
