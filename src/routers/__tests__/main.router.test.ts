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
            .expect(302);

        expect(result).toBeDefined();

        [cookie] = result.headers['set-cookie'];
    });

    test('responds home page API with welcome message and status 200', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .end((err, res) => {
                expect(res).toHaveProperty('text', 'Welcome');
                done();
            });
    });

    test('responds success API with unauthorized user get status 401', (done) => {
        request(app)
            .get('/success')
            .expect(401)
            .end((err, res) => {
                expect(res).toHaveProperty(
                    'text',
                    'You must login order to complete the operation'
                );
                done();
            });
    });

    test('responds success API with authorized user get status 202', (done) => {
        request(app)
            .get('/success')
            .set('Cookie', [cookie])
            .expect(202)
            .end((err, res) => {
                expect(res).toHaveProperty('text', 'Logged in successfully');
                done();
            });
    });

    test('responds health API with OK and status 200', (done) => {
        request(app)
            .get('/health')
            .expect(200)
            .end((err, res) => {
                expect(res).toHaveProperty('text', 'OK');
                done();
            });
    });
});
