import { onCleanAssistantAction, cleanAssistant } from '.';
import { initialState } from '../../state';
import type { DashboardState } from '../../state';
import { configureDashboardStore } from '~/store';
import { MOCK_KPI_WIDGET } from '../../../../testing/mocks';

const dirtyState = {
  ...initialState,
  readOnly: false,
  assistant: {
    ...initialState.assistant,
    state: 'PASSIVE',
    conversationId: 'conversationId',
    callerComponentId: 'callerComponentId',
    action: 'summary',
    selectedQueries: [
      {
        widgetId: MOCK_KPI_WIDGET.id,
        widgetType: MOCK_KPI_WIDGET.type,
        selectedProperties: 1,
      },
    ],
  },
} satisfies DashboardState;

it('clean assistant state', () => {
  const { assistant } = cleanAssistant(dirtyState);
  expect(assistant.conversationId).not.toEqual('conversationId');
  expect(assistant.callerComponentId).not.toBeDefined();
  expect(assistant.action).not.toBeDefined();
  expect(assistant.selectedQueries).toEqual([]);
});

it('action CLEAN_ASSISTANT changes state correctly', () => {
  const store = configureDashboardStore(dirtyState);
  store.dispatch(onCleanAssistantAction());

  expect(store.getState().assistant.conversationId).not.toEqual(
    'conversationId'
  );
  expect(store.getState().assistant.callerComponentId).not.toBeDefined();
  expect(store.getState().assistant.action).not.toBeDefined();
  expect(store.getState().assistant.selectedQueries).toEqual([]);
});
