import React from 'react';
import { render } from '@testing-library/react';

import { ReactMarkdownWrapper } from './ReactMarkdownWrapper';

describe('ReactMarkdownWrapper', () => {
  it('should render markdown correctly', () => {
    const { container } = render(<ReactMarkdownWrapper content='# header' className='my-class' />);
    expect(container).toMatchSnapshot();
  });
});
