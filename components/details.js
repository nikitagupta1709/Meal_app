// Wait until the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", async () => {
  // Get the container element where the meal details will be displayed
  const mealDetailsContainer = document.getElementById("meal-details");

  // Show a loading message while fetching the meal data
  mealDetailsContainer.innerHTML = "... Loading";

  // Get the meal ID from the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const mealId = urlParams.get("id");

  // Check if a meal ID is present in the URL
  if (mealId) {
    try {
      // Fetch the meal details from TheMealDB API using the meal ID
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );
      const data = await res.json();
      const meal = data?.meals[0];

      // If meal data is retrieved successfully, display it
      if (meal) {
        // Format the instructions by replacing line breaks with <br> tags
        const instructionsFormatted = meal.strInstructions.replace(
          /\r\n/g,
          "<br>"
        );

        // Update the container with the meal details, including name, image, category, area, ingredients, and instructions
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

        // Get the favorite button element
        const favoriteButton = document.getElementById("favorite-button");

        // Update the favorite button state based on whether the meal is in the favorites list
        updateFavMeal(meal);

        // Add a click event listener to the favorite button to toggle the meal's favorite status
        favoriteButton.addEventListener("click", () => {
          toggleFavBtn(meal);
          updateFavMeal(meal);
        });
      } else {
        // If no meal data is found, display a message
        mealDetailsContainer.innerHTML = "<p>No meal selected</p>";
      }
    } catch (error) {
      // Handle errors (e.g., network issues) if needed
    }
  }
});

// Function to generate the list of ingredients and measurements for the meal
function getIngredientsList(meal) {
  let ingredientsList = "";

  // Loop through up to 20 possible ingredients and measurements
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient) {
      // Append each ingredient and its measurement to the list
      ingredientsList += `<li>${ingredient} - ${measure}</li>`;
    }
  }

  return ingredientsList;
}

// Function to update the favorite button state based on whether the meal is in the favorites list
function updateFavMeal(meal) {
  // Retrieve the list of favorite meals from localStorage
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];

  // Check if the meal is already in the favorites list
  const isFavs = favs.some((fav) => fav.idMeal === meal.idMeal);

  // Get the favorite button element
  const favBtn = document.getElementById("favorite-button");

  // Update the button's appearance based on whether the meal is in the favorites list
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

// Function to toggle the meal's favorite status
function toggleFavBtn(meal) {
  // Retrieve the list of favorite meals from localStorage
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];

  // Check if the meal is already in the favorites list
  const mealIndex = favs.findIndex((fav) => fav.idMeal === meal.idMeal);

  // If the meal is not in the favorites list, add it; otherwise, remove it
  if (mealIndex === -1) {
    favs.push(meal);
  } else {
    favs.splice(mealIndex, 1);
  }

  // Update the favorites list in localStorage
  localStorage.setItem("favorites", JSON.stringify(favs));
}
