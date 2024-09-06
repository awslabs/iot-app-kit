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

it('initial start of chatbot is null', () => {
  expect(initialState.assistant.isChatbotOpen).toBeNull();
});

it('can open the chatbot', () => {
  expect(
    toggleChatbot(setupDashboardState([]), {
      type: 'TOGGLE_CHATBOT',
      payload: {
        open: true,
        componentId: 'componentId',
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
        open: true,
        componentId: 'componentId',
        messages: [],
      },
    }).assistant.isChatbotOpen
  ).toEqual(false);
});

it('action TOGGLE_CHATBOT changes state correctly', () => {
  const store = configureDashboardStore(initialState);
  store.dispatch(
    onToggleChatbotAction({
      open: true,
      componentId: 'componentId',
      messages: [],
    })
  );

  expect(store.getState().assistant.isChatbotOpen).toBeTruthy();
});
