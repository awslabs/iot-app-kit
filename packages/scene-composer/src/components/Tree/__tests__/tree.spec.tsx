import { render } from '@/tests/testing-library';
import { useRef } from 'react';

import Tree, { TreeItem } from '..';
import SceneNodeLabel from '../../panels/SceneHierarchyPanel/components/SceneHierarchyTree/SceneNodeLabel';

vi.mock('react-dnd', () => ({
  useDrag: vi.fn(() => [1, useRef(2)]),
  useDrop: vi.fn(() => [1, useRef(2)]),
}));

vi.mock('../../panels/SceneHierarchyPanel/components/SceneHierarchyTree/SceneNodeLabel', () => ({
  default: (props) => <div data-mocked='SceneNodeLabel'>{JSON.stringify(props)}</div>,
}));

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
