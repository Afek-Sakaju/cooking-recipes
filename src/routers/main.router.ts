import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.originalUrl);
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
    res.redirect('/login-page/login.html');
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
