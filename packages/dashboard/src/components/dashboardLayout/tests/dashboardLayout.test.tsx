import { render, screen } from '@testing-library/react';
import React from 'react';
import { DashboardLayout } from '~/components/dashboardLayout/dashboardLayout';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
const rightPane = (
  <div>
    <h2>Right Pane</h2>
  </div>
);
const leftPane = (
  <div>
    <h2>Left Pane</h2>
  </div>
);
const centerPane = (
  <div>
    <h2>Center Pane</h2>
  </div>
);

const layout = (
  <Provider store={configureDashboardStore()}>
    <DashboardLayout
      rightPane={rightPane}
      leftPane={leftPane}
      centerPane={centerPane}
    />
  </Provider>
);
describe('test dashboard layout', () => {
  it('renders the layout', () => {
    const { container } = render(layout);
    expect(container).not.toBeNull();
  });

  it('Config Panel is seen', () => {
    render(layout);
    const ConfigPane = screen.getByText('Configuration');
    expect(ConfigPane).toBeVisible();
  });

  it('Property Panel is seen', () => {
    render(layout);
    const PropertyPanel = screen.getByText('Data streams');
    expect(PropertyPanel).toBeVisible();
  });
});
