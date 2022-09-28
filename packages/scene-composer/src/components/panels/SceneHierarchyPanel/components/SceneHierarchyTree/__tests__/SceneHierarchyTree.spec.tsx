import React from 'react';
import { render } from '@testing-library/react';

import { useSceneHierarchyData } from '../../../SceneHierarchyDataProvider';
import { EnhancedTree } from '../constants';
import SceneHierarchyTree from '..';

jest.mock('../../../SceneHierarchyDataProvider');

// eslint-disable-next-line react/prop-types
jest.mock('../SceneHierarchyTreeItem', () => ({ children, ...props }) => (
  <div data-mocked='SceneHierarchyTreeItem' data-props={JSON.stringify(props)}>
    {children}
  </div>
));

jest.mock('../constants', () => ({
  EnhancedTree: jest.fn(),
}));

describe('<SceneHierarchyTree />', () => {
  it('should render as per snapshot', () => {
    (useSceneHierarchyData as any).mockImplementation(() => {
      return {
        rootNodes: [
          {
            objectRef: '1',
            someProp: 'yes',
          },
          {
            objectRef: '2',
            someProp: 'yes',
          },
          {
            objectRef: '3',
            someProp: 'yes',
          },
        ],
      };
    });

    (EnhancedTree as any).mockImplementation(({ children, ...props }) => (
      <div data-mocked='EnhancedTree' data-props={JSON.stringify(props)}>
        {children}
      </div>
    ));

    const { container } = render(<SceneHierarchyTree enableDragAndDrop={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should reparent dropped items as rootNodes', () => {
    const moveFn = jest.fn();
    const droppedRef = '111';
    let dropHandler: Function = null as unknown as Function;

    (useSceneHierarchyData as any).mockImplementation(() => {
      return {
        rootNodes: [],
        move: moveFn,
      };
    });

    (EnhancedTree as any).mockImplementation(({ onDropped }) => {
      dropHandler = onDropped;

      return <div data-mocked='EnhancedTree' />;
    });

    render(<SceneHierarchyTree enableDragAndDrop={true} />);

    expect(dropHandler).not.toBeNull();

    if (dropHandler) {
      dropHandler({ ref: droppedRef }, { beenHandled: false });
    }

    expect(moveFn).toBeCalledWith(droppedRef);
  });
});
