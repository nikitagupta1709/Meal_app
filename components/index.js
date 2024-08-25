const search = document.getElementById("search");
const autocompleteList = document.getElementById("autocomplete-list");

let mealList = [];
async function searchedMeal(value) {
  if (!value) {
    autocompleteList.innerHTML = "";
    return;
  }
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
  );
  const data = await res.json();
  console.log("data", data?.meals);
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

function showMealisList(meals) {
  autocompleteList.innerHTML = "";
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (meals) {
    meals.forEach((meal) => {
      const isFavorited = favorites.some(
        (favorite) => favorite.idMeal === meal.idMeal
      );
      const listItem = document.createElement("li");
      // listItem.textContent = meal.strMeal;

      listItem.innerHTML = `
        <div class="searchcontainer">
          <span class="meal-navigate" data-id="${meal.idMeal}">${
        meal.strMeal
      }</span>
          ${
            isFavorited
              ? '<i class="far fa-heart"></i>'
              : '<i class="fas fa-heart add-favorite" data-id="${meal.idMeal}"></i>'
          }
        </div>
      `;
      listItem.addEventListener("click", (event) => {
        // search.value = meal.strMeal;
        // autocompleteList.innerHTML = "";
        // window.location.href = `../details.html?id=${meal.idMeal}`;
        // search.value = "";
        const mealNameElement = event.target.closest(".meal-navigate");
        console.log("mealNameElement", mealNameElement);
        const addButton = event.target.closest(".add-favorite");
        console.log("addButton", addButton);
        if (mealNameElement) {
          const mealId = mealNameElement.dataset.id;
          if (mealId) {
            window.location.href = `../details.html?id=${mealId}`;
          }
        }
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

function toggleFavorite(mealId, button) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const mealIndex = favorites.findIndex((meal) => meal.idMeal === mealId);

  if (mealIndex === -1) {
    // Meal is not in favorites, add it
    const meal = { idMeal: mealId };
    favorites.push(meal);
    button.classList.add("favorited");
  } else {
    // Meal is in favorites, remove it
    favorites = favorites.filter((meal) => meal.idMeal !== mealId);
    button.classList.remove("favorited");
  }

  console.log("favorites", favorites);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
