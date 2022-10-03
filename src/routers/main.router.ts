import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`user visit from url:${req.originalUrl}`);
    next();
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
    res.redirect('https://youtu.be/t2NgsJrrAyM?t=101');
});

export default router;
