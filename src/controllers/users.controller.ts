import { Request, Response, NextFunction } from 'express';
import { registerUser, updateUserData } from '../services/users.services';
import { IUser } from '../interfaces/user.interface';

export async function registerUserCtrl(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const user = {
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        fullName: req.body.fullName,
    } as unknown as IUser;

    const result = await registerUser(user);

    res.json(result);
}

export async function updateUserDataCtrl(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userData = {
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        fullName: req.body.fullName,
    } as unknown as IUser;

    //fix me
    const result = await updateUserData(userData);

    res.json(result);
}
