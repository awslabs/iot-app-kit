import React, { useContext, useEffect, useState } from 'react';

import DebugLogger from '../../DebugLogger';
import ILogger from '../../ILogger';
import LoggingContext from '../contexts/logging';
import ErrorBoundary, { ErrorBoundaryProps } from '../components/error-boundary';

interface LogProviderProps extends ErrorBoundaryProps {
  namespace: string;
  logger?: ILogger;
}

const LogProvider: React.FC<LogProviderProps> = ({ namespace, logger: overrideLogger, children, ...props }) => {
  const { log } = useContext(LoggingContext);

  const [logger, setLogger] = useState(
    // TODO: once we have the logging config system built, this should not default
    log ? log.extend(namespace) : new DebugLogger(namespace),
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
