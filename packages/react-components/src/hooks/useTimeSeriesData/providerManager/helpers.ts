import type {
  Provider,
  GetSubscriptionHash,
  CreateSubscriptionHash,
} from './types';

type ProviderWithGetSubscriptionHash = Provider &
  Record<'getSubscriptionHash', GetSubscriptionHash>;

export function isHashable(
  provider: Provider | ProviderWithGetSubscriptionHash
): provider is ProviderWithGetSubscriptionHash {
  return 'getSubscriptionHash' in provider;
}

type ProviderWithCreateSubscriptionHash = Provider &
  Record<'createSubscriptionHash', CreateSubscriptionHash>;

export function canCreateHashes(
  provider: Provider | ProviderWithCreateSubscriptionHash
): provider is ProviderWithCreateSubscriptionHash {
  return 'createSubscriptionHash' in provider;
}
