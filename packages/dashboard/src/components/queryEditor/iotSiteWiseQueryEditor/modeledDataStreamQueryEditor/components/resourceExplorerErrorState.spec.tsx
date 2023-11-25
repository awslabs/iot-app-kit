import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResourceExplorerErrorState } from './resourceExplorerErrorState';

describe('Error component', () => {
  test('renders the title correctly', () => {
    const title = 'Test Error';
    render(<ResourceExplorerErrorState title={title} />);
    const titleLabel = screen.getByText('Test Error');
    expect(titleLabel).toHaveTextContent(title);
  });

  test('renders the error message correctly', () => {
    render(<ResourceExplorerErrorState />);
    const errorMessage = screen.getByText('an error has occurred.');
    expect(errorMessage).toBeInTheDocument();
  });
});
