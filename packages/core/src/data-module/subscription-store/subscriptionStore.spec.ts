import SubscriptionStore from './subscriptionStore';
import { Subscription } from '../types.d';
import { DataCache } from '../data-cache/dataCacheWrapped';
import DataSourceStore from '../data-source-store/dataSourceStore';
import { SiteWiseDataStreamQuery } from '../../iotsitewise/time-series-data/types';
import { DEFAULT_CACHE_SETTINGS } from '../IotAppKitDataModule';
import { SITEWISE_DATA_SOURCE } from '../../iotsitewise/time-series-data';

const createSubscriptionStore = () => {
  const store = new DataSourceStore();
  store.registerDataSource({
    name: SITEWISE_DATA_SOURCE,
    initiateRequest: () => {},
    getRequestsFromQuery: () => [],
  });

  return new SubscriptionStore({
    dataCache: new DataCache(),
    dataSourceStore: store,
    cacheSettings: DEFAULT_CACHE_SETTINGS,
  });
};

const MOCK_SUBSCRIPTION: Subscription<SiteWiseDataStreamQuery> = {
  emit: () => {},
  queries: [{ source: SITEWISE_DATA_SOURCE, assets: [] }],
  request: {
    viewport: { start: new Date(2000, 0, 0), end: new Date() },
    settings: {
      fetchFromStartToEnd: true,
      fetchMostRecentBeforeStart: true,
    },
  },
  fulfill: () => {},
};

it('adds subscription', () => {
  const subscriptionStore = createSubscriptionStore();
  subscriptionStore.addSubscription('some-id', MOCK_SUBSCRIPTION);

  expect(subscriptionStore.getSubscriptions()).toEqual([MOCK_SUBSCRIPTION]);
});

it('updates subscription', () => {
  const SUBSCRIPTION_ID = 'some-id';
  const subscriptionStore = createSubscriptionStore();

  const queries = [
    {
      source: SITEWISE_DATA_SOURCE,
      assets: [{ assetId: '123', properties: [{ propertyId: 'prop1' }, { propertyId: 'prop2' }] }],
    },
  ];

  subscriptionStore.addSubscription(SUBSCRIPTION_ID, MOCK_SUBSCRIPTION);
  subscriptionStore.updateSubscription(SUBSCRIPTION_ID, { queries });

  expect(subscriptionStore.getSubscriptions()).toEqual([{ ...MOCK_SUBSCRIPTION, queries }]);
});

it('removes subscription', () => {
  const SUBSCRIPTION_ID = 'some-id';
  const subscriptionStore = createSubscriptionStore();
  subscriptionStore.addSubscription(SUBSCRIPTION_ID, MOCK_SUBSCRIPTION);
  subscriptionStore.removeSubscription(SUBSCRIPTION_ID);

  expect(subscriptionStore.getSubscriptions()).toBeEmpty();
});

it('gets subscription by subscriptionId', () => {
  const subscriptionStore = createSubscriptionStore();
  subscriptionStore.addSubscription('some-id', MOCK_SUBSCRIPTION);

  expect(subscriptionStore.getSubscription('some-id')).toEqual(MOCK_SUBSCRIPTION);
});

describe('throws errors when', () => {
  it('throws error when trying to update non-existent subscription', () => {
    const subscriptionStore = createSubscriptionStore();
    expect(() => subscriptionStore.updateSubscription('some-id', {})).toThrowError(/some-id/);
  });

  it('throws error when trying to remove non-existent subscription', () => {
    const subscriptionStore = createSubscriptionStore();
    expect(() => subscriptionStore.removeSubscription('some-id')).toThrowError(/some-id/);
  });

  it('throws error when trying to add the same subscription id twice', () => {
    const SUBSCRIPTION_ID = 'some-id';
    const subscriptionStore = createSubscriptionStore();

    subscriptionStore.addSubscription(SUBSCRIPTION_ID, MOCK_SUBSCRIPTION);
    expect(() => subscriptionStore.addSubscription(SUBSCRIPTION_ID, MOCK_SUBSCRIPTION)).toThrowError(/some-id/);
  });
});
