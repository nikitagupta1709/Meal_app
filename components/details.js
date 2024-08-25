document.addEventListener("DOMContentLoaded", async () => {
  const mealDetailsContainer = document.getElementById("meal-details");
  const urlParams = new URLSearchParams(window.location.search);
  const mealId = urlParams.get("id");
  if (mealId) {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );
      const data = await res.json();
      console.log("meal", data);
      const meal = data?.meals[0];
      if (meal) {
        const instructionsFormatted = meal.strInstructions.replace(
          /\r\n/g,
          "<br>"
        );

        mealDetailsContainer.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="favContainer">
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <button id="favorite-button" class="favorite-button">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <p><strong>Area:</strong> ${meal.strArea}</p>
            <h3>Ingredients:</h3>
            <ul>
            ${getIngredientsList(meal)}
            </ul>
            <h3>Instructions:</h3>
            <p>${instructionsFormatted}</p>      
            `;

        const favoriteButton = document.getElementById("favorite-button");

        updateFavMeal(meal);
        favoriteButton.addEventListener("click", () => {
          toggleFavBtn(meal);
          updateFavMeal(meal);
        });
      } else {
        mealDetailsContainer.innerHTML = "<p>No meal selected</p>";
      }
    } catch (error) {}
  }
});

function getIngredientsList(meal) {
  let ingredientsList = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient) {
      ingredientsList += `<li>${ingredient} - ${measure}</li>`;
    }
  }

  return ingredientsList;
}

function updateFavMeal(meal) {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  const isFavs = favs.some((fav) => fav.idMeal === meal.idMeal);

  const favBtn = document.getElementById("favorite-button");
  if (isFavs) {
    favBtn.classList.add("active");
    favBtn.querySelector("i").classList.remove("far");
    favBtn.querySelector("i").classList.add("fas");
  } else {
    favBtn.classList.remove("active");
    favBtn.querySelector("i").classList.add("far");
    favBtn.querySelector("i").classList.remove("fas");
  }
}

function toggleFavBtn(meal) {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  const mealIndex = favs.findIndex((fav) => fav.idMeal === meal.idMeal);
  if (mealIndex === -1) {
    favs.push(meal);
  } else {
    favs.splice(mealIndex, 1);
  }
  console.log("favs", favs);
  localStorage.setItem("favorites", JSON.stringify(favs));
}
