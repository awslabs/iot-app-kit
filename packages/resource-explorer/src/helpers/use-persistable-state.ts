import { useCallback, useEffect, useState } from 'react';

export type StorageKey = string;
export type SerializedItem = string;

export interface UsePersistableStateOptions {
  /**
   * Unique key to store state with local storage. When specified, state will
   * be stored in local storage.
   *
   * @defaultValue `undefined`
   */
  storageKey?: StorageKey;
}

export type UsePersistableStateResult<Item> = readonly [
  Item | undefined,
  (item: Item) => void
];

/** Utility hook to optionally persist state in local storage. */
export function usePersistableState<Item>({
  storageKey,
}: UsePersistableStateOptions): UsePersistableStateResult<Item> {
  const [item, setItem] = useState<Item | undefined>(undefined);

  // Read the item from local storage on key change.
  useEffect(() => {
    if (!storageKey) return;

    const serializedItem = readLocalStorage(storageKey);
    if (!serializedItem) return;

    const deserializedItem = deserializeItem<Item>(serializedItem);
    setItem(deserializedItem);
  }, [storageKey]);

  const setLocalStorageItem = useCallback(
    (item: Item): void => {
      setItem(item);

      if (!storageKey) return;

      const serializedItem = serializeItem(item);
      if (!serializedItem) return;

      writeLocalStorage(storageKey, serializedItem);
    },
    [storageKey]
  );

  return [item, setLocalStorageItem];
}

function readLocalStorage(key: StorageKey): SerializedItem | undefined {
  try {
    const stringItem: string | null = localStorage.getItem(key);

    return stringItem ?? undefined;
  } catch (error) {
    console.error('Error: Failed to read from local storage.', error);
  }
}

function writeLocalStorage(
  key: StorageKey,
  serializedItem: SerializedItem
): void {
  try {
    localStorage.setItem(key, serializedItem);
  } catch (error) {
    console.error('Error: Failed to write to local storage.', error);
  }
}

function serializeItem<Item>(item: Item): string | undefined {
  try {
    const serializedItem = JSON.stringify(item);

    return serializedItem;
  } catch (error) {
    console.error('Error: Failed to serialized item.', error);
  }
}

function deserializeItem<Item>(
  serializedItem: SerializedItem
): Item | undefined {
  try {
    const deserializedItem = JSON.parse(serializedItem) as unknown as Item;

    return deserializedItem;
  } catch (error) {
    console.error('Error: Failed to deserialize item.', error);
  }
}
