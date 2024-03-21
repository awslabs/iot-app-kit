import { ProviderWithViewport, TimeSeriesData } from '@iot-app-kit/core';

export type Provider = ProviderWithViewport<TimeSeriesData[]>;

export type GetSubscriptionHash = NonNullable<Provider['getSubscriptionHash']>;
export type CreateSubscriptionHash = NonNullable<
  Provider['createSubscriptionHash']
>;

export type HashableQuery = Parameters<CreateSubscriptionHash>[0][][number];
