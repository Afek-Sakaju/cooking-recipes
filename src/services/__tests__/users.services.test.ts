import { IUser } from '../../interfaces';
import { UserModel } from '../../models';
import { SYSTEM_REQ_ID } from '../../utils';
import {
    findUserByEmail,
    registerUser,
    updateUserData,
    getUserWithPassword,
} from '../users.services';

describe('users services tests', () => {
    const testUser = {
        email: 'testUser@walla.com',
        password: 'testUser123',
        fullName: 'patrick-stars',
    } as IUser;

    let userId: string;

    beforeAll(async () => {
        const userDoc = new UserModel(testUser);
        const resultUser = (await userDoc.save()) as unknown as IUser;

        expect(resultUser).toBeDefined();
        expect(resultUser).toHaveProperty('_id');
        userId = resultUser._id;
    });

    test('service registerUser returns user data without the password', async () => {
        const newUserData = {
            email: 'exampleMail@gmail.com',
            password: 'examplePass123',
            phoneNumber: '052 999 1111',
            fullName: 'example name',
        } as IUser;

        const resultUser = (await registerUser(
            newUserData,
            SYSTEM_REQ_ID
        )) as unknown as IUser;

        expect(resultUser).toBeDefined();
        expect(resultUser).toHaveProperty('_id');
        expect(resultUser.password).toBeUndefined();
        expect(resultUser.email).toBe(newUserData.email);
        expect(resultUser.fullName).toBe(newUserData.fullName);
        expect(resultUser.phoneNumber).toBe(newUserData.phoneNumber);
    });

    test('service updateUserData returns updated user data without the password', async () => {
        const newData = {
            _id: userId,
            email: 'updatedEmail222',
            password: 'updatedPass123',
            fullName: 'updated name',
        } as IUser;

        const resultUser = (await updateUserData(
            newData,
            SYSTEM_REQ_ID
        )) as unknown as IUser;

        expect(resultUser).toBeDefined();
        expect(resultUser).toHaveProperty('_id');
        expect(resultUser.password).toBeUndefined();
        expect(resultUser.email).toBe(newData.email);
        expect(resultUser.fullName).toBe(newData.fullName);
        expect(resultUser.phoneNumber).toBe('empty');

        // Updating back to initial data to prevent unpredictable results in other tests
        const resultUser2 = (await updateUserData(
            { ...testUser, _id: userId },
            SYSTEM_REQ_ID
        )) as unknown as IUser;

        expect(resultUser2).toBeDefined();
        expect(resultUser2).toHaveProperty('_id');
        expect(resultUser2.password).toBeUndefined();
        expect(resultUser2.email).toBe(testUser.email);
        expect(resultUser2.fullName).toBe(testUser.fullName);
        expect(resultUser2.phoneNumber).toBe('empty');
    });

    test('service findUserByEmail returns user data', async () => {
        const resultUser = (await findUserByEmail(
            testUser.email,
            SYSTEM_REQ_ID
        )) as unknown as IUser;

        expect(resultUser).toBeDefined();
        expect(resultUser).toHaveProperty('_id');
        expect(resultUser).toHaveProperty('password');
        expect(resultUser.email).toBe(testUser.email);
        expect(resultUser.fullName).toBe(testUser.fullName);
        expect(resultUser.phoneNumber).toBe('empty');
    });

    test("service getUserWithPassword returns user's email and password (crypted)", async () => {
        const resultUser = (await getUserWithPassword(
            testUser.email,
            SYSTEM_REQ_ID
        )) as unknown as IUser;

        const check = resultUser._id;
        expect(resultUser).toBeDefined();
        expect(resultUser).toHaveProperty('_id');
        expect(resultUser).toHaveProperty('password');
        expect(resultUser.email).toBe(testUser.email);
        expect(resultUser.fullName).toBeUndefined();
        /* The data returned should contain only email and password fields 
        so the phoneNumber is not going to be 'empty' even if its value*/
        expect(resultUser.phoneNumber).toBeUndefined();
    });
});
