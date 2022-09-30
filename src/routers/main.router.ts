import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`user visit from url:${req.originalUrl}`);
    next();
});

router.get('/health', (req: Request, res: Response, next: NextFunction) => {
    res.redirect('https://youtu.be/t2NgsJrrAyM?t=101');
});

export default router;
