import React from 'react';
import { render } from '@testing-library/react';
import NoChartData from './no-chart-data';

describe('NoChartData', () => {
  it('renders the component with the correct icon and empty state text', () => {
    const icon = 'path/to/icon.png';
    const emptyStateText = 'No chart data available';

    const { getByAltText, getByText } = render(<NoChartData icon={icon} emptyStateText={emptyStateText} />);

    expect(getByAltText('empty widget icon')).toBeInTheDocument();
    expect(getByText('No chart data available')).toBeInTheDocument();
  });
});
