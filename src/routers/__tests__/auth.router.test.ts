import request from 'supertest';
import { Types } from 'mongoose';

import app from '../../app';

describe('auth router tests', () => {
    const migratedUserData = {
        username: 'adminafek@walla.co.il',
        password: 'admin',
    };
    let migratedUserId: string;

    test('login API & update API - success', async () => {
        const response = await request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send(migratedUserData)
            .expect(200);

        const { body: initialUser } = response;

        expect(initialUser).toBeDefined();
        expect(initialUser).toHaveProperty('_id');
        const [cookie] = response.headers['set-cookie'];
        migratedUserId = initialUser._id;

        const newData = {
            _id: migratedUserId,
            fullName: 'David',
            phoneNumber: '000-999-999',
        };

        const { body: updatedUser1 } = await request(app)
            .put('/auth/update')
            .set('Accept', 'application/json')
            .send(newData)
            .set('Cookie', [cookie])
            .expect(200);

        expect(updatedUser1.phoneNumber).toBe(newData.phoneNumber);
        expect(updatedUser1.fullName).toBe(newData.fullName);

        const initialData = {
            _id: migratedUserId,
            fullName: 'unknown',
            phoneNumber: 'empty',
        };
        // Reset the user with the initial data to prevent unpredictable results in other tests
        const { body: updatedUser2 } = await request(app)
            .put('/auth/update')
            .set('Accept', 'application/json')
            .send(initialData)
            .set('Cookie', [cookie])
            .expect(200);

        expect(updatedUser2.phoneNumber).toBe(initialData.phoneNumber);
        expect(updatedUser2.fullName).toBe(initialData.fullName);
    });

    test('login API - failure - incorrect/missing params', async () => {
        {
            const userData = {
                username: 'adminafek@walla.co.il',
                password: '123',
            };

            const response = await request(app)
                .post('/auth/login')
                .set('Accept', 'application/json')
                .send(userData)
                .expect(400);

            expect(response).toHaveProperty('text', 'Login failed');
        }
        {
            const userData = {
                username: 'unknown@unknown.noone',
                password: 'unknown',
            };

            const response = await request(app)
                .post('/auth/login')
                .set('Accept', 'application/json')
                .send(userData)
                .expect(400);

            expect(response).toHaveProperty('text', 'Login failed');
        }
        {
            const userData = { email: 'adminafek@walla.co.il' };

            const response = await request(app)
                .post('/auth/login')
                .set('Accept', 'application/json')
                .send(userData)
                .expect(400);

            expect(response).toHaveProperty('text', 'Login failed');
        }
        {
            const userData = { password: 'admin' };

            const response = await request(app)
                .post('/auth/login')
                .set('Accept', 'application/json')
                .send(userData)
                .expect(400);

            expect(response).toHaveProperty('text', 'Login failed');
        }
    });

    test('register API - success', async () => {
        const userData = {
            email: 'newUser333@gmail.com',
            password: 'NewUser333',
        };

        const { body: resultUser } = await request(app)
            .post('/auth/register')
            .set('Accept', 'application/json')
            .send(userData)
            .expect(201);

        expect(resultUser).toHaveProperty('_id');
        expect(resultUser.email).toBe(userData.email);
        // Password shouldn't be in the user data returned after registration
        expect(resultUser.password).toBeUndefined();
        expect(resultUser.phoneNumber).toBe('empty');
        expect(resultUser.fullName).toBe('unknown');
    });

    test('register API - failure - user already exists/missing required params', async () => {
        {
            const userData = {
                email: 'adminafek@walla.co.il',
                password: 'admin',
            };

            const { body: resultUser } = await request(app)
                .post('/auth/register')
                .set('Accept', 'application/json')
                .send(userData)
                .expect(500);

            expect(resultUser).toEqual({});
        }
        {
            const userData = { email: 'unusedEmail@walla.co.il' };

            const { body: resultUser } = await request(app)
                .post('/auth/register')
                .set('Accept', 'application/json')
                .send(userData)
                .expect(500);

            expect(resultUser).toEqual({});
        }
        {
            const userData = { password: '123!444' };

            const { body: resultUser } = await request(app)
                .post('/auth/register')
                .set('Accept', 'application/json')
                .send(userData)
                .expect(500);

            expect(resultUser).toEqual({});
        }
    });

    test('logout API - success', async () => {
        await request(app).post('/auth/logout').expect(200);
    });

    test('update API - failure - user not exists/missing required params/unauthenticated user', async () => {
        const response = await request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send(migratedUserData)
            .expect(200);
        const [cookie] = response.headers['set-cookie'];
        {
            const userData = {
                _id: new Types.ObjectId(),
                email: 'dandan31@walla.co.il',
                password: 'dan31dan',
                fullName: 'dan bezos',
            };

            const { body: resultUser } = await request(app)
                .put('/auth/update')
                .set('Accept', 'application/json')
                .send(userData)
                .set('Cookie', [cookie])
                .expect(400);

            expect(resultUser).toBeFalsy();
        }
        {
            const userData = {
                username: 'adminafek@walla.co.il',
                password: 'admin',
                fullName: 'admin bezos',
            };

            const { body: resultUser } = await request(app)
                .put('/auth/update')
                .set('Accept', 'application/json')
                .send(userData)
                .set('Cookie', [cookie])
                .expect(400);

            expect(resultUser).toBeFalsy();
        }
        {
            const userData = {
                _id: migratedUserId,
                username: 'adminafek@walla.co.il',
                password: 'admin',
                fullName: 'admin bezos',
            };
            const { body: resultUser } = await request(app)
                .put('/auth/update')
                .set('Accept', 'application/json')
                .send(userData)
                .expect(401);

            expect(resultUser).toEqual({});
        }
    });
});
