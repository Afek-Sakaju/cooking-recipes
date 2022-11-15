let recipes = [];

function fetchRecipes() {
    return new Promise((resolve, reject) => {
        fetch('/recipe/all')
            .then((res) => res.json())
            .then((data) => {
                console.log('fetchRecipes', data);
                resolve(data);
            })
            .catch((err) => reject(err));
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Hello World!');
    recipes = await fetchRecipes();
    renderRecipes(recipes);
});

function renderRecipes(recipes) {
    const elements = recipes.map((r) => {
        const element = document.createElement('p');
        element.innerHTML = r.name;
        element.addEventListener('click', () =>
            alert(JSON.stringify(r, null, 4))
        );
        return element;
    });
    const container = document.getElementById('recipes-container');

    elements.forEach((e) => {
        container.append(e);
    });
}
