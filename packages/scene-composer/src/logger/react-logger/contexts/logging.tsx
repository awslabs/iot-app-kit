import React from 'react';

import ILogger from '../../ILogger';

export interface ILoggingContext {
  log: ILogger | null;
  setLog(log: ILogger): void;
}

export default React.createContext<ILoggingContext>({
  log: null,
  setLog: /* istanbul ignore next */ () => null, // ignored for coverage because this will never be called, it's just a requirement of initializing a context
});
