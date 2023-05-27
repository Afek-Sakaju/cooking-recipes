import { Request, Response, NextFunction } from 'express';

import { registerUser, updateUserData } from '../services/users.services';
import { IUser } from '../interfaces';
import { logger } from '../utils';

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

    logger.info(req.id, 'Registering new user', {
        userData: user,
    });

    try {
        const result = await registerUser(user, req.id);

        logger.info(req.id, 'Registration of new user results', {
            user: result,
        });

        res.status(201).json(result);
    } catch (e: any) {
        next(e);
    }
}

export async function updateUserDataCtrl(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userData = {
        _id: req.body.id,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        fullName: req.body.fullName,
    } as unknown as IUser;

    logger.info(req.id, "Updating user's data", {
        newData: userData,
    });

    const result = await updateUserData(userData, req.id);

    logger.info(req.id, "Updating of user's data results", {
        user: result,
    });

    res.status(result ? 200 : 400).json(result);
}
