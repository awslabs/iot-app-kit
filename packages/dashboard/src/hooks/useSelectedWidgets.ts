import isEqual from 'lodash-es/isEqual';
import { useSelector } from 'react-redux';
import type { DashboardState } from '../store/state-old';
import { type DashboardWidget } from '../types';

const compareSelectedWidgets = (a: DashboardWidget[], b: DashboardWidget[]) =>
  isEqual(a, b);

export const useSelectedWidgets = <
  Properties extends Record<string, unknown> = Record<string, unknown>
>() =>
  useSelector(
    (state: DashboardState<Properties>) => state.selectedWidgets,
    compareSelectedWidgets
  );
