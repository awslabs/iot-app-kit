import { screen, waitFor } from '@testing-library/react';
import ue from '@testing-library/user-event';

export function getOption(
  resource: { name: string; description?: string } | string
) {
  if (typeof resource === 'string') {
    return screen.getByRole('option', {
      name: resource,
    });
  }

  return resource.description
    ? screen.getByRole('option', {
        name: `${resource.name} ${resource.description}`,
      })
    : screen.getByRole('option', {
        name: resource.name,
      });
}

export function queryOption(
  resource: { name: string; description?: string } | string
) {
  if (typeof resource === 'string') {
    return screen.queryByRole('option', {
      name: resource,
    });
  }

  return resource.description
    ? screen.queryByRole('option', {
        name: `${resource.name} ${resource.description}`,
      })
    : screen.queryByRole('option', {
        name: resource.name,
      });
}

export async function open() {
  await ue.click(screen.getByRole('button', { name: /Select/ }));
}

export async function close() {
  await open();
}

export async function clearFilter() {
  await ue.click(screen.getByRole('button', { name: 'Clear' }));
}

export async function waitForLoadingToFinish() {
  await waitFor(
    () => {
      expect(screen.getByRole('option', { name: /Finished/ })).toBeVisible();
    },
    { timeout: 2000 }
  );
}
