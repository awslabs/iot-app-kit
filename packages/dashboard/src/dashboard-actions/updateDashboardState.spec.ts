import { updateDashboardState } from './updateDashboardState';
import { dashboardConfig, MOCK_KPI_WIDGET } from '../testing/mocks';
import { DashboardState } from '../types';

const state: DashboardState = {
  dashboardConfiguration: dashboardConfig,
  intermediateDashboardConfiguration: undefined,
  selectedWidgetIds: [],
  numTimesCopyGroupHasBeenPasted: 0,
  copyGroup: [],
  stretchToFit: false,
  width: 1000,
  cellSize: 10,
  undoQueue: [],
  redoQueue: [],
  previousPosition: undefined,
};

describe('updateDashboardState()', () => {
  it('updates single property', () => {
    const fieldsToUpdate = { width: 500 };
    const expectedState = { ...state, width: 500 };

    expect(updateDashboardState(state, fieldsToUpdate)).toStrictEqual(expectedState);
  });

  it('updates multiple properties', () => {
    const fieldsToUpdate = { cellSize: 20, stretchToFit: true };
    const expectedState = { ...state, cellSize: 20, stretchToFit: true };

    expect(updateDashboardState(state, fieldsToUpdate)).toStrictEqual(expectedState);
  });

  it('updates array with recursive merge', () => {
    const initialState = { ...state, selectedWidgetIds: ['1'] };
    const fieldsToUpdate = { selectedWidgetIds: ['2'] };
    const expectedState = { ...state, selectedWidgetIds: ['1', '2'] };

    expect(updateDashboardState(initialState, fieldsToUpdate)).toStrictEqual(expectedState);
  });

  it('updates object with recursive merge', () => {
    const initialState = { ...state, dashboardConfiguration: { viewport: { duration: '5m' }, widgets: [] } };
    const fieldsToUpdate = { dashboardConfiguration: { viewport: { duration: '1m' }, widgets: [MOCK_KPI_WIDGET] } };
    const expectedState = {
      ...state,
      dashboardConfiguration: { viewport: { duration: '1m' }, widgets: [MOCK_KPI_WIDGET] },
    };

    expect(updateDashboardState(initialState, fieldsToUpdate)).toStrictEqual(expectedState);
  });
});
