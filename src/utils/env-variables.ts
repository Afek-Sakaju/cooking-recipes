import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

import { DOT_ENV_PATH } from './paths';

expand(config({ path: DOT_ENV_PATH }));

export const PORT: number = +(process.env.PORT ?? 3005);
export const MONGO_URL: string = process.env.MONGO_URL ?? '';
export const LOGGING_MODE: string = process.env.LOGGING_MODE ?? 'debug';
export const LOGGING_LINE_TRACE: string =
    process.env.LOGGING_LINE_TRACE ?? 'info,error';
