interface ILogger {
  extend(namespace: string): ILogger;
  warn(message: string, ...args: any[]): Promise<void>;
  error(message: string, error?: any, ...args: any[]): Promise<void>;
  fatal(message: string, error?: any, ...args: any[]): Promise<void>;
  info(message: string, ...args: any[]): Promise<void>;
  verbose(message: string, ...args: any[]): Promise<void>;
}

export default ILogger;
