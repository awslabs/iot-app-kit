import { isDefined } from '../../utils/predicates';
import { DataStreamsStore, DataStreamStore } from './types';

// i.e. [12, -21, 0, 13] => [-21, 0, 12, 13]
const ascendingSort = (a: number, b: number): number => a - b;

/**
 * Get Best Stream Store
 *
 * Returns the best data stream store based on what resolution we would like to visualize
 * on connected widgets
 * This will be the store with the smallest resolution which is not smaller than the requested resolution,
 * that is not in a loading or error state.
 */
export const getBestStreamStore = (
  dataStreamId: string,
  requestResolution: number,
  store: DataStreamsStore
): undefined | DataStreamStore => {
  const resMap = store[dataStreamId];
  if (resMap == null) {
    return undefined;
  }
  const resolutions = Object.keys(resMap)
    .map(Number)
    .sort(ascendingSort)
    .filter((res) => res >= requestResolution);
  const streamStores = resolutions.map((res) => resMap[res]).filter(isDefined);
  const closestAvailableData = streamStores.find(
    ({ error, isLoading }: DataStreamStore) => error == null && !isLoading
  );
  // If the exact sore is present and is not in a loading state, return it!
  // This is because we want to display an error if it occurs on our requested resolution.
  const exactStore = resolutions[0] === requestResolution ? streamStores[0] : undefined;
  if (exactStore && !exactStore.isLoading) {
    return exactStore;
  }
  return closestAvailableData || resMap[requestResolution];
};
