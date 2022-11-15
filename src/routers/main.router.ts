import express, { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import path from 'path';

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
 * /:
 *   get:
 *     tags: ['Main routers']
 *     description: Send the home page to the user
 *     responses:
 *       302:
 *
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    logger.info(req.id, 'User redirected to login page');
    res.sendFile(
        path.resolve(__dirname, '../..', 'client', 'htmls', 'home.html')
    );
});

/**
 * @swagger
 * /recipes-list:
 *   get:
 *     tags: ['Main routers']
 *     description: Send the recipes page to the user
 *     responses:
 *       302:
 *
 */
router.get(
    '/recipes-list',
    (req: Request, res: Response, next: NextFunction) => {
        logger.info(req.id, 'User redirected to recipes page');
        res.sendFile(
            path.resolve(__dirname, '../..', 'client', 'htmls', 'recipes.html')
        );
    }
);

/**
 * @swagger
 * /health-status:
 *   get:
 *     tags: ['Main routers']
 *     description: Send the health-status page to the user
 *     responses:
 *       302:
 *
 */
router.get(
    '/health-status',
    (req: Request, res: Response, next: NextFunction) => {
        logger.info(req.id, 'Server sent user to health-status page');
        res.sendFile(
            path.resolve(__dirname, '../..', 'client', 'htmls', 'health.html')
        );
    }
);

/**
 * @swagger
 * /login:
 *   get:
 *     tags: ['Main routers']
 *     description: Send the login page to the user
 *     responses:
 *       302:
 *
 */
router.get('/login', (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(
        path.resolve(__dirname, '../..', 'client', 'htmls', 'login.html')
    );
});

/**
 * @swagger
 * /register:
 *   get:
 *     tags: ['Main routers']
 *     description: Send the register page to the user
 *     responses:
 *       302:
 *
 */
router.get('/register', (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(
        path.resolve(__dirname, '../..', 'client', 'htmls', 'register.html')
    );
});

/**
 * @swagger
 * /health:
 *   get:
 *     tags: ['Main routers']
 *     description: Send the server's status to the user
 *     responses:
 *       302:
 *
 */
router.get('/health', (req: Request, res: Response, next: NextFunction) => {
    logger.info(req.id, 'Server sent health status to user');
    res.sendStatus(200);
});

export default router;
