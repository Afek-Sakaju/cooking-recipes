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
 *     tags: ['Main operations']
 *     description: Default api
 *     responses:
 *       200:
 *         description: Returns welcome message
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    logger.debug(req.id, 'call to API', {
        method: req.method,
        originalUrl: req.originalUrl,
    });

    res.status(200).send('welcome my friend');
});

/**
 * @swagger
 * /health:
 *   get:
 *     tags: ['Main operations']
 *     description: Get health server status
 *     responses:
 *       200:
 *         description: Returns OK
 */
router.get('/health', (req: Request, res: Response, next: NextFunction) => {
    logger.info(req.id, 'Server sent health status to user');
    res.sendStatus(200).send('OK');
});

export default router;
