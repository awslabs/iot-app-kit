import { render } from '@/tests/testing-library';
import { KnownComponentType } from '../../../../interfaces';
import { Component } from '../../../../models/SceneModels';
import { type IDataOverlayComponentInternal } from '../../../../store';
import { type DataOverlayDataRowProps } from '../DataOverlayDataRow';
import { DataOverlayRows } from '../DataOverlayRows';

vi.mock('../DataOverlayDataRow', () => ({
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
