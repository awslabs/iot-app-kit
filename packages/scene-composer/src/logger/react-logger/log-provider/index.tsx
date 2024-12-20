import { type FC, type ReactNode, useContext, useEffect, useState } from 'react';
import DebugLogger from '../../DebugLogger';
import type ILogger from '../../ILogger';
import ErrorBoundary, { type ErrorBoundaryProps } from '../components/error-boundary';
import LoggingContext from '../contexts/logging';

interface LogProviderProps extends ErrorBoundaryProps {
  namespace: string;
  logger?: ILogger;
  children: ReactNode;
}

const LogProvider: FC<LogProviderProps> = ({ namespace, logger: overrideLogger, children, ...props }) => {
  const { log } = useContext(LoggingContext);

  const [logger, setLogger] = useState(
    // TODO: once we have the logging config system built, this should not default
    log !== null ? log.extend(namespace) : new DebugLogger(namespace),
  );

  useEffect(() => {
    if (overrideLogger) {
      setLogger(overrideLogger);
    }
  }, [overrideLogger]);

  useEffect(() => {
    /* istanbul ignore next */
    logger?.verbose(`loaded`);

    return /* istanbul ignore next */ () => {
      logger?.verbose('unloaded');
    };
  }, []);

  return (
    <LoggingContext.Provider
      value={{
        log: logger,
        setLog: setLogger,
      }}
    >
      <ErrorBoundary {...props}>{children}</ErrorBoundary>
    </LoggingContext.Provider>
  );
};

export default LogProvider;
