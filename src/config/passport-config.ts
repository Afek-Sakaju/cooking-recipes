import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import { UserModel } from '../models/user.model';
import { getUserWithPassword } from '../services/users.services';
import { IUser, passportConfigUser } from '../interfaces/user.interface';
import { SYSTEM_REQ_ID } from '../utils/consts';
import logger from '../utils/logger';

passport.use(
    new LocalStrategy(async (userEmail, password, done) => {
        const user: IUser | undefined = await getUserWithPassword(
            userEmail,
            SYSTEM_REQ_ID
        );

        if (!user) {
            logger.info(SYSTEM_REQ_ID, 'Username not found');
            return done('user not found', null);
        }

        const matchedPassword = await bcrypt.compare(password, user.password);

        if (!matchedPassword) {
            logger.info(SYSTEM_REQ_ID, "Username's password not matched", {
                username: userEmail,
                password: password,
            });
            return done('user not match password', null);
        }

        logger.info(SYSTEM_REQ_ID, 'Username login successfully', {
            username: userEmail,
        });
        done(null, user);
    })
);

passport.serializeUser((user: passportConfigUser | null, done: Function) => {
    done(null, user?._id);
});

passport.deserializeUser(async (id: string, done: Function) => {
    const user = await UserModel.findById(id);
    if (!user) done('user not found', null);
    else done(null, user);
});
