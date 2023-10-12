import React from 'react';
import { render } from '@testing-library/react';
import Tooltip from './tooltip';

describe('Tooltip', () => {
  it('renders the children correctly', () => {
    const { getByText } = render(
      <Tooltip content='Tooltip content' position='top'>
        {' '}
        <button>Button</button>{' '}
      </Tooltip>
    );
    expect(getByText('Button')).toBeInTheDocument();
  });

  it('renders the tooltip content correctly', () => {
    const { getByText } = render(
      <Tooltip content='Tooltip content' position='top'>
        {' '}
        <button>Button</button>{' '}
      </Tooltip>
    );
    expect(getByText('Tooltip content')).toBeInTheDocument();
  });

  it('applies the correct position class', () => {
    const { container } = render(
      <Tooltip content='Tooltip content' position='top'>
        {' '}
        <button>Button</button>{' '}
      </Tooltip>
    );
    expect(container.querySelector('.tooltip-text.top')).toBeInTheDocument();
  });
});
