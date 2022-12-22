module.exports = {
    async up(db, client) {
        await db.collection('users').instertMany([
            {
                name: 'roasted-salmon',
                creator: 'george',
                ingredients: 'salmon,kale,olive-oil,salt,pepper',
                cookingTime: 60,
                difficulityLevel: 'medium',
                createdAt: Date.now(),
                updatedAt: null,
            },
            {
                name: 'chicken-burger',
                creator: 'gordon-ram-z',
                ingredients:
                    'grinded-chicken-breast,lattuce,canola-oil,salt,chilli',
                cookingTime: 50,
                difficulityLevel: 'hard',
                createdAt: Date.now(),
                updatedAt: null,
            },
            {
                name: 'simple-salad',
                creator: 'noel',
                ingredients: 'cucumber,tomato,red-onion,pepper,salt,olive-oil',
                cookingTime: 30,
                difficulityLevel: 'easy',
                createdAt: Date.now(),
                updatedAt: null,
            },
            {
                name: 'vegan-hamburger',
                creator: 'george',
                ingredients:
                    'portabelo-mushrooms,red-pepper,olive-oil,salt,egg,bread',
                cookingTime: 5,
                difficulityLevel: 'hard',
                createdAt: Date.now(),
                updatedAt: null,
            },
            {
                name: 'omlette',
                creator: 'danny',
                ingredients: 'eggs,black-pepper,salt,coconut-oil',
                cookingTime: 120,
                difficulityLevel: 'medium',
                createdAt: Date.now(),
                updatedAt: null,
            },
        ]);
    },

    async down(db, client) {
        await db.collection('users').deleteMany({});
    },
};
