import { useContext, useMemo } from 'react';

import LoggingContext from '../contexts/logging';

export default (namespace?: string) => {
  const { log } = useContext(LoggingContext);
  let logger = log;

  if (logger && namespace) {
    logger = useMemo(() => logger!.extend(namespace), [logger, namespace]);
  }

  return logger;
};
