import { render } from '@testing-library/react';
import { useCallback } from 'react';

import { KnownComponentType } from '../../../../../../interfaces';
import { useSceneHierarchyData } from '../../../SceneHierarchyDataProvider';
import SceneNodeLabel, { type SceneNodeLabelProps } from '../SceneNodeLabel';

vi.mock('../../../../../../components/VisibilityToggle', () => 'VisibilityToggle');
vi.mock('../../../../../../assets/svgs', () => ({
  DeleteSvg: 'DeleteSVG',
}));

vi.mock('../ComponentTypeIcon', () => 'ComponentTypeIcon');

vi.mock('../../../SceneHierarchyDataProvider');
vi.mock('react', () => ({
  ...vi.importActual('react'),
  useCallback: vi.fn(),
}));

describe('SceneNodeLabel', () => {
  const toggleObjectVisibility = vi.fn();
  const remove = vi.fn();
  const validationErrors = vi.fn();
  let callbacks: any[] = [];

  beforeEach(() => {
    callbacks = [];

    (useSceneHierarchyData as unknown as vi.Mock).mockImplementation(() => {
      return {
        toggleObjectVisibility,
        remove,
        validationErrors,
      };
    });

    (useCallback as vi.Mock).mockImplementation((cb) => callbacks.push(cb));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const defaultParams: SceneNodeLabelProps = {
    dataTestid: 'testid',
    objectRef: '123',
    labelText: 'Text',
    componentTypes: [KnownComponentType.ModelRef],
  };

  it(`should render with no errors`, () => {
    const { container } = render(<SceneNodeLabel {...defaultParams} />);
    expect(container).toMatchSnapshot();
  });

  it(`should allow deleting node if there's errors`, () => {
    const batmanParams = {
      ...defaultParams,
      objectRef: 'Batman',
    };
    (useSceneHierarchyData as unknown as vi.Mock).mockImplementation(() => {
      return {
        validationErrors: { [batmanParams.objectRef]: 'There is an error' },
      };
    });

    const { container } = render(<SceneNodeLabel {...batmanParams} />);
    expect(container).toMatchSnapshot();
  });

  it('should toggle visibility', () => {
    const batmanParams = {
      ...defaultParams,
      objectRef: 'Batman',
    };
    render(<SceneNodeLabel {...batmanParams} />);

    const [toggleVisibility] = callbacks;

    toggleVisibility(true);

    expect(toggleObjectVisibility).toBeCalledWith(batmanParams.objectRef);

    toggleVisibility(false);

    expect(toggleObjectVisibility).toBeCalledWith(batmanParams.objectRef);
  });

  it('should delete node when delete button is clicked', () => {
    const batmanParams = {
      ...defaultParams,
      objectRef: 'Batman',
      componentTypes: [],
    };
    (useSceneHierarchyData as unknown as vi.Mock).mockImplementation(() => {
      return {
        validationErrors: { [batmanParams.objectRef]: 'There is an error' },
        remove,
      };
    });

    render(<SceneNodeLabel {...batmanParams} />);

    const [, onDelete] = callbacks;

    onDelete();

    expect(remove).toBeCalledWith(batmanParams.objectRef);
  });

  it('should not render an icon if there is no matching type', () => {
    const noComponentIconParams = {
      ...defaultParams,
      componentTypes: [],
    };

    const { container } = render(<SceneNodeLabel {...noComponentIconParams} />);
    expect(container).toMatchSnapshot();
  });
});
