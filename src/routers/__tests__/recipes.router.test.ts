import request from 'supertest';

import app from '../../app';
import { IRecipe } from '../../interfaces';
import { RecipeModel } from '../../models';

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
            .expect(302);

        expect(result).toBeDefined();

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

    test('create new recipe API - success', async function () {
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
        const deleteResult = await RecipeModel.findOneAndDelete({
            name: body.name,
        });
        expect(deleteResult).toBeDefined();
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
                cookingTime: 5,
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
});