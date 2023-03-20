import React from 'react';
import { render } from '@testing-library/react';

import { Component } from '../../../../models/SceneModels';
import { DataOverlayDataRow } from '../DataOverlayDataRow';
import { useStore } from '../../../../store';
import { IDataInput } from '../../../../interfaces';

jest.mock('../../../wrappers/ReactMarkdownWrapper', () => ({
  ReactMarkdownWrapper: (...props: unknown[]) => <div data-testid='ReactMarkdownWrapper'>{JSON.stringify(props)}</div>,
}));

describe('DataOverlayDataRow', () => {
  const valueDataBindings: Component.ValueDataBindingNamedMap[] = [
    {
      bindingName: 'binding-a',
      valueDataBinding: {
        dataBindingContext: {
          entityId: 'entity-1',
          componentName: 'comp-1',
          propertyName: 'prop-1',
        },
      },
    },
  ];
  const mockDataInput: IDataInput = {
    dataFrames: [
      {
        dataFrameId: 'A',
        fields: [
          {
            name: 'time',
            valueType: 'time',
            values: [111, 222],
          },
          {
            name: 'prop-1',
            valueType: 'number',
            labels: {
              ...(valueDataBindings[0].valueDataBinding?.dataBindingContext || {}),
            },
            values: [11, 22],
          },
        ],
      },
    ],
    timeRange: { from: 111, to: 222 },
  };
  const isEditingMock = jest.fn();
  const baseState = {
    dataInput: mockDataInput,
    dataBindingTemplate: undefined,
    isEditing: isEditingMock,
  };

  describe('Markdown', () => {
    const mockMarkdownRow: Component.DataOverlayMarkdownRow = {
      rowType: Component.DataOverlayRowType.Markdown,
      content: '# content',
    };

    beforeEach(() => {
      useStore('default').setState(baseState);
    });

    it('should render markdown row for overlay panel correctly', () => {
      const { container } = render(
        <DataOverlayDataRow
          rowData={mockMarkdownRow}
          overlayType={Component.DataOverlaySubType.OverlayPanel}
          valueDataBindings={[]}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render markdown row for text annotation correctly', () => {
      const { container } = render(
        <DataOverlayDataRow
          rowData={mockMarkdownRow}
          overlayType={Component.DataOverlaySubType.TextAnnotation}
          valueDataBindings={[]}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render markdown row with data binding variable correctly in editing mode', () => {
      const row: Component.DataOverlayMarkdownRow = {
        rowType: Component.DataOverlayRowType.Markdown,
        content: '# content ${binding-a}',
      };
      isEditingMock.mockReturnValue(true);

      const { container } = render(
        <DataOverlayDataRow
          rowData={row}
          overlayType={Component.DataOverlaySubType.TextAnnotation}
          valueDataBindings={valueDataBindings}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render markdown row with data binding variable correctly in viewing mode', () => {
      const row: Component.DataOverlayMarkdownRow = {
        rowType: Component.DataOverlayRowType.Markdown,
        content: '# content ${binding-a}',
      };
      isEditingMock.mockReturnValue(false);

      const { container } = render(
        <DataOverlayDataRow
          rowData={row}
          overlayType={Component.DataOverlaySubType.TextAnnotation}
          valueDataBindings={valueDataBindings}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
