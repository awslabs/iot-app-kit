import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyTableState from './emptyTableState';

describe('empty state should display', () => {
  it('empty state should display in document', () => {
    render(<EmptyTableState />);

    expect(screen.getByTestId('emptyStateTableDisplay')).toBeInTheDocument();
  });

  it('should display "No data to display" in document', async () => {
    render(<EmptyTableState />);

    expect(screen.getByTestId('default-msg')).toHaveTextContent('No data to display');
  });

  it('should display "Add asset properties" Button', async () => {
    render(<EmptyTableState />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Add asset properties');
  });
});
