let recipesList = [];
fetchRecipes().then((data) => (recipesList = data));

const getRecipesButton = document.getElementById('allRecipesButton');
const container = document.getElementById('recipesTable');

function fetchRecipes() {
    return new Promise(async (res, rej) => {
        await fetch('/recipe/all')
            .then((res) => res.json())
            .then((data) => res(data))
            .catch((err) => reject(err));
    });
}

function insertRecipes(recipes, element) {
    let tableRow = [];

    Array.from(recipes).forEach((recipe) => {
        tableRow.push('<tr>');
        tableRow.push(
            `<td class="recipeName"><p class="tableText">${recipe.name}</p></td>`
        );
        tableRow.push(
            `<td class="longData"><p class="tableText">${recipe.ingredients}</p></td>`
        );
        tableRow.push(
            `<td><p class="tableText">${recipe.cookingTime}</p></td>`
        );
        tableRow.push(
            `<td><p class="tableText">${recipe.difficulity}</p></td>`
        );
        tableRow.push(`<td><p class="tableText">${recipe.creator} </p></td>`);
        tableRow.push('</tr>');
    });

    element.innerHTML += tableRow.join('');
    dataInContainer = dataTypeIds.all;
}

getRecipesButton.addEventListener('click', () => {
    if (dataInContainer !== dataTypeIds.all) {
        insertRecipes(recipesList, container);
    } else alert("It seem's like you already have this data");
});
