import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import {
    registerUserCtrl,
    updateUserDataCtrl,
} from '../controllers/users.controller';
import { isAuthenticatedMW } from '../middleware/auth-middleware';

const router = express.Router();

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/recipe/green-salad',
    })
);

router.get(
    '/success',
    isAuthenticatedMW,
    (req: Request, res: Response, next: NextFunction) => {
        res.send('success');
    }
);

router.post('/register', registerUserCtrl);

router.put('/update', isAuthenticatedMW, updateUserDataCtrl);

export default router;
