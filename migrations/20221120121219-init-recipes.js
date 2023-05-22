const ISODate = (date) => new Date(date);
const NumberInt = (num) => num;

/* Dont change\add-to this recipes data! 
the tests built with this speciefic data */
module.exports = {
    async up(db, client) {
        /* const adminUser = await db
            .collection('users')
            .findOne({ username: 'admin' });

        const ObjectId = (id) => ownerUser._id; */
        await db.collection('recipes').insertMany([
            {
                name: 'roasted-salmon',
                creator: null,
                ingredients: ['salmon', 'kale', 'olive-oil', 'salt', 'pepper'],
                cookingTime: 60,
                difficultyLevel: 'medium',
                createdAt: ISODate('2023-01-06T17:00:45.774+0000'),
                updatedAt: ISODate('2023-01-06T17:00:45.774+0000'),
                __v: NumberInt(0),
            },
            {
                name: 'chicken-burger',
                creator: null,
                ingredients: [
                    'grinded-chicken-breast',
                    'lattuce',
                    'canola-oil',
                    'salt',
                    'chilli',
                ],
                cookingTime: 50,
                difficultyLevel: 'hard',
                createdAt: ISODate('2023-01-06T17:00:45.774+0000'),
                updatedAt: ISODate('2023-01-06T17:00:45.774+0000'),
                __v: NumberInt(0),
            },
            {
                name: 'simple-salad',
                creator: null,
                ingredients: [
                    'cucumber',
                    'tomato',
                    'red-onion',
                    'pepper',
                    'salt',
                    'olive-oil',
                ],
                cookingTime: 30,
                difficultyLevel: 'easy',
                createdAt: ISODate('2023-01-06T17:00:45.774+0000'),
                updatedAt: ISODate('2023-01-06T17:00:45.774+0000'),
                __v: NumberInt(0),
            },
            {
                name: 'vegan-hamburger',
                creator: null,
                ingredients: [
                    'portabelo-mushrooms',
                    'red-pepper',
                    'olive-oil',
                    'salt',
                    'egg',
                    'bread',
                ],
                cookingTime: 5,
                difficultyLevel: 'hard',
                createdAt: ISODate('2023-01-06T17:00:45.774+0000'),
                updatedAt: ISODate('2023-01-06T17:00:45.774+0000'),
                __v: NumberInt(0),
            },
            {
                name: 'omlette',
                creator: null,
                ingredients: ['eggs', 'black-pepper', 'salt', 'coconut-oil'],
                cookingTime: 120,
                difficultyLevel: 'medium',
                createdAt: ISODate('2023-01-06T17:00:45.774+0000'),
                updatedAt: ISODate('2023-01-06T17:00:45.774+0000'),
                __v: NumberInt(0),
            },
        ]);
    },

    async down(db, client) {
        await db.collection('recipes').deleteMany({});
    },
};
