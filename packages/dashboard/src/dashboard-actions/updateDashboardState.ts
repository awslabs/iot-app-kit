import { DashboardState } from '../types';
import deepMerge from 'deepmerge';

/**
 * Deeply updates the dashboard state object.
 *
 * @param initialState
 * @param fieldsToUpdate
 * @returns A new object of the same type as the initialState, with the passed fields updated.
 */
export const updateDashboardState = (initialState: DashboardState, fieldsToUpdate: Partial<DashboardState>) =>
  deepMerge(initialState, fieldsToUpdate);
