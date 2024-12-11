import { onToggleAssistantModeAction, toggleAssistantMode } from '.';
import { configureDashboardStore } from '../../index-old';
import { initialState } from '../../state-old';

it('initial state of assistant mode is odd', () => {
  expect(initialState.assistant.mode).toEqual('off');
});

it('can change assistant mode to on', () => {
  expect(
    toggleAssistantMode(initialState, {
      type: 'TOGGLE_ASSISTANT_MODE',
      payload: {
        mode: 'on',
      },
    }).assistant.mode
  ).toEqual('on');
});

it('can change assistant mode to off', () => {
  expect(
    toggleAssistantMode(initialState, {
      type: 'TOGGLE_ASSISTANT_MODE',
      payload: {
        mode: 'off',
      },
    }).assistant.mode
  ).toEqual('off');
});

it('action onToggleAssistantModeAction changes state correctly', () => {
  const store = configureDashboardStore(initialState);
  store.dispatch(
    onToggleAssistantModeAction({
      mode: 'on',
    })
  );

  expect(store.getState().assistant.mode).toEqual('on');
});
