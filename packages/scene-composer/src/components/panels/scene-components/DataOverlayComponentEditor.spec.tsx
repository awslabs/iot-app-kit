import React from 'react';
import { act, render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { KnownComponentType } from '../../../interfaces';
import { IDataOverlayComponentInternal, ISceneNodeInternal, useStore } from '../../../store';
import { Component } from '../../../models/SceneModels';
import { mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';

import { DataOverlayComponentEditor } from './DataOverlayComponentEditor';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

jest.mock('./data-overlay/DataBindingMapEditor', () => {
  const originalModule = jest.requireActual('./data-overlay/DataBindingMapEditor');
  return {
    ...originalModule,
    DataBindingMapEditor: (...props: unknown[]) => {
      return <div data-testid='DataBindingMapEditor'>{JSON.stringify(props)}</div>;
    },
  };
});

describe('DataBindingMapEditor', () => {
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
  } as ISceneNodeInternal;
  const updateComponentInternalMock = jest.fn();

  const baseState = {
    updateComponentInternal: updateComponentInternalMock,
    getEditorConfig: jest.fn().mockReturnValue({ valueDataBindingProvider: mockProvider }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add new binding by clicking add button', async () => {
    useStore('default').setState(baseState);

    const { container } = render(<DataOverlayComponentEditor node={node} component={component} />);
    const polarisWrapper = wrapper(container);

    const textarea = polarisWrapper.findTextarea();
    expect(textarea).not.toBeNull();

    const newContent = 'new content';
    act(() => {
      textarea!.setTextareaValue(newContent);
    });

    expect(updateComponentInternalMock).toBeCalledTimes(1);
    expect(updateComponentInternalMock).toBeCalledWith(
      node.ref,
      { ref: component.ref, dataRows: [{ ...component.dataRows[0], content: newContent }] },
      undefined,
    );
  });
});
