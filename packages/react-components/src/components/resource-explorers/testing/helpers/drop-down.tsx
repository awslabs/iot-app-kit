import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export function getOption(resourceName: string) {
  return screen.getByRole('option', { name: resourceName });
}

export function queryOption(resourceName: string) {
  return screen.queryByRole('option', { name: resourceName });
}

export async function open() {
  await userEvent.click(screen.getByRole('button', { name: /Select/ }));
}

export async function close() {
  await open();
}

export async function clearFilter() {
  await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
}

export async function waitForLoadingToFinish() {
  await waitFor(
    () => {
      expect(screen.getByText(/Finished/)).toBeVisible();
    },
    { timeout: 2000 }
  );
}
