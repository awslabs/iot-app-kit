import React from 'react';
import { render } from '@testing-library/react';

import { mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';
import { IDataOverlayComponentInternal, ISceneNodeInternal, useStore } from '../../../store';
import { Component } from '../../../models/SceneModels';
import { KnownComponentType } from '../../../interfaces';

import { DataOverlayComponentEditor } from './DataOverlayComponentEditor';

jest.mock('./data-overlay/DataBindingMapEditor', () => {
  const originalModule = jest.requireActual('./data-overlay/DataBindingMapEditor');
  return {
    ...originalModule,
    DataBindingMapEditor: (...props: unknown[]) => {
      return <div data-testid='DataBindingMapEditor'>{JSON.stringify(props)}</div>;
    },
  };
});
jest.mock('./data-overlay/DataOverlayPanelConfigEditor', () => {
  const originalModule = jest.requireActual('./data-overlay/DataOverlayPanelConfigEditor');
  return {
    ...originalModule,
    DataOverlayPanelConfigEditor: (...props: unknown[]) => {
      return <div data-testid='DataOverlayPanelConfigEditor'>{JSON.stringify(props)}</div>;
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
    valueDataBindings: [
      {
        bindingName: 'binding-1',
        valueDataBinding: {
          dataBindingContext: 'random-1',
        },
      },
    ],
  };
  const node = {
    ref: 'node-ref',
  } as ISceneNodeInternal;

  const baseState = {
    updateComponentInternal: jest.fn(),
    getEditorConfig: jest.fn().mockReturnValue({ valueDataBindingProvider: mockProvider }),
  };

  it('should render data rows for text annotation', async () => {
    useStore('default').setState(baseState);

    const { container } = render(<DataOverlayComponentEditor node={node} component={component} />);

    expect(container).toMatchSnapshot();
  });

  it('should render editor for overlay panel', async () => {
    useStore('default').setState(baseState);

    const { container } = render(
      <DataOverlayComponentEditor
        node={node}
        component={{ ...component, subType: Component.DataOverlaySubType.OverlayPanel }}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
