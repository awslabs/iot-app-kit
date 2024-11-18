import {
  type TrendCursorAction,
  addTrendCursor,
  addTrendCursorToGroup,
  connectUpdaterToGroup,
  deleteTrendCursor,
  disconnectUpdaterFromGroup,
  removeTrendCursorFromGroup,
  setTrendCursorValues,
  updateTrendCursor,
} from './actions';
import { type TrendCursorsData } from './state';
import {
  executeConnectedUpdaters,
  getConnectedUpdaters,
  trendCursorsAsArray,
} from './utils';

export const reducer = (state: TrendCursorsData, action: TrendCursorAction) => {
  switch (action.type) {
    case 'CONNECT': {
      const updatedState = {
        groups: connectUpdaterToGroup(action.payload, state.groups),
      };
      executeConnectedUpdaters(
        getConnectedUpdaters(action.payload.groupId, updatedState.groups),
        trendCursorsAsArray(state.trendCursors),
        'add'
      );
      return updatedState;
    }
    case 'DISCONNECT': {
      return {
        groups: disconnectUpdaterFromGroup(action.payload, state.groups),
      };
    }
    case 'ADD_TREND_CURSOR': {
      const updatedState = {
        groups: addTrendCursorToGroup(action.payload, state.groups),
        trendCursors: addTrendCursor(action.payload, state.trendCursors),
      };
      executeConnectedUpdaters(
        getConnectedUpdaters(
          action.payload.trendCursor.group,
          updatedState.groups
        ),
        trendCursorsAsArray(updatedState.trendCursors),
        'add'
      );
      return updatedState;
    }
    case 'UPDATE_TREND_CURSOR': {
      const updatedState = {
        trendCursors: updateTrendCursor(action.payload, state.trendCursors),
      };
      executeConnectedUpdaters(
        getConnectedUpdaters(action.payload.trendCursor.group, state.groups),
        trendCursorsAsArray(updatedState.trendCursors),
        'update'
      );
      return updatedState;
    }
    case 'DELETE_TREND_CURSOR': {
      const updatedState = {
        groups: removeTrendCursorFromGroup(action.payload, state.groups),
        trendCursors: deleteTrendCursor(action.payload, state.trendCursors),
      };
      executeConnectedUpdaters(
        getConnectedUpdaters(
          action.payload.trendCursor.group,
          updatedState.groups
        ),
        trendCursorsAsArray(updatedState.trendCursors),
        'remove'
      );
      return updatedState;
    }
    case 'SET_TREND_CURSOR_VALUES': {
      return {
        trendCursorValues: setTrendCursorValues(
          action.payload,
          state.trendCursorValues
        ),
      };
    }
    default: {
      return state;
    }
  }
};
