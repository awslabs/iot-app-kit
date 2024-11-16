import { useCallback } from 'react';
import { render } from '@testing-library/react';

import SceneNodeLabel, { type SceneNodeLabelProps } from '../SceneNodeLabel';
import { useSceneHierarchyData } from '../../../SceneHierarchyDataProvider';
import { KnownComponentType } from '../../../../../../interfaces';

jest.mock('../../../../../../components/VisibilityToggle', () => 'VisibilityToggle');
jest.mock('../../../../../../assets/svgs', () => ({
  DeleteSvg: 'DeleteSVG',
}));

jest.mock('../ComponentTypeIcon', () => 'ComponentTypeIcon');

jest.mock('../../../SceneHierarchyDataProvider');
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn(),
}));

describe('SceneNodeLabel', () => {
  const toggleObjectVisibility = jest.fn();
  const remove = jest.fn();
  const validationErrors = jest.fn();
  let callbacks: any[] = [];

  beforeEach(() => {
    callbacks = [];

    (useSceneHierarchyData as unknown as jest.Mock).mockImplementation(() => {
      return {
        toggleObjectVisibility,
        remove,
        validationErrors,
      };
    });

    (useCallback as jest.Mock).mockImplementation((cb) => callbacks.push(cb));
  });

  afterEach(() => {
    jest.resetAllMocks();
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
    (useSceneHierarchyData as unknown as jest.Mock).mockImplementation(() => {
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
    (useSceneHierarchyData as unknown as jest.Mock).mockImplementation(() => {
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
