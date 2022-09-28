import { useEffect } from 'react';

import useLogger from './useLogger';

export default (namespace?: string) => {
  const log = useLogger(namespace);

  log?.verbose('rendering');

  useEffect(() => {
    log?.verbose('mounted');

    return () => {
      const unmount = async () => {
        await log?.verbose('unmounted');
      };

      unmount();
    };
  }, [log]);

  return log;
};
