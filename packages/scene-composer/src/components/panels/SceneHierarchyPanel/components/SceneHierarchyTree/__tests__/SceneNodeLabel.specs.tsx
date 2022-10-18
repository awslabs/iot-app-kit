import React, { useCallback } from 'react';
import { render } from '@testing-library/react';

import SceneNodeLabel from '../SceneNodeLabel';
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
  const show = jest.fn();
  const hide = jest.fn();
  const remove = jest.fn();
  const validationErrors = jest.fn();
  let callbacks: any[] = [];

  beforeEach(() => {
    callbacks = [];

    (useSceneHierarchyData as unknown as jest.Mock).mockImplementation(() => {
      return {
        show,
        hide,
        remove,
        validationErrors,
      };
    });

    (useCallback as jest.Mock).mockImplementation((cb) => callbacks.push(cb));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it(`should render with no errors`, () => {
    const { container } = render(
      <SceneNodeLabel objectRef={'123'} labelText={'Text'} componentTypes={[KnownComponentType.ModelRef]} />,
    );
    expect(container).toMatchSnapshot();
  });

  it(`should allow deleting node if there's errors`, () => {
    const objectRef = 'Batman';

    (useSceneHierarchyData as unknown as jest.Mock).mockImplementation(() => {
      return {
        validationErrors: { [objectRef]: 'There is an error' },
      };
    });

    const { container } = render(
      <SceneNodeLabel objectRef={objectRef} labelText={'Text'} componentTypes={[KnownComponentType.ModelRef]} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should toggle visibility', () => {
    const objectRef = 'Batman';
    render(<SceneNodeLabel objectRef={objectRef} labelText={'Text'} componentTypes={[KnownComponentType.ModelRef]} />);

    const [toggleVisibility] = callbacks;

    toggleVisibility(true);

    expect(show).toBeCalledWith(objectRef);

    toggleVisibility(false);

    expect(hide).toBeCalledWith(objectRef);
  });

  it('should delete node when delete button is clicked', () => {
    const objectRef = 'Batman';

    (useSceneHierarchyData as unknown as jest.Mock).mockImplementation(() => {
      return {
        validationErrors: { [objectRef]: 'There is an error' },
        remove,
      };
    });

    render(<SceneNodeLabel objectRef={objectRef} labelText={'Text'} componentTypes={[]} />);

    const [, onDelete] = callbacks;

    onDelete();

    expect(remove).toBeCalledWith(objectRef);
  });
});
