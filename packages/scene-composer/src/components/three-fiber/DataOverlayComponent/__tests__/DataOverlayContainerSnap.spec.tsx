import { render } from '@testing-library/react';

import { KnownComponentType } from '../../../../interfaces';
import { Component } from '../../../../models/SceneModels';
import { type IDataOverlayComponentInternal, type ISceneNodeInternal, accessStore } from '../../../../store';
import { DataOverlayContainer } from '../DataOverlayContainer';
import { type DataOverlayRowsProps } from '../DataOverlayRows';

vi.mock('../DataOverlayRows', () => ({
  DataOverlayRows: (...props: [DataOverlayRowsProps, object]) => <div data-testid='rows'>{JSON.stringify(props)}</div>,
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

  const mockSetSelectedSceneNodeRef = vi.fn();
  const baseState = {
    selectedSceneNodeRef: undefined,
    setSelectedSceneNodeRef: mockSetSelectedSceneNodeRef,
    dataInput: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    accessStore('default').setState(baseState);
  });

  it('should render with panel visible correctly when the overlay node is selected', () => {
    accessStore('default').setState({ ...baseState, selectedSceneNodeRef: mockNode.ref });

    const { container } = render(
      <DataOverlayContainer node={mockNode as ISceneNodeInternal} component={mockComponent} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with annotation visible correctly', () => {
    accessStore('default').setState({
      noHistoryStates: {
        ...accessStore('default').getState().noHistoryStates,
        componentVisibilities: { [Component.DataOverlaySubType.TextAnnotation]: true },
      },
    });

    const { container } = render(
      <DataOverlayContainer
        node={mockNode as ISceneNodeInternal}
        component={{ ...mockComponent, subType: Component.DataOverlaySubType.TextAnnotation }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with annotation invisible correctly', () => {
    accessStore('default').setState({
      noHistoryStates: {
        ...accessStore('default').getState().noHistoryStates,
        componentVisibilities: { [Component.DataOverlaySubType.TextAnnotation]: false },
      },
    });

    const { container } = render(
      <DataOverlayContainer
        node={mockNode as ISceneNodeInternal}
        component={{ ...mockComponent, subType: Component.DataOverlaySubType.TextAnnotation }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with panel invisible correctly', () => {
    accessStore('default').setState({
      noHistoryStates: {
        ...accessStore('default').getState().noHistoryStates,
        componentVisibilities: { [Component.DataOverlaySubType.OverlayPanel]: false },
      },
    });

    const { container } = render(
      <DataOverlayContainer node={mockNode as ISceneNodeInternal} component={mockComponent} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with panel visible correctly', () => {
    accessStore('default').setState({
      noHistoryStates: {
        ...accessStore('default').getState().noHistoryStates,
        componentVisibilities: { [Component.DataOverlaySubType.OverlayPanel]: true },
      },
    });

    const { container } = render(
      <DataOverlayContainer node={mockNode as ISceneNodeInternal} component={mockComponent} />,
    );
    expect(container).toMatchSnapshot();
  });
});
