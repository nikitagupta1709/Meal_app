const search = document.getElementById("search");
const autocompleteList = document.getElementById("autocomplete-list");

function clearAutocompleteList() {
  autocompleteList.innerHTML = "";
}

async function searchedMeal(value) {
  if (!value) {
    clearAutocompleteList();
    return;
  }
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
  );
  const data = await res.json();
  showMealisList(data?.meals);
}

function debounce(func, delay) {
  let timeoutId;
  return (...prev) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...prev);
    }, delay);
  };
}

const debouncedSearch = debounce(searchedMeal, 500);

search.addEventListener("input", (event) => {
  const val = event.target.value;
  debouncedSearch(val);
});

document.addEventListener("click", (event) => {
  if (
    !search.contains(event.target) &&
    !autocompleteList.contains(event.target)
  ) {
    clearAutocompleteList();
  }
});

function showMealisList(meals) {
  clearAutocompleteList();
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (meals) {
    meals.forEach((meal) => {
      const isFavorited = favorites.some(
        (favorite) => favorite.idMeal === meal.idMeal
      );
      const listItem = document.createElement("li");

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
      listItem.addEventListener("click", (event) => {
        const mealNameElement = event.target.closest(".meal-navigate");
        if (mealNameElement) {
          const mealId = mealNameElement.dataset.id;
          if (mealId) {
            window.location.href = `../details.html?id=${mealId}`;
          }
        }
        const addButton = event.target.closest(".favorite-btn");
        if (addButton) {
          const mealId = addButton.dataset.id;
          if (mealId) {
            toggleFavorite(mealId, addButton);
          }
        }
      });
      autocompleteList.appendChild(listItem);
    });
  } else {
    const listItem = document.createElement("li");
    listItem.textContent = "No results found";
    autocompleteList.appendChild(listItem);
  }
}

async function toggleFavorite(mealId, button) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const mealIndex = favorites.findIndex((meal) => meal.idMeal === mealId);

  if (mealIndex === -1) {
    // Meal is not in favorites, add it
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await res.json();
    const meal = data?.meals[0];

    favorites.push(meal);
    button.classList.add("favorited");
  } else {
    // Meal is in favorites, remove it
    favorites = favorites.filter((meal) => meal.idMeal !== mealId);
    button.classList.remove("favorited");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}
