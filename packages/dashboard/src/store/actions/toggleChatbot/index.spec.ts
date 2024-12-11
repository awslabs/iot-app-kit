import { onToggleChatbotAction, toggleChatbot } from '.';
import { configureDashboardStore } from '../../index-old';
import type { DashboardWidget } from '../../../types';
import type { DashboardState } from '../../state-old';
import { initialState } from '../../state-old';

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
      },
    }).assistant.isChatbotOpen
  ).toEqual(false);
});

it('can start summarize action', () => {
  expect(
    toggleChatbot(setupDashboardState([]), {
      type: 'TOGGLE_CHATBOT',
      payload: {
        open: false,
        callerComponentId: 'dashboard',
        action: 'summarize',
      },
    }).assistant.action
  ).toEqual('summarize');
});

it('action TOGGLE_CHATBOT changes state correctly', () => {
  const store = configureDashboardStore(initialState);
  store.dispatch(
    onToggleChatbotAction({
      open: true,
      callerComponentId: 'mockId',
      action: 'summarize',
    })
  );

  expect(store.getState().assistant.isChatbotOpen).toBeTruthy();
  expect(store.getState().assistant.callerComponentId).toBe('mockId');
  expect(store.getState().assistant.action).toBe('summarize');
  expect(store.getState().assistant.actionId).toEqual(expect.any(String));
});
