import React from 'react';
import { render } from '@testing-library/react';

import { IDataOverlayComponentInternal, ISceneNodeInternal, useStore } from '../../../../store';
import { KnownComponentType } from '../../../../interfaces';
import { Component } from '../../../../models/SceneModels';
import { DataOverlayContainer } from '../DataOverlayContainer';
import { DataOverlayRowsProps } from '../DataOverlayRows';

jest.mock('../../../../hooks/useCallbackWhenNotPanning', () => (cb) => [
  jest.fn(),
  function Hack(e) {
    cb(e);
  },
]);

jest.mock('../DataOverlayRows', () => ({
  DataOverlayRows: (...props: [DataOverlayRowsProps, {}]) => <div data-testid='rows'>{JSON.stringify(props)}</div>,
}));

describe('DataOverlayContainer', () => {
  const mockComponent: IDataOverlayComponentInternal = {
    ref: 'comp-ref',
    type: KnownComponentType.DataOverlay,
    subType: Component.DataOverlaySubType.OverlayPanel,
    dataRows: [
      {
        rowType: Component.DataOverlayRowType.Markdown,
        content: 'content',
      },
    ],
    valueDataBindings: [],
  };
  const mockNode: Partial<ISceneNodeInternal> = {
    ref: 'node-ref',
    transform: { position: [1, 2, 3], rotation: [0, 0, 0], scale: [0, 0, 0] },
    components: [mockComponent],
  };

  const mockSetSelectedSceneNodeRef = jest.fn();
  const baseState = {
    selectedSceneNodeRef: undefined,
    setSelectedSceneNodeRef: mockSetSelectedSceneNodeRef,
    dataInput: undefined,
  };

  it('should render with panel visible correctly when the overlay node is selected', () => {
    useStore('default').setState({ ...baseState, selectedSceneNodeRef: mockNode.ref });

    const { container } = render(
      <DataOverlayContainer node={mockNode as ISceneNodeInternal} component={mockComponent} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with panel visible correctly when the overlay node is pinned', () => {
    useStore('default').setState(baseState);

    const { container } = render(
      <DataOverlayContainer
        node={mockNode as ISceneNodeInternal}
        component={{ ...mockComponent, config: { isPinned: true } }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with annotation visible correctly', () => {
    useStore('default').setState(baseState);

    const { container } = render(
      <DataOverlayContainer
        node={mockNode as ISceneNodeInternal}
        component={{ ...mockComponent, subType: Component.DataOverlaySubType.TextAnnotation }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with panel invisible correctly', () => {
    useStore('default').setState(baseState);

    const { container } = render(
      <DataOverlayContainer node={mockNode as ISceneNodeInternal} component={mockComponent} />,
    );
    expect(container).toMatchSnapshot();
  });
});
