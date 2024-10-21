import { useStoreSelector } from '../hooks';
import { selectWidgets as selectWidgetsSelector } from './selectors';

export function useWidgets() {
  return useStoreSelector(selectWidgetsSelector);
}
