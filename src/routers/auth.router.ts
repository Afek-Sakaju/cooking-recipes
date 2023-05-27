import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { logger } from '../utils';
import {
    registerUserCtrl,
    updateUserDataCtrl,
} from '../controllers/users.controller';
import { isAuthenticatedMW } from '../middleware';
import { IUser } from '../interfaces';

const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    logger.debug(req.id, 'Call to API', {
        method: req.method,
        originalUrl: req.originalUrl,
        body: req.body,
    });
    next();
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: ['Auth routers']
 *     description: login with user to the site
 *     requestBody:
 *        description: the user information for logging in
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: [ "username", "password" ]
 *                  properties:
 *                      username:
 *                          type: String
 *                          example: "tempexample@somemail.com"
 *                      password:
 *                          type: String
 *                          example: "somePassword123"
 *     responses:
 *       200:
 *         description: "Login successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/user"
 *       400:
 *          description: "Login failed"
 *       500:
 *          description: "Server Error"
 *
 */
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: IUser) => {
        if (!user || err) return res.status(400).send('Login failed');

        req.login(user, (err) => {
            if (err) return res.status(500).send('Server Error');
            return res.status(200).send(user);
        });
    })(req, res, next);
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: ['Auth routers']
 *     description: Logout from the application
 *     responses:
 *       200:
 *           description: Logout successfully
 *       500:
 *          description: Logout failed, server Error
 */
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout((err: Error) => {
        if (err) return res.status(500).send('Logout failed, server Error');
        return res.status(200).send('Logout successfully');
    });
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: ['Auth routers']
 *     description: register of new user to the site
 *     requestBody:
 *        description: the user information for registering
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: [ "username", "password" ]
 *                  properties:
 *                      email:
 *                          type: string
 *                          example: "tempexample@somemail.com"
 *                      password:
 *                          type: string
 *                          example: "somePassword123"
 *                      fullName:
 *                          type: string
 *                          example: "george-cohen"
 *                      phoneNumber:
 *                          type: string
 *                          example: "+888 88 888 8888"
 *     responses:
 *       201:
 *         description: Returns the registered user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/user"
 *
 */
router.post('/register', registerUserCtrl);

/**
 * @swagger
 * /auth/update:
 *   put:
 *     tags: ['Auth routers']
 *     description: update of user's data by id
 *     security:
 *        cookieAuth:
 *          - connect.sid
 *     requestBody:
 *        description: the user information for updating
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: [ "id" ]
 *                  properties:
 *                      id:
 *                          type: string
 *                      email:
 *                          type: string
 *                          example: "tempexample@somemail.com"
 *                      password:
 *                          type: string
 *                          example: "somePassword123"
 *                      fullName:
 *                          type: string
 *                          example: "george-cohen"
 *                      phoneNumber:
 *                          type: string
 *                          example: "+888 88 888 8888"
 *     responses:
 *       200:
 *         description: Returns the updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/user"
 *       400:
 *         description: Return message of the error that occurred in the updating process
 *
 */
router.put('/update', isAuthenticatedMW, updateUserDataCtrl);

export default router;
