import request from 'supertest';
import app from '../../app';

describe('main router tests', () => {
    test('health API check', (done) => {
        request(app)
            .get('/health')
            .expect('Location', 'https://youtu.be/t2NgsJrrAyM?t=101', done);
    });
});
