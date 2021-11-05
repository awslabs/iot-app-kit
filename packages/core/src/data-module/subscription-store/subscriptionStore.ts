import { AnyDataStreamQuery, DataStreamQuery, Subscription, SubscriptionUpdate } from '../types.d';

/**
 * Subscription store
 *
 * Manages the collection of subscriptions
 */
export default class SubscriptionStore {
  private subscriptions: { [subscriptionId: string]: Subscription<AnyDataStreamQuery> } = {};

  addSubscription<Query extends DataStreamQuery>(subscriptionId: string, subscription: Subscription<Query>): void {
    if (this.subscriptions[subscriptionId] != null) {
      throw new Error(
        `Attempted to add a subscription with an id of "${subscriptionId}", but the provided subscriptionId is already present.`
      );
    }

    this.subscriptions[subscriptionId] = subscription;
  }

  updateSubscription<Query extends DataStreamQuery>(
    subscriptionId: string,
    subscriptionUpdate: SubscriptionUpdate<Query>
  ): void {
    if (this.subscriptions[subscriptionId] == null) {
      throw new Error(
        `Attempted to update a subscription with an id of "${subscriptionId}", but the requested subscription does not exist.`
      );
    }

    this.subscriptions[subscriptionId] = {
      ...this.subscriptions[subscriptionId],
      ...subscriptionUpdate,
    };
  }

  removeSubscription = (subscriptionId: string): void => {
    if (this.subscriptions[subscriptionId] == null) {
      throw new Error(
        `Attempted to remove a subscription with an id of "${subscriptionId}", but the requested subscription does not exist.`
      );
    }

    delete this.subscriptions[subscriptionId];
  };

  getSubscriptions = (): Subscription<AnyDataStreamQuery>[] => Object.values(this.subscriptions);

  getSubscription = (subscriptionId: string): Subscription<AnyDataStreamQuery> => this.subscriptions[subscriptionId];
}
