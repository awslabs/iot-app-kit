import type { Logger } from '../logger/logger.interface';

export type LoggerSettings = { provider: () => Logger | undefined };
