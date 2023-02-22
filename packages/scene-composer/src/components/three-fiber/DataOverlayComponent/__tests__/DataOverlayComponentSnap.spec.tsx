import React from 'react';
import { render } from '@testing-library/react';

import { DataOverlayComponent } from '../DataOverlayComponent';
import { Component } from '../../../../models/SceneModels';
import { KnownComponentType } from '../../../../interfaces';
import { IDataOverlayComponentInternal, ISceneNodeInternal } from '../../../../store';

jest.mock('../DataOverlayContainer', () => ({
  DataOverlayContainer: (...props: unknown[]) => <div data-testid='container'>{JSON.stringify(props)}</div>,
}));

describe('DataOverlayComponent', () => {
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
    valueDataBindings: [
      {
        bindingName: 'bindingA',
        valueDataBinding: { dataBindingContext: 'dataBindingContext' },
      },
    ],
  };
  const mockNode: Partial<ISceneNodeInternal> = {
    ref: 'node-ref',
    transform: { position: [1, 2, 3], rotation: [0, 0, 0], scale: [0, 0, 0] },
    components: [mockComponent],
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render the component correctly', async () => {
    const { container } = render(
      <DataOverlayComponent node={mockNode as ISceneNodeInternal} component={mockComponent} />,
    );
    expect(container).toMatchSnapshot();
  });
});
