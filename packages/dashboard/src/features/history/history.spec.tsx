import { act, render, renderHook, screen, user } from '#test/testing-library';
import { RedoButton } from './redoButton';
import { UndoButton } from './undoButton';
import { useDashboardHistory } from './useHistory';

function getUndoButton() {
  return screen.getByRole('button', { name: 'Undo' });
}

function getRedoButton() {
  return screen.getByRole('button', { name: 'Redo' });
}

test('user uses undo-redo feature', async () => {
  render(
    <>
      <UndoButton />
      <RedoButton />
    </>,
    {
      preloadedState: {
        dashboard: {
          past: [
            { dashboardConfiguration: { widgets: [{ id: '1' }] } },
            { dashboardConfiguration: { widgets: [{ id: '1' }, { id: '2' }] } },
          ],
          present: {
            dashboardConfiguration: {
              widgets: [{ id: '1' }, { id: '2' }, { id: '3' }],
            },
          },
          future: [],
        },
      },
    }
  );
  const undoButton = getUndoButton();
  const redoButton = getRedoButton();

  expect(undoButton).toBeEnabled();
  expect(redoButton).toBeDisabled();

  await user.click(undoButton);

  expect(undoButton).toBeEnabled();
  expect(redoButton).toBeEnabled();

  await user.click(undoButton);

  expect(undoButton).toBeDisabled();
  expect(redoButton).toBeEnabled();

  await user.click(redoButton);

  expect(undoButton).toBeEnabled();
  expect(redoButton).toBeEnabled();

  await user.click(redoButton);

  expect(undoButton).toBeEnabled();
  expect(redoButton).toBeDisabled();
});

const stateWithPastAndFutureChanges = {
  dashboard: {
    past: [
      { dashboardConfiguration: { widgets: [{ id: '1' }] } },
      { dashboardConfiguration: { widgets: [{ id: '1' }, { id: '2' }] } },
    ],
    present: {
      dashboardConfiguration: {
        widgets: [{ id: '1' }, { id: '2' }, { id: '3' }],
      },
    },
    future: [
      {
        dashboardConfiguration: {
          widgets: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
        },
      },
    ],
  },
};

test(`${useDashboardHistory.name} provides an API for clearing history`, () => {
  const { result, store } = renderHook(() => useDashboardHistory(), {
    preloadedState: stateWithPastAndFutureChanges,
  });
  const initialDashboardState = store.getState().dashboard.past[0];
  const presentDashboardStateBeforeClearing =
    store.getState().dashboard.present;

  // past and future stacks are populated
  expect(result.current.canUndo).toBe(true);
  expect(result.current.canRedo).toBe(true);

  act(() => {
    result.current.clear();
  });

  // the present state of the dashboard does not change
  expect(store.getState().dashboard.present).toEqual(
    presentDashboardStateBeforeClearing
  );
  expect(store.getState().dashboard.present).not.toEqual(initialDashboardState);
  // past and future stacks
  expect(result.current.canUndo).toBe(false);
  expect(result.current.canRedo).toBe(false);
});

test(`${useDashboardHistory.name} provides an API for resetting history to initial state`, () => {
  const { result, store } = renderHook(() => useDashboardHistory(), {
    preloadedState: stateWithPastAndFutureChanges,
  });
  const initialDashboardState = store.getState().dashboard.past[0];
  const presentDashboardStateBeforeResetting =
    store.getState().dashboard.present;

  // past and future stacks are populated
  expect(result.current.canUndo).toBe(true);
  expect(result.current.canRedo).toBe(true);

  act(() => {
    result.current.reset();
  });

  // the present state of the dashboard is now the state before changes
  expect(store.getState().dashboard.present).toEqual(initialDashboardState);
  expect(store.getState().dashboard.present).not.toEqual(
    presentDashboardStateBeforeResetting
  );
  // past and future stacks are cleared
  expect(result.current.canUndo).toBe(false);
  expect(result.current.canRedo).toBe(false);
});
