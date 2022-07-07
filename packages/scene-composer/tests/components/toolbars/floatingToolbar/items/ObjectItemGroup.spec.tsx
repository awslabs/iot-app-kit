/* eslint-disable import/first */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { mockReactIntl } from '../../../../__mocks__/MockReactIntl';
// eslint-disable-next-line import/order
import { mockPolaris } from '../../../../__mocks__/MockPolaris';

mockPolaris();
mockReactIntl();

import { ObjectItemGroup } from '../../../../../src/components/toolbars/floatingToolbar/items';
import { useStore } from '../../../../../src/store';
import { KnownComponentType } from '../../../../../src';

describe('ObjectItemGroup', () => {
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
    } as any);
    jest.clearAllMocks();
  });

  it('should call removeSceneNode when clicking delete with a selected node', () => {
    render(<ObjectItemGroup />);
    const sut = screen.getByTestId('delete');
    fireEvent.pointerUp(sut);
    expect(removeSceneNode).toBeCalledWith(selectedSceneNodeRef);
  });

  it('should not call removeSceneNode when clicking delete without a selected node', () => {
    useStore('default').setState({
      selectedSceneNodeRef: undefined,
    } as any);
    render(<ObjectItemGroup />);
    const sut = screen.getByTestId('delete');
    fireEvent.pointerUp(sut);
    expect(removeSceneNode).not.toBeCalled();
  });

  it('should call setTransformControlMode when clicking rotate', () => {
    render(<ObjectItemGroup />);
    const sut = screen.getByTestId('transform-rotate');
    fireEvent.pointerUp(sut);
    expect(setTransformControlMode).toBeCalledWith('rotate');
  });

  it('should call setTransformControlMode with translate if initially set to scale for Tag', () => {
    useStore('default').setState({
      transformControlMode: 'scale',
    } as any);
    getSceneNodeByRef.mockReturnValue({ components: [{ type: KnownComponentType.Tag }] });
    render(<ObjectItemGroup />);
    expect(setTransformControlMode).toBeCalledWith('translate');
  });
});
