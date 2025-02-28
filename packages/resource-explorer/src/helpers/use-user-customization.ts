import { usePersistableState } from './use-persistable-state';
import type {
  ResourceTableUserSettings,
  UserCustomization,
} from '../types/table';
import type {
  PageSize,
  ResourceName,
  ShouldPersistUserCustomization,
} from '../types/common';

export interface UserUserCustomizationOptions {
  resourceName: ResourceName;
  defaultPageSize: PageSize;
  defaultTableUserSettings: ResourceTableUserSettings;
  shouldPersistUserCustomization: ShouldPersistUserCustomization;
}

export type UseUserCustomizationResult = readonly [
  UserCustomization,
  (userCustomization: UserCustomization) => void
];

export function useUserCustomization({
  resourceName,
  defaultPageSize,
  defaultTableUserSettings,
  shouldPersistUserCustomization,
}: UserUserCustomizationOptions): UseUserCustomizationResult {
  const defaultUserCustomization: UserCustomization = {
    pageSize: defaultPageSize,
    ...defaultTableUserSettings,
  };

  const storageKey = `${resourceName}-user-customization`;
  const [userCustomization = defaultUserCustomization, setUserCustomization] =
    usePersistableState<UserCustomization>({
      storageKey: shouldPersistUserCustomization ? storageKey : undefined,
    });

  return [userCustomization, setUserCustomization];
}
