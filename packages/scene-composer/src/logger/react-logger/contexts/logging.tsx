import { createContext } from 'react';

import type ILogger from '../../ILogger';

export interface ILoggingContext {
  log: ILogger | null;
  setLog(log: ILogger): void;
}

export default createContext<ILoggingContext>({
  log: null,
  setLog: /* istanbul ignore next */ () => null, // ignored for coverage because this will never be called, it's just a requirement of initializing a context
});
