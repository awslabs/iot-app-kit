import { cleanAssistant, onCleanAssistantAction } from '.';
import { MOCK_KPI_WIDGET } from '../../../../testing/mocks';
import { configureDashboardStore } from '../../index-old';
import type { DashboardState } from '../../state-old';
import { initialState } from '../../state-old';

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
});

it('action CLEAN_ASSISTANT changes state correctly', () => {
  const store = configureDashboardStore(dirtyState);
  store.dispatch(onCleanAssistantAction());

  expect(store.getState().assistant.conversationId).not.toEqual(
    'conversationId'
  );
  expect(store.getState().assistant.callerComponentId).not.toBeDefined();
  expect(store.getState().assistant.action).not.toBeDefined();
});
