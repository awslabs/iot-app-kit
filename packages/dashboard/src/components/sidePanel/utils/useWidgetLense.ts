import { useCallback, useMemo } from 'react';
import { useWidgetActions } from '~/customization/hooks/useWidgetActions';
import type { DashboardWidget } from '~/types';

export const useWidgetLense = <W extends DashboardWidget, T>(
  widget: W,
  selector: (widget: W) => T,
  updater: (widget: W, value: T) => W
): [T, (updatedValue: T) => void] => {
  const { update } = useWidgetActions();

  const value = useMemo<T>(() => selector(widget), [widget, selector]);

  const updateValue = useCallback(
    (updatedValue: T) => {
      update(updater(widget, updatedValue));
    },
    [widget, selector, updater]
  );

  return [value, updateValue];
};
