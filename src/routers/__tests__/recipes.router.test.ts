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

    test('get filtered recipes API - failure - unauthenticated user', async function () {
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
    });

    test('get filtered recipes API - failure - invalid query params', async function () {
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
});
