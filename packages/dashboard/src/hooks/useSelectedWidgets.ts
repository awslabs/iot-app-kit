import { useSelector } from 'react-redux';

import isEqual from 'lodash/isEqual';

import { DashboardWidget } from '~/types';
import type { DashboardState } from '~/store/state';

const compareSelectedWidgets = (a: DashboardWidget[], b: DashboardWidget[]) => isEqual(a, b);

export const useSelectedWidgets = () =>
  useSelector((state: DashboardState) => state.selectedWidgets, compareSelectedWidgets);
