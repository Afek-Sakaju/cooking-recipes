import { Response, Request, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

import logger from '../utils/logger';

function generateV4UUID(_request: any) {
    return uuidv4();
}

const ATTRIBUTE_NAME = 'id';

export function requestID({
    generator = generateV4UUID,
    headerName = 'X-Request-Id',
    setHeader = true,
} = {}) {
    return function (request: Request, response: Response, next: NextFunction) {
        const oldValue = request.get(headerName);
        const id = oldValue === undefined ? generator(request) : oldValue;

        if (setHeader) {
            response.set(headerName, id);
        }

        request[ATTRIBUTE_NAME] = id;

        next();
    };
}

export function logAPI(req: Request, _res: Response, next: NextFunction) {
    logger.debug(req.id, 'call to api', {
        method: req.method,
        originalUrl: req.originalUrl,
    });
    next();
}
