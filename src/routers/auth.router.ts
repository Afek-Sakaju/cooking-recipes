import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { logger } from '../utils';
import {
    registerUserCtrl,
    updateUserDataCtrl,
} from '../controllers/users.controller';
import { isAuthenticatedMW } from '../middleware';

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
 *         description: Returns user that have logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/user"
 *       500:
 *          description: "Server error"
 *
 */
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/',
    })
);

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
 *          description: Error in the logout process
 */
router.post('/logout', (req, res, next) => {
    req.logout(() => {
        logger.debug(req.id, 'Logout API request redirected to home page');
        res.redirect('/');
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
