import { Request, Response, NextFunction } from 'express';

export function isAuthenticatedMW(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (req.isAuthenticated()) next();
    else res.redirect('/lock.jpg');
}
