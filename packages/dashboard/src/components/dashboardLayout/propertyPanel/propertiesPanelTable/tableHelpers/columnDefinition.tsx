import {
  spaceScaledL,
  spaceScaledXl,
  spaceScaledXs,
} from '@cloudscape-design/design-tokens';
import { isNumeric, round } from '@iot-app-kit/core-util';
import React from 'react';

export const getColumnDefinition = (significantDigits: number) => {
  return [
    {
      id: 'name',
      header: 'Name',
      cell: (item: { name: string; color: string }) => (
        <div className='properties-table-property-td-container'>
          {item.color && (
            <span
              style={{
                backgroundColor: item.color,
                minWidth: spaceScaledXl,
                height: spaceScaledL,
                borderRadius: spaceScaledXs,
                marginRight: spaceScaledXs,
              }}
            ></span>
          )}
          <span>{item.name}</span>
        </div>
      ),
      sortingField: 'name',
      isRowHeader: true,
    },
    {
      id: 'latestValue',
      header: 'Latest Value',
      cell: ({ latestValue }: { latestValue: string }) => {
        if (latestValue && isNumeric(latestValue)) {
          return round(latestValue, significantDigits);
        }
        return latestValue;
      },
      sortingField: 'latestValue',
    },
    {
      id: 'assetName',
      header: 'Asset Name',
      cell: (item: { assetName: string }) => item.assetName,
      sortingField: 'assetName',
    },
    {
      id: 'showYAxis',
      header: 'Show Y Axis',
      cell: (item: { yAxis: { visible: string } }) => item.yAxis.visible,
      sortingField: 'showYAxis',
    },
    {
      id: 'yMin',
      header: 'Y min',
      cell: (item: { yAxis: { yMin: string } }) => item.yAxis.yMin,
      sortingField: 'yMin',
    },
    {
      id: 'yMax',
      header: 'Y Max',
      cell: (item: { yAxis: { yMax: string } }) => item.yAxis.yMax,
      sortingField: 'yMax',
    },
    {
      id: 'lineType',
      header: 'Line Type',
      cell: (item: { line: { connectionStyle: string } }) =>
        item.line.connectionStyle,
      sortingField: 'lineConnectionStyle',
    },
    {
      id: 'lineStyle',
      header: 'Line Style',
      cell: (item: { line: { style: string } }) => item.line.style,
      sortingField: 'lineStyle',
    },
    {
      id: 'lineThickness',
      header: 'Line Thickness',
      cell: (item: { line: { thickness: string } }) => item.line.thickness,
      sortingField: 'lineThickness',
    },
  ];
};
