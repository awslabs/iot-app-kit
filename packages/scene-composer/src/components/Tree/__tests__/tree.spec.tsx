import { useRef } from 'react';
import { render } from '@testing-library/react';

import Tree, { TreeItem } from '..';
import SceneNodeLabel from '../../panels/SceneHierarchyPanel/components/SceneHierarchyTree/SceneNodeLabel';

jest.mock('react-dnd', () => ({
  useDrag: jest.fn(() => [1, useRef(2)]),
  useDrop: jest.fn(() => [1, useRef(2)]),
}));

jest.mock('../../panels/SceneHierarchyPanel/components/SceneHierarchyTree/SceneNodeLabel', () => (props) => (
  <div data-mocked='SceneNodeLabel'>{JSON.stringify(props)}</div>
));

const mockSceneNodeLabel = ({ label }) => <SceneNodeLabel objectRef='' labelText={label} componentTypes={['']} />;

describe('<Tree />', () => {
  it('should render appropriate structure', () => {
    const { container } = render(
      <Tree>
        <TreeItem labelNode={mockSceneNodeLabel({ label: 'Level 1' })} labelText='Level 1'>
          <Tree>
            <TreeItem labelNode={mockSceneNodeLabel({ label: 'Level 2' })} labelText='Level 2'>
              <Tree>
                <TreeItem labelNode={mockSceneNodeLabel({ label: 'Level 3' })} labelText='Level 3' />
              </Tree>
            </TreeItem>
          </Tree>
        </TreeItem>
        <TreeItem labelNode={mockSceneNodeLabel({ label: 'Level 1 Sibling' })} labelText='Level 1 Sibling' />
      </Tree>,
    );

    expect(container).toMatchSnapshot();
  });
});
