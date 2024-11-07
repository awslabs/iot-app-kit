import { useSelector } from 'react-redux';

import isEqual from 'lodash/isEqual';

import { type DashboardWidget } from '~/types';
import type { DashboardState } from '~/store/state';

const compareSelectedWidgets = (a: DashboardWidget[], b: DashboardWidget[]) =>
  isEqual(a, b);

export const useSelectedWidgets = <
  Properties extends Record<string, unknown> = Record<string, unknown>
>() =>
  useSelector(
    (state: DashboardState<Properties>) => state.selectedWidgets,
    compareSelectedWidgets
  );
