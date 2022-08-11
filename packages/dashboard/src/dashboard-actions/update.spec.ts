import { update } from './update';
import { dashboardConfig } from '../testing/mocks';
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

const partialState: Partial<DashboardState> = {
  cellSize: 20,
};

it('updates dashboard width', () => {
  expect(update({ state: { ...state }, fieldsToUpdate: { width: 500 } })).toEqual({ ...state, width: 500 });
});

it('updates dashboard stretchToFit', () => {
  expect(update({ state: { ...state }, fieldsToUpdate: { stretchToFit: true } })).toEqual({
    ...state,
    stretchToFit: true,
  });
});

it('updates dashboard cellSize', () => {
  expect(update({ state: { ...state }, fieldsToUpdate: { cellSize: 30 } })).toEqual({ ...state, cellSize: 30 });
});

it('updates dashboard cellSize with object', () => {
  expect(
    update({
      state: { ...state },
      fieldsToUpdate: { ...partialState, width: 800 },
    })
  ).toEqual({ ...state, cellSize: 20, width: 800 });
});

it('updates dashboard width with object', () => {
  expect(
    update({
      state: { ...state },
      fieldsToUpdate: { state: { width: 700, cellSize: 50 } },
    })
  ).toEqual({ ...state, state: { width: 700, cellSize: 50 } });
});

it('updates dashboard cellSize and width', () => {
  expect(
    update({
      state: update({ state: { ...state }, fieldsToUpdate: { cellSize: 30 } }),
      fieldsToUpdate: { width: 500 },
    })
  ).toEqual({ ...state, cellSize: 30, width: 500 });
});
