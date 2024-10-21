import { shallowEqual } from 'react-redux';
import { useStoreSelector } from '~/store';

export function useSelectedWidgetIds() {
  return useStoreSelector(
    (state) => state.selection.selectedWidgetIds,
    shallowEqual
  );
}
