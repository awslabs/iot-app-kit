import { onToggleChatbotAction, toggleChatbot } from '.';
import { initialState } from '../../state';
import type { DashboardState } from '../../state';
import type { DashboardWidget } from '~/types';
import { configureDashboardStore } from '~/store';

const setupDashboardState = (
  widgets: DashboardWidget[] = [],
  pasteCounter = 0
): DashboardState => ({
  ...initialState,
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
  pasteCounter,
  readOnly: false,
});

it('initial state of chatbot is closed', () => {
  expect(initialState.assistant.isChatbotOpen).toBeFalsy();
});

it('can open the chatbot', () => {
  expect(
    toggleChatbot(setupDashboardState([]), {
      type: 'TOGGLE_CHATBOT',
      payload: {
        open: true,
        callerComponentId: 'componentId',
        messages: [],
      },
    }).assistant.isChatbotOpen
  ).toEqual(true);
});

it('can close the chatbot', () => {
  expect(
    toggleChatbot(setupDashboardState([]), {
      type: 'TOGGLE_CHATBOT',
      payload: {
        open: false,
        callerComponentId: 'componentId',
        messages: [],
      },
    }).assistant.isChatbotOpen
  ).toEqual(false);
});

it('can start summary action', () => {
  expect(
    toggleChatbot(setupDashboardState([]), {
      type: 'TOGGLE_CHATBOT',
      payload: {
        open: false,
        callerComponentId: 'dashboard',
        action: 'summary',
        messages: [],
      },
    }).assistant.action
  ).toEqual('summary');
});

it('action TOGGLE_CHATBOT changes state correctly', () => {
  const store = configureDashboardStore(initialState);
  store.dispatch(
    onToggleChatbotAction({
      open: true,
      callerComponentId: 'mockId',
      action: 'summary',
      messages: [],
    })
  );

  expect(store.getState().assistant.isChatbotOpen).toBeTruthy();
  expect(store.getState().assistant.callerComponentId).toBe('mockId');
  expect(store.getState().assistant.action).toBe('summary');
});
