import express, {
    ErrorRequestHandler,
    Request,
    Response,
    NextFunction,
} from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import './config/passport-config';

import mainRouter from './routers/main.router';
import authRouter from './routers/auth.router';
import recipesRouter from './routers/recipes.router';
import { connectDB } from './DB/mongoose';
//example : npm install --save--dev  @types/passport

const url: string = 'mongodb://127.0.0.1:27017/cook-site';
connectDB(url);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'shalom!',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use(express.static(path.join(__dirname, '.', 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', mainRouter);
app.use('/auth', authRouter);
app.use('/recipe', recipesRouter);

app.use(
    (
        err: ErrorRequestHandler,
        req: Request,
        _res: Response,
        next: NextFunction
    ) => {
        console.error(
            `${req.method}:${req.originalUrl}, failed with error:${err}`
        );
        next(err);
    }
);

const port: number = 3001;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
