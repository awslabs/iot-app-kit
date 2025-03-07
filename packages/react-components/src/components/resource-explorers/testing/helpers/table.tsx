import { screen, waitFor } from '@testing-library/react';
import ue from '@testing-library/user-event';

export function createSelectLoadingResources(pluralResourceType: string) {
  return function selectLoadingResources() {
    return screen.queryByText(`Loading ${pluralResourceType.toLowerCase()}...`);
  };
}

export async function waitForLoadingToFinish() {
  await waitFor(() => {
    expect(screen.getByText(/Loading/)).toBeVisible();
  });

  await waitFor(() => {
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });
}

export function getPreviousPageButton() {
  return screen.getByRole('button', {
    name: 'Previous page',
  });
}

export async function clickPreviousPageButton() {
  await ue.click(getPreviousPageButton());
}

export function getNextPageButton() {
  return screen.getByRole('button', { name: 'Next page' });
}

export async function clickNextPageButton() {
  await ue.click(getNextPageButton());
}

export async function clickNextPageButtonWithLoading() {
  await waitFor(() => {
    ue.click(getNextPageButton());
    expect(screen.getByText(/Loading/)).toBeVisible();
  });

  await waitFor(() => {
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });
}

export async function openFilterControls() {
  await ue.click(screen.getByLabelText('Filter'));
}

export async function openUserSettings() {
  await ue.click(screen.getByRole('button', { name: 'Preferences' }));
}

export function getColumnDisplayCheckbox(columnName: string) {
  return screen.getByRole('checkbox', { name: columnName });
}

export function queryColumnDisplayCheckbox(columnName: string) {
  return screen.queryByRole('checkbox', { name: columnName });
}

export function getSearchField() {
  return screen.getByLabelText('Search');
}

export function querySearchField() {
  return screen.queryByLabelText('Search');
}

export async function typeSearchStatement(searchStatement: string) {
  await ue.type(getSearchField(), searchStatement);
}

export async function clickSearch() {
  await waitFor(() => {
    ue.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByText(/Loading/)).toBeVisible();
  });

  await waitFor(() => {
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });
}

export async function pressReturnKeyToSearch() {
  await waitFor(() => {
    ue.keyboard('{Enter}');
    expect(screen.getByText(/Loading/)).toBeVisible();
  });

  await waitFor(() => {
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });
}
