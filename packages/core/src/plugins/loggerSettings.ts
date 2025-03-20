import type { Logger } from '../logger/logger.interface';

export interface LoggerSettings {
  provider: () => Logger | undefined;
}
