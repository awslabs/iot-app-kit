import React, { type JSXElementConstructor } from 'react';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createSelectLoadingResources,
  selectNextPageButton,
  selectPreviousPageButton,
  selectTableFilter,
  selectTableSearch,
} from './selectors';
import { CommonResourceExplorerProps } from '../../types/resource-explorer';
import { RequestFunction } from '../../types/request-fn';

export function describeDefaultConfiguration(
  pluralResourceName: string,
  ResourceExplorer: JSXElementConstructor<CommonResourceExplorerProps<unknown>>
) {
  describe('default configuration', () => {
    test('table is rendered', () => {
      render(<ResourceExplorer />);

      expect(screen.getByRole('table')).toBeVisible();
    });

    test('empty state', () => {
      render(<ResourceExplorer />);

      expect(screen.getByText(`No ${pluralResourceName.toLowerCase()}.`));
    });

    test('title is enabled', () => {
      render(<ResourceExplorer />);

      expect(screen.getByText(pluralResourceName)).toBeVisible();
      expect(screen.getByText('(0)')).toBeVisible();
    });

    test('search is not enabled', () => {
      render(<ResourceExplorer />);

      expect(screen.queryByLabelText('Search')).not.toBeInTheDocument();
    });

    test('filter is not enabled', () => {
      render(<ResourceExplorer />);

      expect(screen.queryByLabelText('Filter')).not.toBeInTheDocument();
    });

    test('user settings is not enabled', () => {
      render(<ResourceExplorer />);

      expect(
        screen.queryByRole('button', { name: 'Preferences' })
      ).not.toBeInTheDocument();
    });

    test('pagination state', () => {
      render(<ResourceExplorer />);

      const previousPageButton = selectPreviousPageButton();
      const nextPageButton = selectNextPageButton();
      expect(previousPageButton).toBeVisible();
      expect(previousPageButton).toBeDisabled();
      expect(nextPageButton).toBeVisible();
      expect(nextPageButton).toBeDisabled();
    });
  });
}

export function describeTableSettings(
  pluralResourceName: string,
  ResourceExplorer: JSXElementConstructor<CommonResourceExplorerProps<unknown>>,
  isSearchable = false
) {
  describe('table settings', () => {
    test('disable title', () => {
      render(<ResourceExplorer tableSettings={{ isTitleless: true }} />);

      expect(screen.queryByText(pluralResourceName)).not.toBeInTheDocument();
      expect(screen.queryByText('(0)')).not.toBeInTheDocument();
    });

    isSearchable &&
      test('enable search', () => {
        render(<ResourceExplorer tableSettings={{ isSearchEnabled: true }} />);

        expect(selectTableSearch()).toBeVisible();
      });

    test('enable filter', () => {
      render(<ResourceExplorer tableSettings={{ isFilterEnabled: true }} />);

      expect(selectTableFilter()).toBeVisible();
    });

    test('enable user settings', () => {
      render(
        <ResourceExplorer tableSettings={{ isUserSettingsEnabled: true }} />
      );

      expect(screen.getByRole('button', { name: 'Preferences' })).toBeVisible();
    });
  });
}

export function describeDropdownVariant({
  ResourceExplorer,
}: {
  ResourceExplorer: JSXElementConstructor<CommonResourceExplorerProps<unknown>>;
}) {
  describe('drop-down variant', () => {
    test('drop-down is rendered', () => {
      render(<ResourceExplorer variant='drop-down' />);

      expect(screen.getByRole('button')).toBeVisible();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });
}

export function describeRequestManagement({
  pluralResourceName,
  singlePageTest,
  singleListPaginationTest,
  multipleListPaginationWithFullPagesTest,
  ResourceExplorer,
}: {
  pluralResourceName: string;
  singlePageTest: {
    requestFns: Record<string, RequestFunction<unknown, unknown>>;
  };
  singleListPaginationTest: {
    requestFns: Record<string, RequestFunction<unknown, unknown>>;
  };
  multipleListPaginationWithFullPagesTest: {
    parameters: readonly unknown[];
    requestFns: Record<string, RequestFunction<unknown, unknown>>;
  };
  ResourceExplorer: JSXElementConstructor<
    CommonResourceExplorerProps<unknown> & { parameters?: readonly any[] }
  >;
}) {
  const selectLoadingResources =
    createSelectLoadingResources(pluralResourceName);

  describe('request management', () => {
    test('single page', async () => {
      const { requestFns } = singlePageTest;
      render(<ResourceExplorer requestFns={requestFns} />);

      expect(selectLoadingResources()).toBeVisible();

      await waitForElementToBeRemoved(() => selectLoadingResources());

      Object.values(requestFns).forEach((requestFn) => {
        expect(requestFn).toHaveBeenCalledOnce();
      });
    });

    test('single list pagination', async () => {
      const { requestFns } = singleListPaginationTest;
      const user = userEvent.setup();
      render(<ResourceExplorer requestFns={requestFns} />);

      const previousPageButton = selectPreviousPageButton();
      const nextPageButton = selectNextPageButton();

      expect(previousPageButton).toBeDisabled();
      expect(nextPageButton).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByText('(10)')).toBeVisible();
        expect(previousPageButton).toBeDisabled();
        expect(nextPageButton).not.toBeDisabled();
        Object.values(requestFns).forEach((requestFn) => {
          expect(requestFn).toHaveBeenCalledOnce();
        });
      });

      await user.click(nextPageButton);

      await waitFor(() => {
        expect(screen.getByText('(20)')).toBeVisible();
        expect(previousPageButton).not.toBeDisabled();
        expect(nextPageButton).not.toBeDisabled();
        Object.values(requestFns).forEach((requestFn) => {
          expect(requestFn).toHaveBeenCalledTimes(2);
        });
      });

      await user.click(nextPageButton);

      await waitFor(() => {
        expect(screen.getByText('(30)')).toBeVisible();
        expect(previousPageButton).not.toBeDisabled();
        expect(nextPageButton).toBeDisabled();
        Object.values(requestFns).forEach((requestFn) => {
          expect(requestFn).toHaveBeenCalledTimes(3);
        });
      });

      await user.click(previousPageButton);

      expect(selectLoadingResources()).not.toBeInTheDocument();
      expect(previousPageButton).not.toBeDisabled();
      expect(nextPageButton).not.toBeDisabled();
      Object.values(requestFns).forEach((requestFn) => {
        expect(requestFn).toHaveBeenCalledTimes(3);
      });

      await user.click(previousPageButton);

      expect(selectLoadingResources()).not.toBeInTheDocument();
      expect(previousPageButton).toBeDisabled();
      expect(nextPageButton).not.toBeDisabled();
      Object.values(requestFns).forEach((requestFn) => {
        expect(requestFn).toHaveBeenCalledTimes(3);
      });

      await user.click(nextPageButton);

      expect(selectLoadingResources()).not.toBeInTheDocument();
      expect(previousPageButton).not.toBeDisabled();
      expect(nextPageButton).not.toBeDisabled();
      Object.values(requestFns).forEach((requestFn) => {
        expect(requestFn).toHaveBeenCalledTimes(3);
      });

      await user.click(nextPageButton);

      expect(selectLoadingResources()).not.toBeInTheDocument();
      expect(previousPageButton).not.toBeDisabled();
      expect(nextPageButton).toBeDisabled();
      Object.values(requestFns).forEach((requestFn) => {
        expect(requestFn).toHaveBeenCalledTimes(3);
      });
    });

    test('multiple list pagination', async () => {
      const { parameters, requestFns } =
        multipleListPaginationWithFullPagesTest;
      const user = userEvent.setup();
      render(
        <ResourceExplorer parameters={parameters} requestFns={requestFns} />
      );

      const previousPageButton = selectPreviousPageButton();
      const nextPageButton = selectNextPageButton();

      await waitFor(() => {
        Object.values(requestFns).forEach((requestFn) => {
          expect(requestFn).toHaveBeenCalledOnce();
        });
        expect(nextPageButton).not.toBeDisabled();
      });

      await user.click(nextPageButton);

      await waitFor(() => {
        expect(screen.getByText('(20)')).toBeVisible();
        Object.values(requestFns).forEach((requestFn) => {
          expect(requestFn).toHaveBeenCalledTimes(4);
        });
      });

      await user.click(nextPageButton);

      await waitFor(() => {
        Object.values(requestFns).forEach((requestFn) => {
          expect(requestFn).toHaveBeenCalledTimes(6);
        });
      });

      await user.click(nextPageButton);

      await waitFor(() => {
        Object.values(requestFns).forEach((requestFn) => {
          expect(requestFn).toHaveBeenCalledTimes(7);
        });
      });

      await user.click(previousPageButton);

      expect(selectLoadingResources()).not.toBeInTheDocument();
      expect(previousPageButton).not.toBeDisabled();
      expect(nextPageButton).not.toBeDisabled();
      Object.values(requestFns).forEach((requestFn) => {
        expect(requestFn).toHaveBeenCalledTimes(7);
      });

      await user.click(previousPageButton);

      expect(selectLoadingResources()).not.toBeInTheDocument();
      expect(previousPageButton).not.toBeDisabled();
      expect(nextPageButton).not.toBeDisabled();
      Object.values(requestFns).forEach((requestFn) => {
        expect(requestFn).toHaveBeenCalledTimes(7);
      });

      await user.click(previousPageButton);

      expect(selectLoadingResources()).not.toBeInTheDocument();
      expect(previousPageButton).toBeDisabled();
      expect(nextPageButton).not.toBeDisabled();
      Object.values(requestFns).forEach((requestFn) => {
        expect(requestFn).toHaveBeenCalledTimes(7);
      });

      await user.click(nextPageButton);

      expect(selectLoadingResources()).not.toBeInTheDocument();
      expect(previousPageButton).not.toBeDisabled();
      expect(nextPageButton).not.toBeDisabled();
      Object.values(requestFns).forEach((requestFn) => {
        expect(requestFn).toHaveBeenCalledTimes(7);
      });

      await user.click(nextPageButton);

      expect(selectLoadingResources()).not.toBeInTheDocument();
      expect(previousPageButton).not.toBeDisabled();
      expect(nextPageButton).not.toBeDisabled();
      Object.values(requestFns).forEach((requestFn) => {
        expect(requestFn).toHaveBeenCalledTimes(7);
      });

      await user.click(nextPageButton);

      expect(selectLoadingResources()).not.toBeInTheDocument();
      expect(previousPageButton).not.toBeDisabled();
      expect(nextPageButton).toBeDisabled();
      Object.values(requestFns).forEach((requestFn) => {
        expect(requestFn).toHaveBeenCalledTimes(7);
      });
    });
  });
}

export function describeTableSelection({
  pluralResourceName,
  singleSelectTest,
  multiSelectTest,
}: {
  pluralResourceName: string;
  singleSelectTest: {
    ResourceExplorer: JSXElementConstructor<unknown>;
  };
  multiSelectTest: {
    ResourceExplorer: JSXElementConstructor<unknown>;
  };
}) {
  const selectLoadingResources =
    createSelectLoadingResources(pluralResourceName);

  describe('table selection', () => {
    test('single select', async () => {
      const { ResourceExplorer } = singleSelectTest;
      const user = userEvent.setup();
      render(<ResourceExplorer />);

      await waitForElementToBeRemoved(() => selectLoadingResources());

      const radios = screen.getAllByRole('radio');
      expect(radios.length).toBe(3);
      const [radio1, radio2, radio3] = radios;

      expect(radio1).toBeVisible();
      expect(radio1).not.toBeChecked();
      expect(radio2).toBeVisible();
      expect(radio2).not.toBeChecked();
      expect(radio3).toBeVisible();
      expect(radio3).not.toBeChecked();

      await user.click(radio1);

      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();
      expect(radio3).not.toBeChecked();

      await user.click(radio2);

      expect(radio1).not.toBeChecked();
      expect(radio2).toBeChecked();
      expect(radio3).not.toBeChecked();

      await user.click(radio3);

      expect(radio1).not.toBeChecked();
      expect(radio2).not.toBeChecked();
      expect(radio3).toBeChecked();
    });

    test('multi select', async () => {
      const { ResourceExplorer } = multiSelectTest;
      const user = userEvent.setup();
      render(<ResourceExplorer />);

      await waitForElementToBeRemoved(() => selectLoadingResources());

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBe(4);
      const [topLevelCheckbox, checkbox1, checkbox2, checkbox3] = checkboxes;

      expect(topLevelCheckbox).not.toBeChecked();
      expect(checkbox1).not.toBeChecked();
      expect(checkbox2).not.toBeChecked();
      expect(checkbox3).not.toBeChecked();

      await user.click(checkbox1);

      expect(topLevelCheckbox).not.toBeChecked();
      expect(checkbox1).toBeChecked();
      expect(checkbox2).not.toBeChecked();
      expect(checkbox3).not.toBeChecked();

      await user.click(checkbox2);

      expect(topLevelCheckbox).not.toBeChecked();
      expect(checkbox1).toBeChecked();
      expect(checkbox2).toBeChecked();
      expect(checkbox3).not.toBeChecked();

      await user.click(checkbox3);

      expect(topLevelCheckbox).toBeChecked();
      expect(checkbox1).toBeChecked();
      expect(checkbox2).toBeChecked();
      expect(checkbox3).toBeChecked();

      await user.click(topLevelCheckbox);

      expect(topLevelCheckbox).not.toBeChecked();
      expect(checkbox1).not.toBeChecked();
      expect(checkbox2).not.toBeChecked();
      expect(checkbox3).not.toBeChecked();

      await user.click(topLevelCheckbox);

      expect(topLevelCheckbox).toBeChecked();
      expect(checkbox1).toBeChecked();
      expect(checkbox2).toBeChecked();
      expect(checkbox3).toBeChecked();
    });
  });
}
