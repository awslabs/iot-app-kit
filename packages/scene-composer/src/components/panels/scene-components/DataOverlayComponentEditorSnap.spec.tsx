import { render } from '@/tests/testing-library';
import { mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';
import { KnownComponentType } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';
import { type IDataOverlayComponentInternal, type ISceneNodeInternal, accessStore } from '../../../store';
import { DataOverlayComponentEditor } from './DataOverlayComponentEditor';

vi.mock('./common/DataBindingMapEditor', async () => {
  const originalModule = await vi.importActual('./common/DataBindingMapEditor');
  return {
    ...originalModule,
    DataBindingMapEditor: (...props: unknown[]) => {
      return <div data-testid='DataBindingMapEditor'>{JSON.stringify(props)}</div>;
    },
  };
});
vi.mock('./data-overlay/DataOverlayPanelConfigEditor', async () => {
  const originalModule = await vi.importActual('./data-overlay/DataOverlayPanelConfigEditor');
  return {
    ...originalModule,
    DataOverlayPanelConfigEditor: (...props: unknown[]) => {
      return <div data-testid='DataOverlayPanelConfigEditor'>{JSON.stringify(props)}</div>;
    },
  };
});

describe('DataOverlayComponentEditorSnap', () => {
  const component: IDataOverlayComponentInternal = {
    ref: 'comp-ref',
    type: KnownComponentType.DataOverlay,
    subType: Component.DataOverlaySubType.TextAnnotation,
    dataRows: [
      {
        rowType: Component.DataOverlayRowType.Markdown,
        content: 'markdown-content',
      },
    ],
    valueDataBindings: [
      {
        bindingName: 'binding-1',
        valueDataBinding: {
          dataBindingContext: { entityId: 'random-1' },
        },
      },
    ],
  };
  const node = {
    ref: 'node-ref',
    properties: {},
  } as ISceneNodeInternal;

  const baseState = {
    updateComponentInternal: vi.fn(),
    getEditorConfig: vi.fn().mockReturnValue({ valueDataBindingProvider: mockProvider }),
  };

  it('should render data rows for text annotation', async () => {
    accessStore('default').setState(baseState);

    const { container } = render(<DataOverlayComponentEditor node={node} component={component} />);

    expect(container).toMatchSnapshot();
  });

  it('should render editor for overlay panel', async () => {
    accessStore('default').setState(baseState);

    const { container } = render(
      <DataOverlayComponentEditor
        node={node}
        component={{ ...component, subType: Component.DataOverlaySubType.OverlayPanel }}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
