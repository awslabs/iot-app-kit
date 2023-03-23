import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import { act } from '@testing-library/react';

import InternalDashboard from './index';
import { configureDashboardStore } from '../../store';

import {
  onBringWidgetsToFrontAction,
  onDeleteWidgetsAction,
  onSelectWidgetsAction,
  onSendWidgetsToBackAction,
} from '../../store/actions';

jest.mock('../../store/actions', () => {
  const originalModule = jest.requireActual('../../store/actions');

  return {
    __esModule: true,
    ...originalModule,
    onSelectWidgetsAction: jest.fn(),
    onDeleteWidgetsAction: jest.fn(),
    onBringWidgetsToFrontAction: jest.fn(),
    onSendWidgetsToBackAction: jest.fn(),
    // onCopyWidgetsAction: jest.fn(),
    // onPasteWidgetsAction: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

const renderDashboardAndPressKey = ({ key, meta }: { key: string; meta: boolean }) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const args = {
    dashboardConfiguration: {
      widgets: [],
      viewport: { duration: '5m' },
    },
  };

  const root = createRoot(container);

  act(() => {
    root.render(
      <Provider store={configureDashboardStore(args)}>
        <DndProvider
          backend={TouchBackend}
          options={{
            enableMouseEvents: true,
            enableKeyboardEvents: true,
          }}
        >
          <InternalDashboard />
        </DndProvider>
      </Provider>
    );
  });

  act(() => {
    if (meta)
      document.body.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Control', metaKey: meta, ctrlKey: meta, bubbles: true })
      );
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key, metaKey: meta, ctrlKey: meta, bubbles: true }));
  });
};

it('can clear the selection', () => {
  (onSelectWidgetsAction as jest.Mock).mockImplementation(() => ({ type: '', payload: {} }));

  renderDashboardAndPressKey({ key: 'Escape', meta: false });

  expect(onSelectWidgetsAction).toBeCalledWith({
    widgets: [],
    union: false,
  });
});

it('can delete the selection', () => {
  (onDeleteWidgetsAction as jest.Mock).mockImplementation(() => ({ type: '', payload: {} }));

  renderDashboardAndPressKey({ key: 'Backspace', meta: false });

  expect(onDeleteWidgetsAction).toBeCalledWith({
    widgets: [],
  });
});

it('can send the selection to the back', () => {
  (onSendWidgetsToBackAction as jest.Mock).mockImplementation(() => ({ type: '', payload: {} }));

  renderDashboardAndPressKey({ key: '[', meta: false });

  expect(onSendWidgetsToBackAction).toBeCalled();
});

it('can bring the selection to the front', () => {
  (onBringWidgetsToFrontAction as jest.Mock).mockImplementation(() => ({ type: '', payload: {} }));

  renderDashboardAndPressKey({ key: ']', meta: false });

  expect(onBringWidgetsToFrontAction).toBeCalled();
});

/**
 * TODO: simulating command + c and command + v does not seem to work within jest.
 * need to find a different way to do this.
 * Tried using the fireEvent util and the document dispatch directly, but could
 * not figure out a way to set the metaKey to true
 */
