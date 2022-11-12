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
 *     description: Redirect the user to a login page
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
 * /health:
 *   get:
 *     tags: ['Main routers']
 *     description: Respond with message that give server status
 *     responses:
 *       302:
 *
 */
router.get('/health', (req: Request, res: Response, next: NextFunction) => {
    logger.info(req.id, "User redirected to server's health page");
    res.sendFile(
        path.resolve(__dirname, '../..', 'client', 'htmls', 'health.html')
    );
});
// add health-status - for file
// change health to return status 200

export default router;
