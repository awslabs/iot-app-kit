import React, { ReactElement } from 'react';

import { Component } from '../../../models/SceneModels';
import './styles.scss';

export interface DataOverlayDataRowProps {
  rowData: Component.DataOverlayRow;
  overlayType: Component.DataOverlaySubType;
}

export const DataOverlayDataRow = ({ rowData, overlayType }: DataOverlayDataRowProps): ReactElement => {
  switch (rowData.rowType) {
    case Component.DataOverlayRowType.Markdown: {
      const row = rowData as Component.DataOverlayMarkdownRow;
      // TODO: use markdown processor in next change
      return (
        <p
          className={`markdown-row ${
            overlayType === Component.DataOverlaySubType.TextAnnotation ? 'annotation-row' : 'panel-row'
          }`}
        >
          {row.content}
        </p>
      );
    }
    default:
      return <></>;
  }
};
