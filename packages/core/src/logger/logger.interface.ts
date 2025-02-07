/**
 * Log represents a single event message to record.
 */
export interface Log {
  /**
   * Additional contexts to include.
   */
  contexts?: Record<string, string>;
  message: string;
  timestamp?: Date;
}

/**
 * Logger gathers/emits {@link Log}.
 */
export interface Logger {
  /**
   * Record logs by {@link Logger}.
   * @param log log to record
   */
  log: (log: Log) => void;

  /**
   * Record error logs by {@link Logger}.
   * @param log error log to record
   */
  error: (log: Log) => void;

  /**
   * Record warn logs by {@link Logger}.
   * @param log warn log to record
   */
  warn: (log: Log) => void;
}
