import React, { ReactElement } from 'react';

import { Component } from '../../../models/SceneModels';
import { IDataOverlayComponentInternal } from '../../../store/internalInterfaces';

import { DataOverlayDataRow } from './DataOverlayDataRow';
import './styles.scss';

export interface DataOverlayRowsProps {
  component: IDataOverlayComponentInternal;
}

export const DataOverlayRows = ({ component }: DataOverlayRowsProps): ReactElement => {
  return (
    <div
      className={`${
        component.subType === Component.DataOverlaySubType.TextAnnotation ? 'annotation-rows' : 'panel-rows'
      }`}
    >
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
