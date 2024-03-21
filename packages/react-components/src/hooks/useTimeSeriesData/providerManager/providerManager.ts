import type {
  ProviderObserver,
  TimeSeriesData,
  Viewport,
} from '@iot-app-kit/core';

import { isHashable, canCreateHashes } from './helpers';
import type { HashableQuery, Provider } from './types';

/**
 * Manages time-series data providers and their subscriptions.
 */
export class ProviderManager {
  #providers: Provider[] = [];

  public subscribeAll = ({
    providers,
    observer,
  }: {
    providers: Provider[];
    observer: ProviderObserver<TimeSeriesData[]>;
  }) => {
    this.unsubscribeAll();
    this.#replaceAll(providers);
    this.#initializeAllSubscriptions(observer);
  };

  public unsubscribeAll = (): void => {
    this.#providers.forEach((provider) => provider.unsubscribe());
  };

  #replaceAll = (providers: Provider[]) => {
    this.#providers = providers;
  };

  #initializeAllSubscriptions = (
    observer: ProviderObserver<TimeSeriesData[]>
  ) => {
    const results: Record<number, TimeSeriesData[]> = {};
    const next = (index: number) => (result: TimeSeriesData[]) => {
      results[index] = result;
      const combinedResults: TimeSeriesData[] = Object.values(results).flat();
      observer.next(combinedResults);
    };

    this.#providers.forEach((provider, index) =>
      provider.subscribe({ next: next(index), error: observer.error })
    );
  };

  public updateAllViewports = (viewport: Viewport): void => {
    this.#providers.forEach((provider) => provider.updateViewport(viewport));
  };

  /**
   * @remarks
   *
   * The order of queries is expected to be constant to match the order of providers.
   */
  public shouldReplaceProviders = (queries: HashableQuery[]): boolean => {
    const currentHash = this.#getCurrentHash();
    const newHash = this.#createNewHash(queries);

    return currentHash === '' || currentHash !== newHash;
  };

  #getCurrentHash = (): string => {
    const hash = this.#providers
      .map((provider) => {
        if (isHashable(provider)) {
          return provider.getSubscriptionHash();
        }

        return '';
      })
      .join();

    return hash;
  };

  #createNewHash = (queries: HashableQuery[]): string => {
    const hash = this.#providers
      .map((provider, index) => {
        if (canCreateHashes(provider)) {
          return provider.createSubscriptionHash(queries[index]);
        }

        return '';
      })
      .join();

    return hash;
  };
}
