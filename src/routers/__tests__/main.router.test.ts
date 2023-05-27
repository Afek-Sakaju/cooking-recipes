import request from 'supertest';

import app from '../../app';

describe('main router tests', () => {
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

    test('responds home page API with welcome message and status 200', async () => {
        const response = await request(app).get('/').expect(200);

        expect(response).toHaveProperty('text', 'Welcome');
    });

    test('responds health API with OK and status 200', async () => {
        const response = await request(app).get('/health').expect(200);

        expect(response).toHaveProperty('text', 'OK');
    });
});
