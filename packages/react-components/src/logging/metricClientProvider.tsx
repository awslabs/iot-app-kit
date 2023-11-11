import React, { createContext, FC, ReactNode, useContext } from 'react';
import { MetricClient } from '@iot-app-kit/core';

interface MetricClientProviderContext {
  metricClient?: MetricClient;
}

interface MetricClientProviderProps {
  children: ReactNode;
  metricClient?: MetricClient;
}

const MetricClientProviderContext = createContext<MetricClientProviderContext>({});

export const useMetricClientProviderContext = () => {
  return useContext(MetricClientProviderContext);
};

export const MetricClientProvider: FC<MetricClientProviderProps> = ({ children, metricClient }) => {
  return (
    <MetricClientProviderContext.Provider
      value={{
        metricClient,
      }}
    >
      {children}
    </MetricClientProviderContext.Provider>
  );
};
