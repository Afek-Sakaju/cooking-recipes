import express, { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

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
    logger.debug(req.id, 'call to API', {
        method: req.method,
        originalUrl: req.originalUrl,
    });

    res.send('welcome everyone');
});

/**
 * @swagger
 * /health:
 *   get:
 *     tags: ['Main routers']
 *     description: Send the server's status to the user
 *     responses:
 *       200:
 *
 */
router.get('/health', (req: Request, res: Response, next: NextFunction) => {
    logger.info(req.id, 'Server sent health status to user');
    res.sendStatus(200);
});

export default router;
