import React, { useRef } from 'react';
import { render } from '@testing-library/react';

import Tree, { TreeItem } from '.';

jest.mock('react-dnd', () => ({
  useDrag: jest.fn(() => [1, useRef(2)]),
  useDrop: jest.fn(() => [1, useRef(2)]),
}));

describe('<Tree />', () => {
  it('should render appropriate structure', () => {
    const { container } = render(
      <Tree>
        <TreeItem labelText={'Level 1'}>
          <Tree>
            <TreeItem labelText={'Level 2'}>
              <Tree>
                <TreeItem labelText={'Level 1'} />
              </Tree>
            </TreeItem>
          </Tree>
        </TreeItem>
        <TreeItem labelText={'Level 1 Sibling'} />
      </Tree>,
    );

    expect(container).toMatchSnapshot();
  });
});
