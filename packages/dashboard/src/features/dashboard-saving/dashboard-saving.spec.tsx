import React from 'react';
import {
  stateWithEditMode,
  stateWithPastAndFuture,
  stateWithSelectedWidgets,
} from '~/test/state-scenarios';
import { render, screen, user } from '~/test/testing-library';
import { CancelButton } from './cancel-button';
import { SaveButton } from './save-button';

const getSaveButton = () => screen.getByRole('button', { name: 'Save' });
const getCancelButton = () => screen.getByRole('button', { name: 'Cancel' });
const getCancelModal = () => screen.getByRole('dialog');
const queryCancelModal = () => screen.queryByRole('dialog');

test('user saves their changes with the save button', async () => {
  const onSave = jest.fn();
  const { store } = render(<SaveButton />, {
    dashboardContextState: {
      onSave,
    },
    preloadedState: [
      stateWithEditMode,
      stateWithPastAndFuture,
      stateWithSelectedWidgets,
    ],
  });
  const initialDashboardState = store.getState().dashboard.past[0];
  const presentDashboardStateBeforeSave = store.getState().dashboard.present;

  // user saves their changes
  await user.click(getSaveButton());

  // dashboard is saved with current dashboard configuration
  expect(onSave).toHaveBeenCalledWith(
    presentDashboardStateBeforeSave.dashboardConfiguration
  );
  // user leaves edit mode
  expect(store.getState().mode).toBe('view');
  // dashboard is state remain constant
  expect(store.getState().dashboard.present).toEqual(
    presentDashboardStateBeforeSave
  );
  expect(store.getState().dashboard.present).not.toEqual(initialDashboardState);
  // selection is cleared
  expect(store.getState().selection.selectedWidgetIds).toEqual([]);
  // dashboard history is cleared
  expect(store.getState().dashboard.past).toEqual([]);
  expect(store.getState().dashboard.future).toEqual([]);
});

test('user resets their changes with the cancel button', async () => {
  const onSave = jest.fn();
  const { store } = render(<CancelButton />, {
    dashboardContextState: {
      onSave,
    },
    preloadedState: [
      stateWithEditMode,
      stateWithPastAndFuture,
      stateWithSelectedWidgets,
    ],
  });
  const initialDashboardState = store.getState().dashboard.past[0];
  const presentDashboardStateBeforeCancel = store.getState().dashboard.present;
  const cancelButton = getCancelButton();

  // confirmation modal is hidden
  expect(queryCancelModal()).not.toBeInTheDocument();

  // user decides to cancel their changes
  await user.click(cancelButton);

  // confirmation modal appears
  expect(getCancelModal()).toBeVisible();

  // user confirms they want to cancel
  await user.click(screen.getByRole('button', { name: 'Yes' }));

  // cancel changes modal is closed
  expect(queryCancelModal()).not.toBeInTheDocument();
  // user returns to view mode
  expect(store.getState().mode).toBe('view');
  // dashboard is not saved
  expect(onSave).not.toHaveBeenCalled();
  // dashboard changes get reverted
  expect(store.getState().dashboard.present).toEqual(initialDashboardState);
  expect(store.getState().dashboard.present).not.toEqual(
    presentDashboardStateBeforeCancel
  );
  // user select is cleared
  expect(store.getState().selection.selectedWidgetIds).toEqual([]);
  // dashboard history is cleared
  expect(store.getState().dashboard.past).toEqual([]);
  expect(store.getState().dashboard.future).toEqual([]);
});

test('user decides to keep editing', async () => {
  const onSave = jest.fn();
  const { store } = render(<CancelButton />, {
    dashboardContextState: {
      onSave,
    },
    preloadedState: [
      stateWithEditMode,
      stateWithPastAndFuture,
      stateWithSelectedWidgets,
    ],
  });
  const initialDashboardState = store.getState().dashboard.past[0];
  const presentDashboardStateBeforeCancel = store.getState().dashboard.present;
  const cancelButton = getCancelButton();

  // confirmation modal is hidden
  expect(queryCancelModal()).not.toBeInTheDocument();

  // user decides to cancel their changes
  await user.click(cancelButton);

  // confirmation modal appears
  expect(getCancelModal()).toBeVisible();

  // user decides they do not want to cancel their changes
  await user.click(screen.getByRole('button', { name: 'No' }));

  // cancel changes modal is closed
  expect(queryCancelModal()).not.toBeInTheDocument();
  // user remains in edit mode
  expect(store.getState().mode).toBe('edit');
  // dashboard is not saved
  expect(onSave).not.toHaveBeenCalled();
  // dashboard changes do not get reverted
  expect(store.getState().dashboard.present).toEqual(
    presentDashboardStateBeforeCancel
  );
  expect(store.getState().dashboard.present).not.toEqual(initialDashboardState);
  // selection is not cleared
  expect(store.getState().selection.selectedWidgetIds).toEqual(
    stateWithSelectedWidgets.selection.selectedWidgetIds
  );
  // dashboard history is not cleared
  expect(store.getState().dashboard.past).toEqual(
    stateWithPastAndFuture.dashboard.past
  );
  expect(store.getState().dashboard.future).toEqual(
    stateWithPastAndFuture.dashboard.future
  );
});

test('buttons are disabled during saving', () => {
  render(
    <>
      <CancelButton />
      <SaveButton />
    </>,
    { preloadedState: { saving: { status: 'saving' } } }
  );

  expect(getCancelButton()).toBeDisabled();
  expect(getSaveButton()).toBeDisabled();
  expect(screen.getByText('Saving dashboard')).toBeInTheDocument();
  // saving dashboard text is not visible - for screen readers
  expect(screen.getByText('Saving dashboard')).toHaveAttribute(
    'aria-hidden',
    'true'
  );
});
