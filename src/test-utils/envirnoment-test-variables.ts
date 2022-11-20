export * from '../utils/env-variables';

export const JEST_TIMEOUT: number = +(process.env.JEST_TIMEOUT ?? 0);
export const USE_MONGO_MEMORY: boolean = !!+(process.env.USE_MONGO_MEMORY ?? 0);
