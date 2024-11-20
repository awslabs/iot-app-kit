import { act, fireEvent, render, waitFor } from '@/tests/testing-library';

import { mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';
import { KnownComponentType } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';
import { type IDataOverlayComponentInternal, type ISceneNodeInternal, accessStore } from '../../../store';

import { DataOverlayComponentEditor } from './DataOverlayComponentEditor';

vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

vi.mock('./common/DataBindingMapEditor', async () => {
  const originalModule = await vi.importActual('./common/DataBindingMapEditor');
  return {
    ...originalModule,
    DataBindingMapEditor: (...props: unknown[]) => {
      return <div data-testid='DataBindingMapEditor'>{JSON.stringify(props)}</div>;
    },
  };
});

describe('DataOverlayComponentEditor', () => {
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
    valueDataBindings: [],
  };
  const node = {
    ref: 'node-ref',
    properties: {},
  } as ISceneNodeInternal;
  const updateComponentInternalMock = vi.fn();

  const baseState = {
    document: {},
    updateComponentInternal: updateComponentInternalMock,
    getEditorConfig: vi.fn().mockReturnValue({ valueDataBindingProvider: mockProvider }),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add new binding by clicking add button', async () => {
    accessStore('default').setState(baseState);

    const { getByDisplayValue } = render(<DataOverlayComponentEditor node={node} component={component} />);

    const textarea = getByDisplayValue(component.dataRows[0].content);
    expect(textarea).not.toBeNull();

    const newContent = 'new content';
    act(() => {
      fireEvent.change(textarea, { target: { value: newContent } });
    });

    waitFor(() => expect(updateComponentInternalMock).toBeCalledTimes(1));
    waitFor(() =>
      expect(updateComponentInternalMock).toBeCalledWith(
        node.ref,
        { ref: component.ref, dataRows: [{ ...component.dataRows[0], content: newContent }] },
        undefined,
      ),
    );
  });
});
