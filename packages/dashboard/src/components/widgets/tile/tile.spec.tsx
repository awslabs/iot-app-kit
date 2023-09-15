import React from 'react';
import { Provider } from 'react-redux';

import wrapper from '@cloudscape-design/components/test-utils/dom';

import { act, render } from '@testing-library/react';

import { screen } from '@testing-library/dom';

import WidgetTile from './tile';
import { configureDashboardStore } from '~/store';
import { MOCK_LINE_CHART_WIDGET } from '../../../../testing/mocks';

describe('WidgetTile', () => {
  it('should render widget content', function () {
    render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [MOCK_LINE_CHART_WIDGET],
            viewport: { duration: '5m' },
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

  it('should render a title', function () {
    render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [MOCK_LINE_CHART_WIDGET],
            viewport: { duration: '5m' },
          },
        })}
      >
        <WidgetTile title='test-title' widget={MOCK_LINE_CHART_WIDGET}>
          <div>test-content</div>
        </WidgetTile>
        ;
      </Provider>
    );

    expect(screen.getByText('test-title')).toBeInTheDocument();
  });

  it('can remove a widget', function () {
    const store = configureDashboardStore({
      dashboardConfiguration: {
        widgets: [MOCK_LINE_CHART_WIDGET],
        viewport: { duration: '5m' },
      },
    });
    const { container } = render(
      <Provider store={store}>
        <WidgetTile removeable widget={MOCK_LINE_CHART_WIDGET}>
          <div>test-content</div>
        </WidgetTile>
        ;
      </Provider>
    );

    const removeButton = wrapper(container).findButton();

    act(() => {
      removeButton?.click();
    });

    expect(store.getState().dashboardConfiguration.widgets).toEqual([]);
  });

  it('does not show delete in readonly mode', function () {
    const { container } = render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [MOCK_LINE_CHART_WIDGET],
            viewport: { duration: '5m' },
          },
          readOnly: true,
        })}
      >
        <WidgetTile removeable widget={MOCK_LINE_CHART_WIDGET}>
          <div>test-content</div>
        </WidgetTile>
        ;
      </Provider>
    );

    expect(container.querySelector('[aria-label="delete widget"]')).not.toBeInTheDocument();
  });
});
