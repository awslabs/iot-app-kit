import React from 'react';
import { render } from '@testing-library/react';
import DashboardHeader from './dashboardHeader';

describe('DashboardHeader', () => {
  it('should render the dashboard title', () => {
    const props = {
      name: 'My Dashboard',
      editable: false,
      readOnly: true,
      onSave: jest.fn(),
      dashboardConfiguration: {
        widgets: [],
      },
      grid: {
        enabled: true,
        width: 1,
        height: 1,
        cellSize: 1,
      },
      significantDigits: 2,
    };
    const { getByText } = render(<DashboardHeader {...props} />);
    const titleElement = getByText('My Dashboard');
    expect(titleElement).toBeInTheDocument();
  });

  it('should render the TimeSelection component when editable is false', () => {
    const props = {
      name: 'My Dashboard',
      editable: false,
      readOnly: true,
      onSave: jest.fn(),
      dashboardConfiguration: {
        widgets: [],
      },
      grid: {
        enabled: true,
        width: 1,
        height: 1,
        cellSize: 1,
      },
      significantDigits: 2,
    };
    const { getByTestId } = render(<DashboardHeader {...props} />);
    const timeSelectionElement = getByTestId('time-selection');
    expect(timeSelectionElement).toBeInTheDocument();
  });
});
