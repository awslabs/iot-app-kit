import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '../../../store';
import {
  MOCK_BAR_WIDGET,
  MOCK_LINE_CHART_WIDGET,
} from '../../../../testing/mocks';
import WidgetTile from './tile';

describe('WidgetTile', () => {
  it('should render widget content', function () {
    render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [MOCK_LINE_CHART_WIDGET],
          },
        })}
      >
        <WidgetTile widget={MOCK_LINE_CHART_WIDGET}>
          <div>test-content</div>
        </WidgetTile>
        ;
      </Provider>
    );

    expect(screen.getByText('test-content')).toBeInTheDocument();
  });

  it('displays titlewhen widget type is "bar-chart"', () => {
    const { getByText } = render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [MOCK_LINE_CHART_WIDGET],
          },
        })}
      >
        <WidgetTile widget={MOCK_BAR_WIDGET} title='Test Title'>
          Test Children
        </WidgetTile>
      </Provider>
    );
    const titleElement = getByText('Test Title');
    expect(titleElement).toBeInTheDocument();
  });

  it('does not show download CSV in readonly mode', function () {
    const { container } = render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [MOCK_LINE_CHART_WIDGET],
          },
          isEdgeModeEnabled: true,
        })}
      >
        <WidgetTile widget={MOCK_LINE_CHART_WIDGET}>
          <div>test-content</div>
        </WidgetTile>
        ;
      </Provider>
    );

    expect(
      container.querySelector('[aria-label="download CSV"]')
    ).not.toBeInTheDocument();
  });

  it('does not show download CSV in readonly mode', function () {
    const { container } = render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [MOCK_LINE_CHART_WIDGET],
          },
          isEdgeModeEnabled: true,
        })}
      >
        <WidgetTile widget={MOCK_LINE_CHART_WIDGET}>
          <div>test-content</div>
        </WidgetTile>
        ;
      </Provider>
    );

    expect(
      container.querySelector('[aria-label="download CSV"]')
    ).not.toBeInTheDocument();
  });
});
