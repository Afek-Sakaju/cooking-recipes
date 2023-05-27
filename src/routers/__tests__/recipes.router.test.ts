import request from 'supertest';

import app from '../../app';
import { IRecipe } from '../../interfaces';

describe('recipes router tests', () => {
    let cookie: string;

    beforeAll(async () => {
        const userData = {
            username: 'adminafek@walla.co.il',
            password: 'admin',
        };

        const result = await request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send(userData)
            .expect(200);

        [cookie] = result.headers['set-cookie'];
    });

    test('get all recipes API - success', async function () {
        {
            const result = await request(app).get('/recipe/all').expect(200);
            const resultRecipes: IRecipe[] = result.body;

            const recipesCount = 5;

            expect(recipesCount).toBe(resultRecipes.length);
        }
    });

    test('get filtered recipes API - success', async function () {
        {
            const url = '/recipe?page=1&itemsPerPage=10&difficultyLevel=medium';

            const {
                body: [[{ data: filteredList }]],
            } = await request(app).get(url).set('Cookie', [cookie]).expect(200);

            expect(filteredList).toBeDefined();
            expect(filteredList.length).toBe(2);

            filteredList.forEach((r: IRecipe) => {
                expect(r).toHaveProperty('difficultyLevel', 'medium');
            });
        }
        {
            const minCookingTime = 50;
            const url = `/recipe?minCookingTime=${minCookingTime}`;

            const {
                body: [[{ data: filteredList }]],
            } = await request(app).get(url).set('Cookie', [cookie]).expect(200);

            expect(filteredList).toBeDefined();
            expect(filteredList.length).toBe(3);

            filteredList.forEach((r: IRecipe) => {
                expect(r.cookingTime).toBeGreaterThanOrEqual(minCookingTime);
            });
        }
        {
            const url = '/recipe?page=2&itemsPerPage=1&difficultyLevel=hard';

            const {
                body: [[{ data: filteredList }]],
            } = await request(app).get(url).set('Cookie', [cookie]).expect(200);

            expect(filteredList).toBeDefined();
            expect(filteredList.length).toBe(1);

            filteredList.forEach((r: IRecipe) => {
                expect(r).toHaveProperty('difficultyLevel', 'hard');
            });
        }
    });

    test('get filtered recipes API - failure - unauthenticated user/invalid query params', async function () {
        {
            const url = '/recipe?page=1&itemsPerPage=5&difficultyLevel=easy';

            await request(app).get(url).expect(401);
        }
        {
            const url = '/recipe?maxCookingTime=100';

            await request(app).get(url).expect(401);
        }
        {
            const url = '/recipe?name=omelette';

            await request(app).get(url).expect(401);
        }
        {
            const url = '/recipe?page=hello&itemsPerPage=abc';

            const {
                body: { data: response },
            } = await request(app).get(url).set('Cookie', [cookie]).expect(500);

            expect(response).toBeUndefined();
        }
        {
            const url = '/recipe?maxCookingTime=chilli';

            const {
                body: { data: response },
            } = await request(app).get(url).set('Cookie', [cookie]).expect(200);

            expect(response).toBeUndefined();
        }
        {
            const url = '/recipe?minCookingTime=chilli';

            const {
                body: { data: response },
            } = await request(app).get(url).set('Cookie', [cookie]).expect(200);

            expect(response).toBeUndefined();
        }
    });

    test('create new recipe API - success & delete it delete recipe API - success', async function () {
        const body = {
            name: 'pesto-pasta',
            ingredients: [
                'mixed-colors-pasta',
                'garlic',
                'olives',
                'lemon',
                'salt',
                'oil',
                'water',
            ],
            cookingTime: 70,
            difficultyLevel: 'hard',
        } as unknown as IRecipe;

        const { body: result } = await request(app)
            .post('/recipe/new-recipe')
            .set('Accept', 'application/json')
            .send(body)
            .set('Cookie', [cookie])
            .expect(201);

        expect(result.name).toBe(body.name);
        expect(result.creator).toBe(null);
        expect(result.ingredients).toEqual(body.ingredients);
        expect(result.cookingTime).toBe(body.cookingTime);
        expect(result.difficultyLevel).toBe(body.difficultyLevel);

        // Deleted to prevent unpredictable results in other tests
        const { body: deleteResult } = await request(app)
            .delete(`/recipe/${body.name}`)
            .set('Cookie', [cookie])
            .expect(200);

        expect(deleteResult).toEqual({});
    });

    test('create new recipe API - failure - unauthenticated user/recipe already exists', async function () {
        {
            const body = {
                name: 'sweet-apple',
                ingredients: ['red-apple', 'sugar', 'cinnamon'],
                cookingTime: 10,
                difficultyLevel: 'easy',
            } as unknown as IRecipe;

            const { body: result } = await request(app)
                .post('/recipe/new-recipe')
                .set('Accept', 'application/json')
                .send(body)
                .expect(401);

            expect(result).toEqual({});
        }
        {
            const body = {
                name: 'vegan-hamburger',
                ingredients: [
                    'mushrooms',
                    'red-pepper',
                    'olive-oil',
                    'salt',
                    'egg',
                    'bread',
                ],
                cookingTime: 15,
                difficultyLevel: 'hard',
            } as unknown as IRecipe;

            const { body: result } = await request(app)
                .post('/recipe/new-recipe')
                .set('Accept', 'application/json')
                .send(body)
                .set('Cookie', [cookie])
                .expect(500);

            expect(result).toBeFalsy();
        }
    });

    test('delete recipe API - failure - unauthenticated user/invalid recipe name', async function () {
        {
            const { body: deleteResult } = await request(app)
                .delete('/recipe/chicken-burger')
                .expect(401);

            expect(deleteResult).toEqual({});
        }
        {
            const { body: deleteResult } = await request(app)
                .delete('/recipe/4adas132sda')
                .set('Cookie', [cookie])
                .expect(400);

            expect(deleteResult).toEqual({});
        }
    });

    test('find recipe by name API - success', async function () {
        const { body: resultRecipe } = await request(app)
            .get('/recipe/find/vegan-hamburger')
            .expect(200);

        expect(resultRecipe).toBeDefined();
        expect(resultRecipe.name).toBe('vegan-hamburger');
        expect(resultRecipe.creator).toBe(null);
        expect(resultRecipe.ingredients).toEqual([
            'mushrooms',
            'red-pepper',
            'olive-oil',
            'salt',
            'egg',
            'bread',
        ]);
        expect(resultRecipe.cookingTime).toBe(15);
        expect(resultRecipe.difficultyLevel).toBe('hard');
    });

    test('find recipe by name API - failure - non existing recipe name', async function () {
        const { body: resultRecipe } = await request(app)
            .get('/recipe/find/non-existing-recipe-name')
            .expect(404);

        expect(resultRecipe).toBeFalsy();
    });

    test('update recipe API - success', async function () {
        const initialData = {
            name: 'omelette',
            ingredients: ['eggs', 'black-pepper', 'salt', 'coconut-oil'],
            cookingTime: 120,
            difficultyLevel: 'medium',
        };

        const newData = {
            name: 'omelette',
            cookingTime: 20,
            difficultyLevel: 'easy',
        } as unknown as IRecipe;

        const { body: updateResult1 } = await request(app)
            .put('/recipe/update')
            .set('Accept', 'application/json')
            .send(newData)
            .set('Cookie', [cookie])
            .expect(200);

        expect(updateResult1.name).toBe(newData.name);
        expect(updateResult1.creator).toBe(null);
        expect(updateResult1.ingredients).toEqual(initialData.ingredients);
        expect(updateResult1.cookingTime).toBe(newData.cookingTime);
        expect(updateResult1.difficultyLevel).toBe(newData.difficultyLevel);

        // Updated back to initial data, to prevent unpredictable results in other tests
        const { body: updateResult2 } = await request(app)
            .put('/recipe/update')
            .set('Accept', 'application/json')
            .send(initialData)
            .set('Cookie', [cookie])
            .expect(200);

        expect(updateResult2.name).toBe(initialData.name);
        expect(updateResult2.creator).toBe(null);
        expect(updateResult2.ingredients).toEqual(initialData.ingredients);
        expect(updateResult2.cookingTime).toBe(initialData.cookingTime);
        expect(updateResult2.difficultyLevel).toBe(initialData.difficultyLevel);
    });

    test('update recipe API - failure - unauthenticated user/recipe not exists', async function () {
        {
            const body = {
                name: 'kosher-bacon',
                ingredients: [
                    'holy-pig-meat',
                    'personal-permission-from-god',
                    'canola-oil',
                ],
                cookingTime: 240,
                difficultyLevel: 'hard',
            };

            const { body: updateResult } = await request(app)
                .put('/recipe/update')
                .set('Accept', 'application/json')
                .send(body)
                .set('Cookie', [cookie])
                .expect(400);

            expect(updateResult).toBeFalsy();
        }
        {
            const body = {
                name: 'omelette',
                cookingTime: 20,
                difficultyLevel: 'easy',
            };

            const { body: updateResult } = await request(app)
                .put('/recipe/update')
                .set('Accept', 'application/json')
                .send(body)
                .expect(401);

            expect(updateResult).toEqual({});
        }
    });
});
