import { registerUser } from '../../services/users.services';
import { IUser } from '../../interfaces/user.interface';
import { SYSTEM_REQ_ID } from '../../utils';

describe('user model tests', () => {
    test('isAdmin flag not set', async () => {
        const userTest = {
            email: 'adminfalse@gmail.com',
            password: 'admin123',
        } as IUser;

        const res = await registerUser(userTest, SYSTEM_REQ_ID);

        expect(res).toHaveProperty('isAdmin', false);
    });

    test('phoneNumber test', async () => {
        const userTest = {
            email: 'is_admin@gmail.com',
            password: 'admin123',
        } as IUser;

        const res = await registerUser(userTest, SYSTEM_REQ_ID);

        expect(res).toHaveProperty('phoneNumber', 'empty');
    });
});
