import SubscriptionStore from './subscriptionStore';
import { DataSource, SiteWiseDataStreamQuery, Subscription } from '../types';
import { DataCache } from '../data-cache/dataCacheWrapped';
import DataSourceStore from '../data-source-store/dataSourceStore';
import { DEFAULT_CACHE_SETTINGS } from '../TimeSeriesDataModule';

const createSubscriptionStore = () => {
  const store = new DataSourceStore({
    initiateRequest: () => {},
    getRequestsFromQuery: () => Promise.resolve([]),
  } as DataSource<SiteWiseDataStreamQuery>);

  return new SubscriptionStore({
    dataCache: new DataCache(),
    dataSourceStore: store,
    cacheSettings: DEFAULT_CACHE_SETTINGS,
  });
};

const MOCK_SUBSCRIPTION: Subscription<SiteWiseDataStreamQuery> = {
  emit: () => {},
  queries: [{ assets: [] }],
  request: {
    viewport: { start: new Date(2000, 0, 0), end: new Date() },
    settings: {
      fetchFromStartToEnd: true,
      fetchMostRecentBeforeStart: true,
    },
  },
  fulfill: () => {},
};

it('adds subscription', async () => {
  const subscriptionStore = createSubscriptionStore();
  await subscriptionStore.addSubscription('some-id', MOCK_SUBSCRIPTION);

  expect(subscriptionStore.getSubscriptions()).toEqual([MOCK_SUBSCRIPTION]);

  subscriptionStore.removeSubscription('some-id');
});

it('updates subscription', async () => {
  const SUBSCRIPTION_ID = 'some-id';
  const subscriptionStore = createSubscriptionStore();

  const queries = [
    {
      assets: [{ assetId: '123', properties: [{ propertyId: 'prop1' }, { propertyId: 'prop2' }] }],
    },
  ];

  await subscriptionStore.addSubscription(SUBSCRIPTION_ID, MOCK_SUBSCRIPTION);
  await subscriptionStore.updateSubscription(SUBSCRIPTION_ID, { queries });

  expect(subscriptionStore.getSubscriptions()).toEqual([{ ...MOCK_SUBSCRIPTION, queries }]);

  subscriptionStore.removeSubscription(SUBSCRIPTION_ID);
});

it('removes subscription', async () => {
  const SUBSCRIPTION_ID = 'some-id';
  const subscriptionStore = createSubscriptionStore();
  await subscriptionStore.addSubscription(SUBSCRIPTION_ID, MOCK_SUBSCRIPTION);
  subscriptionStore.removeSubscription(SUBSCRIPTION_ID);

  expect(subscriptionStore.getSubscriptions()).toBeEmpty();
});

it('gets subscription by subscriptionId', async () => {
  const subscriptionStore = createSubscriptionStore();
  await subscriptionStore.addSubscription('some-id', MOCK_SUBSCRIPTION);

  expect(subscriptionStore.getSubscription('some-id')).toEqual(MOCK_SUBSCRIPTION);
  subscriptionStore.removeSubscription('some-id');
});

describe('throws errors when', () => {
  it('throws error when trying to update non-existent subscription', async () => {
    const subscriptionStore = createSubscriptionStore();
    await expect(subscriptionStore.updateSubscription('some-id', {})).rejects.toThrowError(/some-id/);
  });

  it('throws error when trying to remove non-existent subscription', () => {
    const subscriptionStore = createSubscriptionStore();
    expect(() => subscriptionStore.removeSubscription('some-id')).toThrowError(/some-id/);
  });

  it('throws error when trying to add the same subscription id twice', async () => {
    const SUBSCRIPTION_ID = 'some-id';
    const subscriptionStore = createSubscriptionStore();

    await subscriptionStore.addSubscription(SUBSCRIPTION_ID, MOCK_SUBSCRIPTION);
    await expect(subscriptionStore.addSubscription(SUBSCRIPTION_ID, MOCK_SUBSCRIPTION)).rejects.toThrowError(/some-id/);

    subscriptionStore.removeSubscription('some-id');
  });
});
