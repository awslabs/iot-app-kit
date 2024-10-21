import wrapper from '@cloudscape-design/components/test-utils/dom';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
} from '../../../testing/mocks';
import WidgetActions from './widgetActions';

describe('WidgetActions', () => {
  it('can remove a widget', function () {
    const store = configureDashboardStore({
      dashboardConfiguration: {
        widgets: [MOCK_LINE_CHART_WIDGET],
      },
    });
    const { container } = render(
      <Provider store={store}>
        <WidgetActions widget={MOCK_LINE_CHART_WIDGET} />
      </Provider>
    );

    const removeButton = wrapper(container).findButton();

    act(() => {
      removeButton?.click();
    });

    const deleteBtn = screen.getByText('Delete');
    expect(deleteBtn).toBeInTheDocument();
    act(() => {
      deleteBtn?.click();
    });
    expect(store.getState().dashboardConfiguration.widgets).toEqual([]);
  });

  it('does not show delete in readonly mode', function () {
    const { container } = render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [MOCK_LINE_CHART_WIDGET],
          },
          readOnly: true,
        })}
      >
        <WidgetActions widget={MOCK_LINE_CHART_WIDGET} />;
      </Provider>
    );

    expect(
      container.querySelector('[aria-label="delete widget"]')
    ).not.toBeInTheDocument();
  });

  it('does not show widget actions in readonly mode for kpi widget', function () {
    const { container } = render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [MOCK_KPI_WIDGET],
          },
          readOnly: true,
        })}
      >
        <WidgetActions widget={MOCK_KPI_WIDGET} />;
      </Provider>
    );

    expect(
      container.querySelector('[aria-label="widget-actions-container"]')
    ).not.toBeInTheDocument();
  });
});
