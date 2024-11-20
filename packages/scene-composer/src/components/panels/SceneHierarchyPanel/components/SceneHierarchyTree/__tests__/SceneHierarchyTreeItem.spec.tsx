import { render } from '@/tests/testing-library';
import { useCallback } from 'react';
import type { Mock } from 'vitest';
import mockComponent from '../../../../../../../__mocks__/mockComponent';

vi.doMock('../constants', () => ({
  EnhancedTree: mockComponent('EnhancedTree'),
  EnhancedTreeItem: mockComponent('EnhancedTreeItem'),
  AcceptableDropTypes: 'AcceptableDropTypes',
}));
vi.doMock('../../SubModelTree', () => mockComponent('SubModelTree'));
vi.doMock('../SceneNodeLabel', () => mockComponent('SceneNodeLabel'));

import { KnownComponentType } from '../../../../../../interfaces';
import { isDynamicScene } from '../../../../../../utils/entityModelUtils/sceneUtils';
import { useChildNodes, useSceneHierarchyData } from '../../../SceneHierarchyDataProvider';
import SceneHierarchyTreeItem from '../SceneHierarchyTreeItem';

vi.mock('../../../../../../enhancers/draggable', () => ({ default: (item: any) => item }));
vi.mock('../../../../../../enhancers/droppable', () => ({ default: (item: any) => item }));
vi.mock('../../../SceneHierarchyDataProvider');

vi.mock('react', async () => ({
  ...(await vi.importActual('react')),
  useCallback: vi.fn(),
}));

vi.mock('../../../../../../utils/entityModelUtils/sceneUtils');

describe('SceneHierarchyTreeItem', () => {
  const select = vi.fn();
  const unselect = vi.fn();
  const activate = vi.fn();
  const move = vi.fn();
  const getObject3DBySceneNodeRef = vi.fn();
  const getSceneNodeByRef = vi.fn();
  const remove = vi.fn();
  const isViewing = vi.fn();
  let callbacks: any[] = [];

  beforeEach(() => {
    callbacks = [];

    (useSceneHierarchyData as unknown as Mock).mockImplementation(() => {
      return {
        selected: '1',
        select,
        unselect,
        activate,
        move,
        getObject3DBySceneNodeRef,
        getSceneNodeByRef,
        selectionMode: 'single',
        remove,
        isViewing,
        validationErrors: {},
      };
    });

    (useChildNodes as unknown as Mock).mockImplementation(() => [[]]);

    (useCallback as Mock).mockImplementation((cb) => callbacks.push(cb));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should unselect when toggled off', () => {
    render(<SceneHierarchyTreeItem objectRef='1' name='Label 1' componentTypes={['modelRef']} />);

    const [, onToggle] = callbacks;

    onToggle(false);

    expect(unselect).toBeCalled();
    expect(select).not.toBeCalled();
  });

  it('should select when toggled on', () => {
    render(<SceneHierarchyTreeItem objectRef='1' name='Label 1' componentTypes={['modelRef']} />);

    const [, onToggle] = callbacks;

    onToggle(true);

    expect(unselect).not.toBeCalled();
    expect(select).toBeCalled();
  });

  it('should bubble up when expanded', () => {
    getSceneNodeByRef.mockReturnValueOnce({ childRefs: ['one'] });
    const { container } = render(
      <SceneHierarchyTreeItem objectRef='1' name='Label 1' componentTypes={['modelRef']} expanded={false} />,
    );

    const [onExpandNode] = callbacks;

    onExpandNode(true);
    expect(container).toMatchSnapshot();
  });

  it('should activate and select on activation', () => {
    render(<SceneHierarchyTreeItem objectRef='1' name='Label 1' componentTypes={['modelRef']} />);

    const [, , onActivated] = callbacks;
    onActivated();

    expect(activate).toBeCalledWith('1');
    expect(select).toBeCalledWith('1');
  });

  it('should reparent item when dropped', () => {
    render(<SceneHierarchyTreeItem objectRef='1' name='Label 1' componentTypes={['ModelRef']} />);

    const [, , , dropHandler] = callbacks;

    dropHandler({ ref: 'droppedItem' }, { beenHandled: false });

    expect(move).toBeCalledWith('droppedItem', '1');
  });

  it('should render SubModelTree when item has a model, and not in view mode', () => {
    const mockGetObject3D = getObject3DBySceneNodeRef as Mock;

    mockGetObject3D.mockImplementation(() => ({
      getObjectByName: vi.fn(() => ({ scene: 'scene' })),
    }));

    isViewing.mockImplementationOnce(() => false);

    const { container } = render(
      <SceneHierarchyTreeItem objectRef='1' name='Label 1' componentTypes={[KnownComponentType.ModelRef]} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render dynamic node with drag and drop', () => {
    isViewing.mockImplementationOnce(() => false);
    (isDynamicScene as Mock).mockReturnValueOnce(true);

    const { container } = render(
      <SceneHierarchyTreeItem objectRef='1' name='Label 1' componentTypes={[KnownComponentType.Tag]} />,
    );

    expect(container).toMatchSnapshot();
  });
});
