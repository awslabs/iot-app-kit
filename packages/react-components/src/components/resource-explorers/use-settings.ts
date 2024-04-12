import { useState } from 'react';
import { ResourceTableUserSettings } from './types/resource-table';
import { useLocalStorage } from 'react-use';

export interface UserSettings<Resource>
  extends ResourceTableUserSettings<Resource> {
  pageSize: number;
}

interface UseUserSettingsOptions<Resource> {
  resourceName: string;
  defaultPageSize: number;
  defaultTableUserSettings: ResourceTableUserSettings<Resource>;
  shouldStoreUserSettings?: boolean;
}

type UseUserSettingsResult<Resource> = readonly [
  UserSettings<Resource>,
  (userSettings: UserSettings<Resource>) => void
];

export function useUserSettings<Resource>({
  resourceName,
  defaultPageSize,
  defaultTableUserSettings,
  shouldStoreUserSettings = false,
}: UseUserSettingsOptions<Resource>): UseUserSettingsResult<Resource> {
  const [temporaryUserSettings, setTemporaryUserSettings] = useState<
    UserSettings<Resource>
  >({
    pageSize: defaultPageSize,
    ...defaultTableUserSettings,
  });

  const storageKey = `${resourceName}-user-settings`;
  const [storedUserSettings = temporaryUserSettings, setStoredUserSettings] =
    useLocalStorage<UserSettings<Resource>>(
      // Empty key to avoid storage
      // TODO: validate behavior
      shouldStoreUserSettings ? storageKey : '',
      temporaryUserSettings
    );

  const userSettings = shouldStoreUserSettings
    ? storedUserSettings
    : temporaryUserSettings;

  function setUserSettings(settings: UserSettings<Resource>): void {
    if (shouldStoreUserSettings) {
      setStoredUserSettings(settings);
    } else {
      setTemporaryUserSettings(settings);
    }
  }

  return [userSettings, setUserSettings];
}
