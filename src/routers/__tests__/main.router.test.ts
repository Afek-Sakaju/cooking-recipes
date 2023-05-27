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

    test('responds success API with authorized user get status 202', async () => {
        const response = await request(app)
            .get('/success')
            .set('Cookie', [cookie])
            .expect(202);

        expect(response).toHaveProperty('text', 'Logged in successfully');
    });

    test('responds success API with unauthorized user get status 401', async () => {
        const response = await request(app).get('/success').expect(401);

        expect(response).toHaveProperty(
            'text',
            'You must login order to complete the operation'
        );
    });

    test('responds health API with OK and status 200', async () => {
        const response = await request(app).get('/health').expect(200);

        expect(response).toHaveProperty('text', 'OK');
    });
});
