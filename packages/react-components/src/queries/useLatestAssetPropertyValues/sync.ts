import { useEffect } from 'react';
import { StateCreator, create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface LatestAssetPropertyValueSync {
  enabled: Record<number, boolean>;
}

export interface LatestAssetPropertyValueSyncState
  extends LatestAssetPropertyValueSync {
  enable: (refreshRate: number) => void;
  disable: (refreshRate: number) => void;
}

export const createLatestAssetPropertyValueSyncSlice: StateCreator<
  LatestAssetPropertyValueSyncState
> = (set) => ({
  enabled: {},
  enable: (refreshRate: number) =>
    set((state) => ({
      ...state,
      enabled: {
        ...state.enabled,
        [refreshRate]: true,
      },
    })),
  disable: (refreshRate: number) =>
    set((state) => ({
      ...state,
      enabled: {
        ...state.enabled,
        [refreshRate]: false,
      },
    })),
});

export const useLatestAssetPropertyValueSyncStore =
  create<LatestAssetPropertyValueSyncState>()(
    devtools((...args) => ({
      ...createLatestAssetPropertyValueSyncSlice(...args),
    }))
  );

/**
 * Hook that will toggle a single enabled flag for
 * multiple usages of useLatestAssetPropertyValue
 * with the same refresh rate.
 *
 * This enabled flag is passed to useQueries
 * so that those queries execute at the same time ensuring
 * that the refetch intervals are synced and
 * batching can be fully utilized across multiple hooks.
 */
export const useSyncLatestAssetPropertyValueQueries = ({
  enabled,
  refreshRate,
}: {
  enabled: boolean;
  refreshRate: number;
}) => {
  const {
    enabled: enabledFlags,
    enable,
    disable,
  } = useLatestAssetPropertyValueSyncStore();

  useEffect(() => {
    if (!enabled) return;

    disable(refreshRate);
    setTimeout(() => {
      enable(refreshRate);
    }, 0);
  }, [enabled, refreshRate, enable, disable]);

  return enabledFlags[refreshRate];
};
