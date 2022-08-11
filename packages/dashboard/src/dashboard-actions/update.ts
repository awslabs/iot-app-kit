import { DashboardState } from '../types';
import deepMerge from 'deepmerge';

/**
 * Returns updated dashboard configuration
 */
export const update = ({
  state,
  fieldsToUpdate,
}: {
  state: DashboardState;
  fieldsToUpdate: Partial<DashboardState>;
}): DashboardState => deepMerge({ ...state }, fieldsToUpdate);
