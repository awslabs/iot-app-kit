import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyTableComponent from './emptyTableComponent';

describe('empty state should display', () => {
  it('empty state should display in document', () => {
    render(<EmptyTableComponent />);

    expect(screen.getByTestId('emptyStateTableDisplay')).toBeInTheDocument();
  });

  it('should display "No data to display" in document', async () => {
    render(<EmptyTableComponent />);

    expect(screen.getByTestId('default-msg')).toHaveTextContent(
      'No data to display'
    );
  });
});
