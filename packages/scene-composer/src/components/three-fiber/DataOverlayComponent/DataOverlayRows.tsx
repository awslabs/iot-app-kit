import { type ReactElement } from 'react';

import { Component } from '../../../models/SceneModels';
import { type IDataOverlayComponentInternal } from '../../../store/internalInterfaces';

import { DataOverlayDataRow } from './DataOverlayDataRow';
import { tmPanelRows } from './styles';

export interface DataOverlayRowsProps {
  component: IDataOverlayComponentInternal;
}

export const DataOverlayRows = ({ component }: DataOverlayRowsProps): ReactElement => {
  const isAnnotation = component.subType === Component.DataOverlaySubType.TextAnnotation;

  return (
    <div style={!isAnnotation ? tmPanelRows : undefined}>
      {component.dataRows.map((row, index) => {
        return (
          <DataOverlayDataRow
            rowData={row}
            overlayType={component.subType}
            key={index}
            valueDataBindings={component.valueDataBindings}
          />
        );
      })}
    </div>
  );
};
