import bcrypt from 'bcrypt';

import { UserModel } from '../models';
import { IUser } from '../interfaces';
import { logger } from '../utils';

export async function registerUser(
    user: IUser,
    requestId: string
): Promise<IUser | undefined> {
    logger.verbose(requestId, 'Running request to create new user to DB');

    const userDoc = new UserModel(user);

    const result: any = await userDoc.save();

    return result.toJSON();
}

export async function updateUserData(
    userData: IUser,
    requestId: string
): Promise<IUser | undefined> {
    if (userData.password !== undefined) {
        const salt = bcrypt.genSaltSync(10);
        userData.password = bcrypt.hashSync(userData.password, salt);
    }

    logger.verbose(requestId, 'Running request to update user data in DB');

    try {
        const result = (await UserModel.findOneAndUpdate(
            { _id: userData._id },
            {
                email: userData.email,
                password: userData.password,
                phoneNumber: userData.phoneNumber,
                fullName: userData.fullName,
            },
            { new: true, omitUndefined: true, upsert: false }
        )) as unknown as IUser;
        return result;
        // eslint-disable-next-line no-empty
    } catch (e) {}
}

export async function getUserWithPassword(
    mail: string,
    requestId: string
): Promise<IUser | undefined> {
    logger.verbose(
        requestId,
        'Running request to get user with password by email from DB'
    );

    const userDoc: any = await UserModel.findOne({ email: mail }).select(
        'email password'
    );

    return userDoc as unknown as IUser | undefined;
}

export async function findUserByEmail(userEmail: string, requestId: string) {
    logger.verbose(requestId, 'Running request to get user by email from DB');

    const userDoc = await UserModel.findOne({ email: userEmail });

    return userDoc as unknown as IUser | undefined;
}
