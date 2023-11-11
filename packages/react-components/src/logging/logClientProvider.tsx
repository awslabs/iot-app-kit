import React, { createContext, FC, ReactNode, useContext } from 'react';
import { LogClient } from '@iot-app-kit/core';

interface LogClientProviderContext {
  logClient?: LogClient;
}

interface LogClientProviderProps {
  children: ReactNode;
  logClient?: LogClient;
}

const LogClientProviderContext = createContext<LogClientProviderContext>({});

export const useLogClientProviderContext = () => {
  return useContext(LogClientProviderContext);
};

export const LogClientProvider: FC<LogClientProviderProps> = ({ children, logClient }) => {
  return (
    <LogClientProviderContext.Provider
      value={{
        logClient,
      }}
    >
      {children}
    </LogClientProviderContext.Provider>
  );
};
