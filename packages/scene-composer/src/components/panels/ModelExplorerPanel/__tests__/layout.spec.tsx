import React from 'react';
import { render } from '@testing-library/react';

import Layout from '../Layout';

describe('<ModelExplorerPanelLayout />', () => {
  it('should render help text when inactive', () => {
    const { container } = render(<Layout active={false}>Some Text</Layout>);
    expect(container).toMatchSnapshot();
  });

  it('should render children when active', () => {
    const { container } = render(<Layout active>Some Text</Layout>);
    expect(container).toMatchSnapshot();
  });
});
