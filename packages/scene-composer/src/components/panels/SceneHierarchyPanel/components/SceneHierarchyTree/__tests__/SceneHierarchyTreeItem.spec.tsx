import { useCallback } from 'react';
import { render } from '@testing-library/react';

// eslint-disable-next-line import/order
import mockComponent from '../../../../../../../__mocks__/mockComponent';

jest.doMock('../constants', () => ({
  EnhancedTree: mockComponent('EnhancedTree'),
  EnhancedTreeItem: mockComponent('EnhancedTreeItem'),
  AcceptableDropTypes: 'AcceptableDropTypes',
}));
jest.doMock('../../SubModelTree', () => mockComponent('SubModelTree'));
jest.doMock('../SceneNodeLabel', () => mockComponent('SceneNodeLabel'));

import { useSceneHierarchyData, useChildNodes } from '../../../SceneHierarchyDataProvider';
import SceneHierarchyTreeItem from '../SceneHierarchyTreeItem';
import { KnownComponentType } from '../../../../../../interfaces';
import { isDynamicScene } from '../../../../../../utils/entityModelUtils/sceneUtils';

jest.mock('../../../../../../enhancers/draggable', () => (item: any) => item);
jest.mock('../../../../../../enhancers/droppable', () => (item: any) => item);
jest.mock('../../../SceneHierarchyDataProvider');

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn(),
}));

jest.mock('../../../../../../utils/entityModelUtils/sceneUtils');

describe('SceneHierarchyTreeItem', () => {
  const select = jest.fn();
  const unselect = jest.fn();
  const activate = jest.fn();
  const move = jest.fn();
  const getObject3DBySceneNodeRef = jest.fn();
  const getSceneNodeByRef = jest.fn();
  const remove = jest.fn();
  const isViewing = jest.fn();
  let callbacks: any[] = [];

  beforeEach(() => {
    callbacks = [];

    (useSceneHierarchyData as unknown as jest.Mock).mockImplementation(() => {
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

    (useChildNodes as unknown as jest.Mock).mockImplementation(() => [[]]);

    (useCallback as jest.Mock).mockImplementation((cb) => callbacks.push(cb));
  });

  afterEach(() => {
    jest.resetAllMocks();
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
    const mockGetObject3D = getObject3DBySceneNodeRef as jest.Mock;

    mockGetObject3D.mockImplementation(() => ({
      getObjectByName: jest.fn(() => ({ scene: 'scene' })),
    }));

    isViewing.mockImplementationOnce(() => false);

    const { container } = render(
      <SceneHierarchyTreeItem objectRef='1' name='Label 1' componentTypes={[KnownComponentType.ModelRef]} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render dynamic node with drag and drop', () => {
    isViewing.mockImplementationOnce(() => false);
    (isDynamicScene as jest.Mock).mockReturnValueOnce(true);

    const { container } = render(
      <SceneHierarchyTreeItem objectRef='1' name='Label 1' componentTypes={[KnownComponentType.Tag]} />,
    );

    expect(container).toMatchSnapshot();
  });
});
