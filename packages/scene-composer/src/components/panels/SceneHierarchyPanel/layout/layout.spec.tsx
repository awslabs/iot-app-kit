import React from 'react';
import { render } from '@testing-library/react';

import Layout, { Main, ActionBar, Toolbar } from '.';

describe('<SceneHierarchyPanelLayout />', () => {
  it('should render appropriate structure', () => {
    const { container } = render(
      <Layout>
        <Toolbar>
          Search Box
          <ActionBar>Tools</ActionBar>
        </Toolbar>
        <Main>Main</Main>
      </Layout>,
    );

    expect(container).toMatchSnapshot();
  });
});
