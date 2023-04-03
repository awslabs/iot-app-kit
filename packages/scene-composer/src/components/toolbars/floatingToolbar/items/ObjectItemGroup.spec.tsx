import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { useStore } from '../../../../store';

import { ObjectItemGroup } from '.';

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
    });
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
    });
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
});
