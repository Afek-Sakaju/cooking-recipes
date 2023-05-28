import { Request, Response, NextFunction } from 'express';

import { registerUser, updateUserData } from '../services/users.services';
import { IUser } from '../interfaces';
import { logger } from '../utils';

export async function registerUserCtrl(
    req: Request,
    res: Response,
    _next: NextFunction
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
        const resultUser = await registerUser(user, req.id);

        logger.info(req.id, 'Registration of new user results', {
            user: resultUser,
        });
        res.status(201).json(resultUser);
    } catch (e) {
        res.sendStatus(500);
    }
}

export async function updateUserDataCtrl(
    req: Request,
    res: Response,
    _next: NextFunction
) {
    const userData = {
        _id: req.body._id,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        fullName: req.body.fullName,
    } as unknown as IUser;

    logger.info(req.id, "Updating user's data", {
        newData: userData,
    });

    const resultUser = await updateUserData(userData, req.id);

    logger.info(req.id, "Updating of user's data results", {
        user: resultUser,
    });
    res.status(resultUser ? 200 : 400).json(resultUser);
}
