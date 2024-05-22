import { screen } from '@testing-library/react';

export function createSelectLoadingResources(pluralResourceType: string) {
  return function selectLoadingResources() {
    return screen.queryByText(`Loading ${pluralResourceType.toLowerCase()}...`);
  };
}

export function selectTableSearch() {
  return screen.queryByLabelText('Search');
}

export function selectTableFilter() {
  return screen.queryByLabelText('Filter');
}

export function selectPreviousPageButton() {
  return screen.getByRole('button', {
    name: 'Previous page',
  });
}

export function selectNextPageButton() {
  return screen.getByRole('button', { name: 'Next page' });
}
