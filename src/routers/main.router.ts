import express, { Request, Response, NextFunction } from 'express';

import { logger } from '../utils';

const router = express.Router();

router.use((req: Request, _res: Response, next: NextFunction) => {
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
 *     description: Default API
 *     responses:
 *       200:
 *         description: Returns welcome message (string)
 */
router.get('/', (req: Request, res: Response, _next: NextFunction) => {
    logger.debug(req.id, 'call to API', {
        method: req.method,
        originalUrl: req.originalUrl,
    });

    res.status(200).send('Welcome');
});

/**
 * @swagger
 * /health:
 *   get:
 *     tags: ['Main routers']
 *     description: Get the server's health status
 *     responses:
 *       200:
 *         description: Returns OK message (string)
 */
router.get('/health', (req: Request, res: Response, _next: NextFunction) => {
    logger.info(req.id, 'Server sent health status to user');
    res.status(200).send('OK');
});

export default router;
