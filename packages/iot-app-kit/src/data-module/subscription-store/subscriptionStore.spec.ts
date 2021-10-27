import SubscriptionStore from './subscriptionStore';
import { Subscription } from '../types.d';
import { DATA_STREAM_INFO } from '../../testing/__mocks__/mockWidgetProperties';
import { SiteWiseLegacyDataStreamQuery } from '../../data-sources/site-wise-legacy/types.d';

const MOCK_SUBSCRIPTION: Subscription<SiteWiseLegacyDataStreamQuery> = {
  emit: () => {},
  query: { source: 'site-wise-legacy', dataStreamInfos: [] },
  requestInfo: { start: new Date(), end: new Date(), onlyFetchLatestValue: false },
};

it('adds subscription', () => {
  const subscriptionStore = new SubscriptionStore();
  subscriptionStore.addSubscription('some-id', MOCK_SUBSCRIPTION);

  expect(subscriptionStore.getSubscriptions()).toEqual([MOCK_SUBSCRIPTION]);
});

it('updates subscription', () => {
  const SUBSCRIPTION_ID = 'some-id';
  const subscriptionStore = new SubscriptionStore();
  const dataStreamInfos = [DATA_STREAM_INFO];

  subscriptionStore.addSubscription(SUBSCRIPTION_ID, MOCK_SUBSCRIPTION);
  subscriptionStore.updateSubscription(SUBSCRIPTION_ID, {
    query: { source: MOCK_SUBSCRIPTION.query.source, dataStreamInfos },
  });

  expect(subscriptionStore.getSubscriptions()).toEqual([
    { ...MOCK_SUBSCRIPTION, query: { source: 'site-wise-legacy', dataStreamInfos } },
  ]);
});

it('removes subscription', () => {
  const SUBSCRIPTION_ID = 'some-id';
  const subscriptionStore = new SubscriptionStore();
  subscriptionStore.addSubscription(SUBSCRIPTION_ID, MOCK_SUBSCRIPTION);
  subscriptionStore.removeSubscription(SUBSCRIPTION_ID);

  expect(subscriptionStore.getSubscriptions()).toBeEmpty();
});

it('gets subscription by subscriptionId', () => {
  const subscriptionStore = new SubscriptionStore();
  subscriptionStore.addSubscription('some-id', MOCK_SUBSCRIPTION);

  expect(subscriptionStore.getSubscription('some-id')).toEqual(MOCK_SUBSCRIPTION);
});

describe('throws errors when', () => {
  it('throws error when trying to update non-existent subscription', () => {
    const subscriptionStore = new SubscriptionStore();
    expect(() => subscriptionStore.updateSubscription('some-id', {})).toThrowError(/some-id/);
  });

  it('throws error when trying to remove non-existent subscription', () => {
    const subscriptionStore = new SubscriptionStore();
    expect(() => subscriptionStore.removeSubscription('some-id')).toThrowError(/some-id/);
  });

  it('throws error when trying to add the same subscription id twice', () => {
    const SUBSCRIPTION_ID = 'some-id';
    const subscriptionStore = new SubscriptionStore();
    subscriptionStore.addSubscription(SUBSCRIPTION_ID, MOCK_SUBSCRIPTION);
    expect(() => subscriptionStore.addSubscription(SUBSCRIPTION_ID, MOCK_SUBSCRIPTION)).toThrowError(/some-id/);
  });
});
