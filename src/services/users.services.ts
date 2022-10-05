import { UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/user.interface';

export async function registerUser(user: IUser): Promise<IUser | undefined> {
    const userDoc = new UserModel(user);

    const result: any = await userDoc.save();

    return result.toJSON();
}

export async function updateUserData(
    userData: IUser
): Promise<IUser | undefined> {
    if (userData.password !== undefined) {
        const salt = bcrypt.genSaltSync(10);
        userData.password = bcrypt.hashSync(userData.password, salt);
    }

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

export async function getUserPasswordByEmail(
    mail: string
): Promise<IUser | undefined> {
    const userDoc: any = await UserModel.findOne({ email: mail }).select(
        'email password'
    );

    return userDoc as unknown as IUser | undefined;
}

export async function findUserByEmail(userEmail: string) {
    const userDoc = await UserModel.findOne({ email: userEmail });

    return userDoc as unknown as IUser | undefined;
}
