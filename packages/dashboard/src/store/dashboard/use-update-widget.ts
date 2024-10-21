import { useCallback } from 'react';
import { useUpdateWidgets } from './use-update-widgets';

export function useUpdateWidget() {
  const updateWidgets = useUpdateWidgets();

  return useCallback(
    (widget: Parameters<typeof updateWidgets>[0][number]) => {
      updateWidgets([widget]);
    },
    [updateWidgets]
  );
}
