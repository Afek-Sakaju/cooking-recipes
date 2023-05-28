import { Response, Request, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

import { logger } from '../utils';

const generateV4UUID = (_request: Request) => uuid();

export function requestID({
    generator = generateV4UUID,
    headerName = 'X-Request-Id',
    setHeader = true,
} = {}) {
    return function (request: Request, response: Response, next: NextFunction) {
        const oldValue = request.get(headerName);
        const id = oldValue === undefined ? generator(request) : oldValue;

        if (setHeader) response.set(headerName, id);
        request['id'] = id;
        next();
    };
}

export function logAPI(req: Request, _res: Response, next: NextFunction) {
    logger.debug(req.id, 'call to API', {
        method: req.method,
        originalUrl: req.originalUrl,
    });
    next();
}
