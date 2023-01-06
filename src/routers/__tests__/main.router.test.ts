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
                expect(res).toHaveProperty('text', 'welcome my friend');
                done();
            });
    });

    test('responds success API with unauthorized user message and status 401', async () => {
        try {
            const res = await request(app).get('/success').expect(401);

            expect(res).toHaveProperty(
                'text',
                'You must login order to complete the operation'
            );
        } catch (e) {}
    });

    test('responds success API with success message and status 202', async () => {
        try {
            const res = await request(app)
                .get('/success')
                .set('Cookie', [cookie])
                .expect(202);

            expect(res).toHaveProperty('text', 'logged in successfuly');
        } catch (e) {
            console.log('hey');
        }
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
