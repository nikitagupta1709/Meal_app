# Meals Website

## Overview

This project is a dynamic web application designed to help users explore and discover a wide variety of meals from around the world. Users can search for meals, view detailed information, and save their favorite meals for easy access later. The app leverages TheMealDB API to provide comprehensive meal data, including ingredients, instructions, and images, making it a useful tool for food enthusiasts.

## Features

- **Search Functionality**:

  - Type a meal name into the search bar to find related meals.
  - Autocomplete suggestions appear as you type, offering quick access to meal options.
  - Search results are dynamically updated to display relevant meal options.

- **Meal Details**:

  - Click on a meal from the search results to view its detailed information.
  - The details page includes the meal's image, category, area (cuisine), ingredients list, and cooking instructions.
  - Users can mark meals as favorites directly from the details page.

- **Favorites Management**:

  - Add meals to your favorites by clicking the heart icon in the search results or on the meal details page.
  - Remove meals from your favorites by clicking the heart icon again.
  - Favorite meals are stored in the browser's local storage, ensuring they persist across sessions.
  - View your favorite meals by clicking the "My favourite meals" button in the navigation bar.

- **Responsive Design**:
  - The application is fully responsive, adapting seamlessly to various screen sizes and devices, including desktops, tablets, and smartphones.

## Project Structure

- `index.html`: The main landing page where users can search for meals.
- `details.html`: The details page where users can view detailed information about a selected meal.
- `favorite.html`: The favorites page where users can view and manage their saved meals.
- `index.css`: The main stylesheet for the application, providing styles for all pages.
- `components/index.js`: Handles the main page functionalities, including search and autocomplete.
- `components/details.js`: Manages the functionality for displaying meal details and handling favorite actions on the details page.
- `components/favorite.js`: Handles the functionality for displaying and managing the list of favorite meals.

## Code Explanation

### JavaScript Functionality

- **Search Autocomplete**:

  - The search bar is tied to a `debouncedSearch` function that delays the API call until the user stops typing (500ms delay). This prevents excessive API calls.
  - `searchedMeal(value)` function fetches meal data based on the user's input and populates the autocomplete list with matching results.
  - `showMealisList(meals)` function renders the list of search results, allowing users to select a meal or mark it as a favorite.

- **Meal Details Page**:

  - The page loads the meal's details based on the meal ID passed in the URL.
  - `getIngredientsList(meal)` dynamically creates a list of ingredients for the meal.
  - `updateFavMeal(meal)` checks if the meal is already in the favorites list and updates the UI accordingly.
  - `toggleFavBtn(meal)` adds or removes the meal from the favorites list when the heart button is clicked.

- **Favorites Management**:
  - On the favorites page, the app fetches the list of favorite meals from local storage and displays them.
  - Users can remove meals from their favorites directly from this page.
  - If no favorites are available, the app displays a message prompting users to add meals to their favorites.

## How to Use the Application

1. **Searching for Meals**:

   - Start by typing the name of a meal in the search bar on the main page. The app will suggest relevant meals in a dropdown list.
   - Click on any meal name to view its detailed information.

2. **Viewing Meal Details**:

   - On the details page, you can see all the information related to the meal, including its ingredients and instructions.
   - If you like the meal, click the heart icon to add it to your favorites.

3. **Managing Favorite Meals**:
   - Click the "My favourite meals" button in the navigation bar to view your saved meals.
   - You can remove meals from your favorites by clicking the heart-broken icon next to each meal.
   - The app will save your favorite meals in the browser's local storage, so they are available the next time you visit.

### Dependencies

- **TheMealDB API**: Provides the meal data used in the application.
- **FontAwesome**: Used for the icons, such as the heart icon for adding/removing favorites.

## Future Enhancements

- **User Authentication**: Allow users to create accounts and save their favorite meals across different devices.
- **Meal Categories**: Filter meals by categories like vegetarian, vegan, or gluten-free.
- **Meal Ratings**: Allow users to rate meals and see community ratings.
- **Recipe Sharing**: Enable users to share their favorite recipes on social media.

## Acknowledgements

- [TheMealDB](https://www.themealdb.com/) for providing the meal data API.
- [FontAwesome](https://fontawesome.com/) for the iconography used in the application.
- All contributors and users of G.T. Meals!
