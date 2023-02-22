import React, { ReactElement } from 'react';

import { Component } from '../../../models/SceneModels';
import { ReactMarkdownWrapper } from '../../wrappers/ReactMarkdownWrapper';
import './styles.scss';

export interface DataOverlayDataRowProps {
  rowData: Component.DataOverlayRow;
  overlayType: Component.DataOverlaySubType;
}

export const DataOverlayDataRow = ({ rowData, overlayType }: DataOverlayDataRowProps): ReactElement => {
  switch (rowData.rowType) {
    case Component.DataOverlayRowType.Markdown: {
      const row = rowData as Component.DataOverlayMarkdownRow;
      return (
        <ReactMarkdownWrapper
          className={overlayType === Component.DataOverlaySubType.TextAnnotation ? 'annotation-row' : 'panel-row'}
          content={row.content}
        />
      );
    }
    default:
      return <></>;
  }
};
