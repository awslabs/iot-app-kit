import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { WidgetTile } from '~/features/widget-tile';
import {
  MOCK_LINE_CHART_WIDGET,
  MOCK_TEXT_WIDGET,
} from '../../../../testing/mocks';
import { default as lineSvgDark } from '../lineScatterChart/line-dark.svg';
import StyledTextArea from '../text/styledText/textArea';
import NoChartData from './no-chart-data';

describe('NoChartData', () => {
  it('renders the correct icon and empty state widget with delete option', () => {
    const store = configureDashboardStore({
      dashboardConfiguration: {
        widgets: [MOCK_LINE_CHART_WIDGET],
      },
    });
    const { getByText, getByAltText } = render(
      <Provider store={store}>
        <WidgetTile widget={MOCK_LINE_CHART_WIDGET}>
          <NoChartData
            icon={lineSvgDark}
            emptyStateText='Browse and select to add your asset properties in your line widget.'
          />
        </WidgetTile>
        ;
      </Provider>
    );

    const icon = getByAltText('empty widget icon');
    const emptyStateText = getByText(
      'Browse and select to add your asset properties in your line widget.'
    );

    expect(icon).toBeInTheDocument();
    expect(emptyStateText).toBeInTheDocument();
  });

  it('renders the correct text widget with delete option', () => {
    const store = configureDashboardStore({
      dashboardConfiguration: {
        widgets: [MOCK_TEXT_WIDGET],
      },
    });
    const { getByText } = render(
      <Provider store={store}>
        <WidgetTile widget={MOCK_TEXT_WIDGET}>
          <StyledTextArea {...MOCK_TEXT_WIDGET} handleSetEdit={() => {}} />
        </WidgetTile>
        ;
      </Provider>
    );

    const textValue = getByText('text content');

    expect(textValue).toBeInTheDocument();
  });
});
