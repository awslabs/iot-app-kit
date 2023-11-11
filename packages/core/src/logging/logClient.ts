/**
 * Log represents a single event message to record.
 */
type Log = {
  /**
   * Additional contexts to include.
   */
  contexts?: Record<string, string>;
  message: string;
  timestamp?: Date;
};

/**
 * LogRequest represents {@link Log} to record.
 */
type LogsRequest = {
  logs: Log[];
};

/**
 * LogClient gathers/emits {@link Log}.
 */
export interface LogClient {
  /**
   * Record logs to {@link LogClient}.
   * @param logsRequest log to record by {@link LogClient}
   * @returns nothing
   */
  record: (logsRequest: LogsRequest) => void;
}
