import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import {
    registerUserCtrl,
    updateUserDataCtrl,
} from '../controllers/users.controller';
import { isAuthenticatedMW } from '../middleware/auth-middleware';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: ['Auth routers']
 *     description: login with user to the site
 *     requestBody:
 *        description: the user information for loginng in
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
        successRedirect: '/auth/success',
        failureRedirect: '/public/login.html',
    })
);

/**
 * @swagger
 * /auth/success:
 *   get:
 *     tags: ['Auth routers']
 *     description: respond with message to the user that finished logging in
 *     responses:
 *       200:
 *         description: short message to the user that finished logging in
 *       302:
 *         description: the user haven't logged in successfuly
 *
 */
router.get(
    '/success',
    isAuthenticatedMW,
    (req: Request, res: Response, next: NextFunction) => {
        res.status(200).send('successfuly logged in ');
    }
);

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
 *       200:
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
 *     description: update of user's information
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
 *         description: Return message of the error that occured in the updating procces
 *
 */
router.put('/update', isAuthenticatedMW, updateUserDataCtrl);

export default router;
