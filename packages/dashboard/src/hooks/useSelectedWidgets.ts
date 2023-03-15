import { useSelector } from 'react-redux';

import isEqual from 'lodash/isEqual';

import { Widget } from '~/types';
import type { DashboardState } from '~/store/state';

const compareSelectedWidgets = (a: Widget[], b: Widget[]) => isEqual(a, b);

export const useSelectedWidgets = () =>
  useSelector((state: DashboardState) => state.selectedWidgets, compareSelectedWidgets);
