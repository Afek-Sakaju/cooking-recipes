import express, { Request, Response, NextFunction } from 'express';

import { isAuthenticatedMW } from '../middleware';
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
 *     description: Default api
 *     responses:
 *       200:
 *         description: Returns welcome message
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
 * /success:
 *   get:
 *     tags: ['Main routers']
 *     description: Success login api
 *     security:
 *        cookieAuth:
 *          - connect.sid
 *     responses:
 *       202:
 *         description: Return login success message
 */
router.get(
    '/success',
    isAuthenticatedMW,
    (req: Request, res: Response, _next: NextFunction) => {
        logger.info(req.id, 'User visiting login success page');
        res.status(202).send('Logged in successfully');
    }
);

/**
 * @swagger
 * /health:
 *   get:
 *     tags: ['Main routers']
 *     description: Get health server status
 *     responses:
 *       200:
 *         description: Returns OK
 */
router.get('/health', (req: Request, res: Response, _next: NextFunction) => {
    logger.info(req.id, 'Server sent health status to user');
    res.status(200).send('OK');
});

export default router;
