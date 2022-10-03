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
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import './config/passport-config';
import mainRouter from './routers/main.router';
import authRouter from './routers/auth.router';
import recipesRouter from './routers/recipes.router';
import { MONGO_URL, PORT } from './utils/environment-variables';
import { connectDB } from './DB/mongoose';
import swaggerDocument from './config/swagger-docs.json';
import schemes from './models/swaggerSchemes';

if (process.env.NODE_ENV !== 'test') {
    connectDB(MONGO_URL);
}

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

if (process.env.NODE_ENV !== 'production') {
    //@ts-ignore
    swaggerDocument.swaggerDefinition.components.schemas = schemes;
}

const swaggerDocs = swaggerJsDoc(swaggerDocument);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
}

export default app;
