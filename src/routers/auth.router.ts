import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import {
    registerUserCtrl,
    updateUserDataCtrl,
} from '../controllers/users.controller';
import { isAuthenticatedMW } from '../middleware/auth-middleware';

const router = express.Router();

/**
 *  @swagger
 *  /auth/login
 *      post:
 *          tags: ['Auth routers']
 *          description: Login to the site
 *          requestBody:
 *              description: the username(mail) and user password
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required: [ "username", "password" ]
 *                          properties:
 *                              username:
 *                                  type: String
 *                                  example: tempexample@somemail.com
 *                              password:
 *                                  type: String
 *                                  example: somePassword123
 *      responses:
 *          200:
 *              description: Returns the requested user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemes/user"
 *       500:
 *          description: "Login error"
 * */
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/auth/success',
        failureRedirect: '/recipe/green-salad',
    })
);

router.get(
    '/success',
    isAuthenticatedMW,
    (req: Request, res: Response, next: NextFunction) => {
        res.send('successfuly logged in ');
    }
);

router.post('/register', registerUserCtrl);

router.put('/update', isAuthenticatedMW, updateUserDataCtrl);

export default router;
