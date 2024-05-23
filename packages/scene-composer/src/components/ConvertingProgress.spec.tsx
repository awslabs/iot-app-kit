import React from 'react';
import { render } from '@testing-library/react';

import { ConvertingProgress } from './ConvertingProgress';

describe('ConvertingProgress', () => {
  it('should render with correct progress with 0% done', () => {
    const { container, queryByText } = render(<ConvertingProgress total={10} converted={0} />);

    const progressBar = queryByText('0 out of 10 converted');
    expect(progressBar).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should render with correct progress with partially done', () => {
    const { container, queryByText } = render(<ConvertingProgress total={9} converted={2} />);

    const progressBar = queryByText('2 out of 9 converted');
    expect(progressBar).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should render with correct progress with all done', () => {
    const { container, queryByText } = render(<ConvertingProgress total={10} converted={10} />);

    const progressBar = queryByText('10 out of 10 converted');
    expect(progressBar).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should not render with 0 total', () => {
    const { container, queryByText } = render(<ConvertingProgress total={0} converted={0} />);

    const progressBar = queryByText('0 out of 0 converted');
    expect(progressBar).toBeNull();
  });
});
