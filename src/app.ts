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
import { SYSTEM_REQ_ID } from './utils/consts';
import swaggerDocument from './config/swagger-docs.json';
import schemes from './models/swaggerSchemas';
import logger from './utils/logger';
import { requestID } from './middleware/requestID-middleware';
import { logAPI } from './middleware/requestID-middleware';

if (process.env.NODE_ENV !== 'test') {
    connectDB(MONGO_URL);
}

const app = express();

app.use(requestID());
app.use(logAPI);

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
        logger.error(SYSTEM_REQ_ID, 'Error occured in the server', {
            error: err,
            method: req.method,
            originalUrl: req.originalUrl,
        });
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
        logger.info(SYSTEM_REQ_ID, `Server is up`, {
            url: `http://localhost:${PORT}`,
            port: PORT,
        });
    });
}

export default app;
