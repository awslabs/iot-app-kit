import debug from 'debug';

import ILogger from './ILogger';

class DebugLogger implements ILogger {
  private log: debug.Debugger;

  constructor(log: debug.Debugger | string) {
    if (typeof log === 'string') {
      this.log = debug(log);
    } else {
      this.log = log;
    }
  }

  extend(namespace: string): ILogger {
    return new DebugLogger(this.log.extend(namespace));
  }

  async warn(message: string, ...args: any): Promise<void> {
    return this.write('WARN', message, ...args);
  }

  async error(message: string, error?: Error, ...args: any): Promise<void> {
    return this.write('ERROR', message, error, ...args);
  }

  async fatal(message: string, error?: Error, ...args: any): Promise<void> {
    return this.write('FATAL', message, error, ...args);
  }

  async info(message: string, ...args: any): Promise<void> {
    return this.write('INFO', message, args);
  }

  async verbose(message: string, ...args: any): Promise<void> {
    return this.write('VERBOSE', message, ...args);
  }

  private async write(level: string, message: string, ...args: any): Promise<void> {
    const logger = this.log.extend(`[${level.toUpperCase()}]`);
    return Promise.resolve(logger(message, ...args));
  }
}

export default DebugLogger;
