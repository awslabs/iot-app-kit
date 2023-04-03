import React from 'react';
import { render } from '@testing-library/react';

import { useStore } from '../../../../store';
import { KnownComponentType } from '../../../../interfaces';

import { ObjectItemGroup } from '.';

jest.mock('../../common/ToolbarItem', () => ({
  ToolbarItem: (...props: unknown[]) => <div data-testid='ToolbarItem'>{JSON.stringify(props)}</div>,
}));

jest.mock('../../../../assets/svgs', () => ({
  DeleteSvg: 'DeleteSvg',
  RotateIconSvg: 'RotateIconSvg',
  ScaleIconSvg: 'ScaleIconSvg',
  TranslateIconSvg: 'TranslateIconSvg',
}));

describe('ObjectItemGroupSnap', () => {
  const removeSceneNode = jest.fn();
  const selectedSceneNodeRef = 'test-ref';
  const setTransformControlMode = jest.fn();
  const getSceneNodeByRef = jest.fn();

  beforeEach(() => {
    useStore('default').setState({
      selectedSceneNodeRef,
      removeSceneNode,
      transformControlMode: 'translate',
      setTransformControlMode,
      getSceneNodeByRef,
    });
    jest.clearAllMocks();
  });

  it('should render with disabled rotate and scale when Tag is selected', () => {
    getSceneNodeByRef.mockReturnValue({ components: [{ type: KnownComponentType.Tag }] });
    const { container, queryAllByText } = render(<ObjectItemGroup />);

    expect(queryAllByText('"isDisabled":true', { exact: false }).length).toBe(1);
    expect(container).toMatchSnapshot();
  });

  it('should render with disabled rotate and scale when Overlay is selected', () => {
    getSceneNodeByRef.mockReturnValue({ components: [{ type: KnownComponentType.DataOverlay }] });
    const { container, queryAllByText } = render(<ObjectItemGroup />);

    expect(queryAllByText('"isDisabled":true', { exact: false }).length).toBe(1);
    expect(container).toMatchSnapshot();
  });
});
