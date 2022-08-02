import React from 'react';
import { render } from '@testing-library/react';

import useSelectedNode from '../../../../hooks/useSelectedNode';
import ModelExplorerPanel from '..';

jest.mock('../Layout', () => (props) => <div data-mocked='Layout' {...props} />);
jest.mock('../ModelExplorerTreeView', () => (props) => <div data-mocked='ModelExplorerTreeView' {...props} />);
jest.mock('../../../../hooks/useSelectedNode');

describe('<ModelExplorerPanel />', () => {
  it('should render as expected', () => {
    const getObjectByName = jest.fn(() => ({ name: 'Scene', children: [] }));

    const scene = {
      name: 'Root',
      children: [
        {
          name: 'Bcene',
          children: [
            { name: 'Scene', children: [] },
            { name: 'Clean', children: [] },
          ],
        },
      ],
      getObjectByName,
    };

    (useSelectedNode as jest.Mock).mockImplementation(() => ({ getSelectedObject: () => scene }));

    const { container } = render(<ModelExplorerPanel />);

    expect(container).toMatchSnapshot();
    expect(getObjectByName).toBeCalledWith('Scene');
  });
});
