const recipesList = fetchRecipes();
const getRecipesButton = document.getElementById('recipesButton');
const container = document.getElementById('recipesContainer');

function fetchRecipes() {
    return new Promise(async (res, rej) => {
        await fetch('/recipe/all')
            .then((res) => res.json())
            .then((data) => {
                res(data);
            })
            .catch((err) => reject(err));
    });
}

function insertRecipes(recipes, element) {
    Array.from(recipes).forEach((recipe) => {
        const p = document.createElement('p');
        p.appendChild(recipe.name);
    });
}

getRecipesButton.addEventListener('click', () => {
    console.log(1);
    insertRecipes(recipesList, container);
    console.log(2);
});
