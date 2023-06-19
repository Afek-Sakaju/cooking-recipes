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
 *     description: Login to the server with username(email) and password
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
 *                          type: string
 *                          example: "tempexample@somemail.com"
 *                      password:
 *                          type: String
 *                          example: "somePassword123"
 *     responses:
 *       200:
 *         description: Login success, returns authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/user"
 *       400:
 *          description: Login failed
 *       500:
 *          description: Server error
 *
 */
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: IUser) => {
        if (!user || err) return res.status(400).send('Login failed');

        req.login(user, (err) => {
            if (err) return res.status(500).send('Server error');
            return res.status(200).send(user);
        });
    })(req, res, next);
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: ['Auth routers']
 *     description: Logout from the server
 *     responses:
 *       200:
 *           description: Logout successfully
 *       500:
 *          description: Server error
 */
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout((err: Error) => {
        if (err) return res.status(500).send('Server error');
        return res.status(200).send('Logout successfully');
    });
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: ['Auth routers']
 *     description: Registration of new user to the site
 *     requestBody:
 *        description: The user's data
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
 *         description: Registered successfully, returns the registered user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/user"
 *       500:
 *         description: Server error
 */
router.post('/register', registerUserCtrl);

/**
 * @swagger
 * /auth/update:
 *   put:
 *     tags: ['Auth routers']
 *     description: Update user's data by id
 *     security:
 *        cookieAuth:
 *          - connect.sid
 *     requestBody:
 *        description: The user's data
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: [ "id" ]
 *                  properties:
 *                      _id:
 *                          type: string
 *                          example: "insertId"
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
 *         description: Updated successfully, returns the updated data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/user"
 *       400:
 *         description: Update failed
 *       401:
 *         description: Unauthenticated user
 *
 */
router.put('/update', isAuthenticatedMW, updateUserDataCtrl);

export default router;
