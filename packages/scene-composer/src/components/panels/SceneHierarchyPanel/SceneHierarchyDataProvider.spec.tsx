import React from 'react';
import { render } from '@testing-library/react';

import { useStore } from '../../../store';

import SceneHierarchyDataProvider, { Context } from './SceneHierarchyDataProvider';

describe('SceneHierarchyDataProvider', () => {
  const getSceneNodeByRef = jest.fn();
  const baseState: any = {
    getSceneNodeByRef: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`should return correct path from selected node to root`, () => {
    useStore('default').setState(baseState);
    baseState.getSceneNodeByRef.mockReturnValueOnce({ ref: 'node-1' });
    baseState.getSceneNodeByRef.mockReturnValueOnce({ ref: 'sub-parent-1' });
    baseState.getSceneNodeByRef.mockReturnValueOnce({ ref: 'parent-1' });

    const expectedResult = ['sub-parent-1', 'parent-1'];

    const { getByText } = render(
      <SceneHierarchyDataProvider selectionMode='single'>
        <Context.Consumer>
          {(value) => <span>Path to root: {value.pathFromSelectedToRoot?.toString()}</span>}
        </Context.Consumer>
      </SceneHierarchyDataProvider>,
    );

    expect(baseState.getSceneNodeByRef).toBeCalledTimes(4);
    expect(getByText('Path to root: ' + expectedResult.toString())).toBeTruthy();
  });
});
