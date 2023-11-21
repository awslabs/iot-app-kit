import React from 'react';
import { Provider } from 'react-redux';
import { act, render, screen } from '@testing-library/react';
import NoChartData from './no-chart-data';
import { default as lineSvgDark } from '../lineScatterChart/line-dark.svg';
import WidgetTile from '~/components/widgets/tile/tile';
import { configureDashboardStore } from '~/store';
import { MOCK_LINE_CHART_WIDGET, MOCK_TEXT_WIDGET } from '../../../../testing/mocks';
import StyledTextArea from '../text/styledText/textArea';

describe('NoChartData', () => {
  it('renders the correct icon and empty state widget with delete option', () => {
    const store = configureDashboardStore({
      dashboardConfiguration: {
        widgets: [MOCK_LINE_CHART_WIDGET],
      },
    });
    const { getByText, getByAltText, getByTitle } = render(
      <Provider store={store}>
        <WidgetTile widget={MOCK_LINE_CHART_WIDGET} removeable>
          <NoChartData
            icon={lineSvgDark}
            emptyStateText='Browse and select to add your asset properties in your line widget.'
          />
        </WidgetTile>
        ;
      </Provider>
    );

    const icon = getByAltText('empty widget icon');
    const emptyStateText = getByText('Browse and select to add your asset properties in your line widget.');
    const deleteButton = getByTitle('delete widget');

    expect(icon).toBeInTheDocument();
    expect(emptyStateText).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    act(() => {
      deleteButton?.click();
    });

    const deleteBtn = screen.getByText('Delete');
    expect(deleteBtn).toBeInTheDocument();
    act(() => {
      deleteBtn?.click();
    });
    expect(store.getState().dashboardConfiguration.widgets).toEqual([]);
  });

  it('renders the correct text widget with delete option', () => {
    const store = configureDashboardStore({
      dashboardConfiguration: {
        widgets: [MOCK_TEXT_WIDGET],
      },
    });
    const { getByText, getByTitle } = render(
      <Provider store={store}>
        <WidgetTile widget={MOCK_TEXT_WIDGET} removeable>
          <StyledTextArea {...MOCK_TEXT_WIDGET} handleSetEdit={() => {}} />
        </WidgetTile>
        ;
      </Provider>
    );

    const textValue = getByText('text content');
    const deleteButton = getByTitle('delete widget');

    expect(textValue).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    act(() => {
      deleteButton?.click();
    });

    const deleteBtn = screen.getByText('Delete');
    expect(deleteBtn).toBeInTheDocument();
    act(() => {
      deleteBtn?.click();
    });
    expect(store.getState().dashboardConfiguration.widgets).toEqual([]);
  });
});
