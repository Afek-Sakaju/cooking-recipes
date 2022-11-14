let recipes = [
    {
        _id: '631379106b61d9484ecea744',
        name: 'mac-and-cheese',
        creator: 'anonymous',
        ingredients: 'pasta,cheese,mushrooms,salt,pepper',
        cookingTime: '01:15',
        difficulityLevel: 'medium',
        createdAt: new Date('2022-09-03T15:56:00.232+0000'),
        updatedAt: new Date('2022-09-03T15:56:00.232+0000'),
    },
    {
        _id: '6313883afd1a3a0ecc264d75',
        name: 'spicy-mio-sauce',
        creator: 'anonymous',
        ingredients: 'mayo,black-pepper,chilli-powder',
        cookingTime: '00:10',
        difficulityLevel: 'easy',
        createdAt: new Date('2022-09-03T17:00:42.527+0000'),
        updatedAt: new Date('2022-09-03T17:00:42.527+0000'),
    },
    {
        _id: '634c5dfd38f770946df89192',
        name: 'steak-angos',
        creator: 'arnold-schwarzeneggerr',
        ingredients: 'angos-meat, olive-oil, salt, black-pepper',
        cookingTime: '01:45',
        difficulityLevel: 'easy',
        createdAt: new Date('2022-10-16T19:39:41.697+0000'),
        updatedAt: new Date('2022-10-16T19:39:41.697+0000'),
    },
];

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
