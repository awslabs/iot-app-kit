import React from 'react';
import { render } from '@testing-library/react';

import { Component } from '../../../../models/SceneModels';
import { DataOverlayDataRow } from '../DataOverlayDataRow';

jest.mock('../../../wrappers/ReactMarkdownWrapper', () => ({
  ReactMarkdownWrapper: (...props: unknown[]) => <div data-testid='ReactMarkdownWrapper'>{JSON.stringify(props)}</div>,
}));

describe('DataOverlayDataRow', () => {
  describe('Markdown', () => {
    const mockMarkdownRow: Component.DataOverlayMarkdownRow = {
      rowType: Component.DataOverlayRowType.Markdown,
      content: '# content',
    };

    it('should render markdown row for overlay panel correctly', () => {
      const { container } = render(
        <DataOverlayDataRow rowData={mockMarkdownRow} overlayType={Component.DataOverlaySubType.OverlayPanel} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render markdown row for text annotation correctly', () => {
      const { container } = render(
        <DataOverlayDataRow rowData={mockMarkdownRow} overlayType={Component.DataOverlaySubType.TextAnnotation} />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
