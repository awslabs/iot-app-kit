import { act, fireEvent, render, waitFor } from '@testing-library/react';

import { KnownComponentType } from '../../../interfaces';
import { type IDataOverlayComponentInternal, type ISceneNodeInternal, accessStore } from '../../../store';
import { Component } from '../../../models/SceneModels';
import { mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';

import { DataOverlayComponentEditor } from './DataOverlayComponentEditor';

jest.mock('@cloudscape-design/components', () => ({
  ...jest.requireActual('@cloudscape-design/components'),
}));

jest.mock('./common/DataBindingMapEditor', () => {
  const originalModule = jest.requireActual('./common/DataBindingMapEditor');
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
  const updateComponentInternalMock = jest.fn();

  const baseState = {
    document: {},
    updateComponentInternal: updateComponentInternalMock,
    getEditorConfig: jest.fn().mockReturnValue({ valueDataBindingProvider: mockProvider }),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
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
