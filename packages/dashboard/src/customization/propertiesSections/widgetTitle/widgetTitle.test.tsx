import React from 'react';
import { Provider } from 'react-redux';
import { getByLabelText, getByPlaceholderText, queryByLabelText, render } from '@testing-library/react';
import { configureDashboardStore } from '~/store';
import { DashboardWidget } from '~/types';
import { WidgetTitle } from './index';
import {
  MOCK_LINE_CHART_WIDGET,
  MOCK_TEXT_WIDGET,
  MOCK_KPI_WIDGET,
  MOCK_RECTANGLE_WIDGET,
} from '../../../../testing/mocks';

const store = (widgets: DashboardWidget) =>
  configureDashboardStore({
    dashboardConfiguration: {
      widgets: [widgets],
    },
    selectedWidgets: [widgets],
  });

const TestComponent = (widget: DashboardWidget) => (
  <Provider store={store(widget)}>
    <WidgetTitle />
  </Provider>
);

it('renders', () => {
  const elem = render(<TestComponent {...MOCK_LINE_CHART_WIDGET} />).baseElement;
  expect(elem).toBeTruthy();
});

it('renders the widget title input', () => {
  const TITLE_WIDGETS = [MOCK_LINE_CHART_WIDGET];
  TITLE_WIDGETS.map((widget) => {
    const elem = render(<TestComponent {...widget} />).baseElement;
    expect(getByLabelText(elem, 'Widget title')).toBeTruthy();
    expect(getByPlaceholderText(elem, 'Input title')).toBeTruthy();
  });
});

it('renders the without widget title input', () => {
  const NO_TITLE_WIDGETS = [MOCK_KPI_WIDGET, MOCK_RECTANGLE_WIDGET, MOCK_TEXT_WIDGET];
  NO_TITLE_WIDGETS.map((widget) => {
    const elem = render(<TestComponent {...widget} />).baseElement;
    expect(queryByLabelText(elem, 'Widget title')).toBeNull();
    expect(queryByLabelText(elem, 'Input title')).toBeNull();
  });
});
