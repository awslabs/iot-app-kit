import {
  type ProviderWithViewport,
  type TimeSeriesData,
} from '@iot-app-kit/core';

type ProviderMap = { [key in string]: ProviderWithViewport<TimeSeriesData[]> };
const providerStore = () => {
  const providerMap: ProviderMap = {};

  const set = (
    id: keyof ProviderMap,
    provider: ProviderMap[keyof ProviderMap]
  ) => {
    providerMap[id] = provider;
    return provider;
  };

  const get = (
    id: keyof ProviderMap
  ): ProviderMap[keyof ProviderMap] | undefined => providerMap[id];

  const remove = (id: keyof ProviderMap) => {
    delete providerMap[id];
  };

  return {
    get,
    set,
    remove,
  };
};

export const ProviderStore = providerStore();
