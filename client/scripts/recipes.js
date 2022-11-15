let recipesList = [];
fetchRecipes().then((data) => (recipesList = data));

const getRecipesButton = document.getElementById('recipesButton');
const container = document.getElementById('recipesContainer');

function fetchRecipes() {
    return new Promise(async (res, rej) => {
        await fetch('/recipe/all')
            .then((res) => res.json())
            .then((data) => res(data))
            .catch((err) => reject(err));
    });
}

function insertRecipes(recipes, element) {
    Array.from(recipes).forEach((recipe) => {
        element.innerHTML += `<p>${recipe.name}</p>`;
    });
}

getRecipesButton.addEventListener('click', () => {
    insertRecipes(recipesList, container);
});
