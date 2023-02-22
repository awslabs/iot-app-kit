import React from 'react';
import { render } from '@testing-library/react';

import { DataOverlayComponent } from '../DataOverlayComponent';
import { Component } from '../../../../models/SceneModels';
import { KnownComponentType } from '../../../../interfaces';
import { IDataOverlayComponentInternal } from '../../../../store';

jest.mock('../DataOverlayContainer', () => ({
  DataOverlayContainer: (...props: any[]) => <div data-testid='container'>{JSON.stringify(props)}</div>,
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
    valueDataBindings: {
      bindingA: {
        valueDataBinding: { dataBindingContext: 'dataBindingContext' },
      },
    },
  };
  const mockNode: any = { ref: 'node-ref', transform: { position: [1, 2, 3] }, components: [mockComponent] };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render the component correctly', async () => {
    const { container } = render(<DataOverlayComponent node={mockNode} component={mockComponent} />);
    expect(container).toMatchSnapshot();
  });
});
