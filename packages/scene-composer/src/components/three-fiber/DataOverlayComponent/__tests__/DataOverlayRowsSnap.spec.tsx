import React from 'react';
import { render } from '@testing-library/react';

import { IDataOverlayComponentInternal } from '../../../../store';
import { KnownComponentType } from '../../../../interfaces';
import { Component } from '../../../../models/SceneModels';
import { DataOverlayRows } from '../DataOverlayRows';
import { DataOverlayDataRowProps } from '../DataOverlayDataRow';

jest.mock('../DataOverlayDataRow', () => ({
  DataOverlayDataRow: (...props: [DataOverlayDataRowProps, object]) => (
    <div data-testid='data-row'>{JSON.stringify(props)}</div>
  ),
}));

describe('DataOverlayRows', () => {
  const mockComponent: IDataOverlayComponentInternal = {
    ref: 'comp-ref',
    type: KnownComponentType.DataOverlay,
    subType: Component.DataOverlaySubType.OverlayPanel,
    dataRows: [
      {
        rowType: Component.DataOverlayRowType.Markdown,
        content: 'content 1',
      },
      {
        rowType: Component.DataOverlayRowType.Markdown,
        content: 'content 2',
      },
    ],
    valueDataBindings: [],
  };

  it('should render overlay panel correctly', () => {
    const { container } = render(<DataOverlayRows component={mockComponent} />);
    expect(container).toMatchSnapshot();
  });

  it('should render text annotation correctly', () => {
    const { container } = render(
      <DataOverlayRows component={{ ...mockComponent, subType: Component.DataOverlaySubType.TextAnnotation }} />,
    );
    expect(container).toMatchSnapshot();
  });
});
