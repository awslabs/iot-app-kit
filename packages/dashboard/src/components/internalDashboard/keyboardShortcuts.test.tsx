import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { act } from '@testing-library/react';
import { InternalDashboard } from './index';
import { configureDashboardStore } from '../../store';
import {
  onBringWidgetsToFrontAction,
  onSelectWidgetsAction,
  onSendWidgetsToBackAction,
} from '../../store/actions';
import type { Mock } from 'vitest';

vi.mock('../../store/actions', async () => {
  const originalModule = await vi.importActual('../../store/actions');

  return {
    __esModule: true,
    ...originalModule,
    onSelectWidgetsAction: vi.fn(),
    onDeleteWidgetsAction: vi.fn(),
    onBringWidgetsToFrontAction: vi.fn(),
    onSendWidgetsToBackAction: vi.fn(),
    // onCopyWidgetsAction: vi.fn(),
    // onPasteWidgetsAction: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

const renderDashboardAndPressKey = ({
  key,
  meta,
}: {
  key: string;
  meta: boolean;
}) => {
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
        new KeyboardEvent('keydown', {
          key: 'Control',
          metaKey: meta,
          ctrlKey: meta,
          bubbles: true,
        })
      );
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', {
        key,
        metaKey: meta,
        ctrlKey: meta,
        bubbles: true,
      })
    );
  });
};

// TODO: fix these tests (likely need to mock TwinMaker client)
it.skip('can clear the selection', () => {
  (onSelectWidgetsAction as Mock).mockImplementation(() => ({
    type: '',
    payload: {},
  }));

  renderDashboardAndPressKey({ key: 'Escape', meta: false });

  expect(onSelectWidgetsAction).toBeCalledWith({
    widgets: [],
    union: false,
  });
});

it.skip('can send the selection to the back', () => {
  (onSendWidgetsToBackAction as Mock).mockImplementation(() => ({
    type: '',
    payload: {},
  }));

  renderDashboardAndPressKey({ key: '[', meta: false });

  expect(onSendWidgetsToBackAction).toBeCalled();
});

// TODO: fix these tests (likely need to mock TwinMaker client)
it.skip('can bring the selection to the front', () => {
  (onBringWidgetsToFrontAction as Mock).mockImplementation(() => ({
    type: '',
    payload: {},
  }));

  renderDashboardAndPressKey({ key: ']', meta: false });

  expect(onBringWidgetsToFrontAction).toBeCalled();
});

/**
 * TODO: simulating command + c and command + v does not seem to work within vi.
 * need to find a different way to do this.
 * Tried using the fireEvent util and the document dispatch directly, but could
 * not figure out a way to set the metaKey to true
 */
