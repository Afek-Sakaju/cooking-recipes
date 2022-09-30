import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user.model';
import { getUserPasswordByEmail } from '../services/users.services';
import { IUser, passportConfigUser } from '../interfaces/user.interface';
// note: postman should send in body only {username:"..", password:".."}
// (not allowed to write email ect..)

passport.use(
    new LocalStrategy(async (userEmail, password, done) => {
        const user: IUser | undefined = await getUserPasswordByEmail(userEmail);

        if (!user) return done('user not found', null);

        const matchedPassword = await bcrypt.compare(password, user.password);

        if (!matchedPassword) {
            return done('user not match password', null);
        }

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
