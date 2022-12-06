import { UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/user.interface';
import logger from '../utils/logger';

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

    logger.verbose(requestId, "Running request to update user' data in DB");

    const result: any = await UserModel.findOneAndUpdate(
        { _id: userData._id },
        {
            email: userData.email,
            password: userData.password,
            phoneNumber: userData.phoneNumber,
            fullName: userData.fullName,
        },
        { new: true, omitUndefined: true, upsert: true }
    );

    return result.toJSON();
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
