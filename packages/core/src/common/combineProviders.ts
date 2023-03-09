import { ProviderObserver, ProviderWithViewport } from './types';
import { Viewport } from '../data-module/data-cache/requestTypes';
/**
 * Utility to compose multiple providers into a single provider.
 */

const noop = () => {};

export const combineProviders = <Result>(
  providers: ProviderWithViewport<Result[]>[]
): ProviderWithViewport<Result[]> => {
  if (providers.length === 0) {
    return {
      updateViewport: noop,
      unsubscribe: noop,
      subscribe: noop,
    };
  }

  if (providers.length === 1) {
    return providers[0];
  }

  return {
    updateViewport(viewport: Viewport) {
      providers.forEach((provider) => {
        provider.updateViewport(viewport);
      });
    },
    subscribe(observer: ProviderObserver<Result[]>) {
      const results: { [index: number]: Result[] } = {};
      const next = (index: number) => (result: Result[]) => {
        results[index] = result;
        const combinedResults: Result[] = Object.values(results).flat();
        observer.next(combinedResults);
      };

      providers.forEach((provider, i) => {
        provider.subscribe({ next: next(i), error: observer.error });
      });
    },
    unsubscribe: () => {
      providers.forEach(({ unsubscribe }) => {
        unsubscribe();
      });
    },
  };
};
