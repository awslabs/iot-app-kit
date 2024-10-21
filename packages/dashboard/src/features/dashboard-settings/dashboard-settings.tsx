import { FormField, Input, InputProps } from '@cloudscape-design/components';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDashboardCellSize } from '~/store/dashboard/use-dashboard-cell-size';
import { useDashboardHeight } from '~/store/dashboard/use-dashboard-height';
import { useDashboardWidth } from '~/store/dashboard/use-dashboard-width';
import { DashboardDecimalPlacesSelect } from './dashboard-decimal-places-select';
import { DefaultViewportDatePicker } from './default-viewport-date-picker';

export function SettingsPanel() {
  const [cellSize, setCellSize] = useDashboardCellSize();
  const [height, setHeight] = useDashboardHeight();
  const [width, setWidth] = useDashboardWidth();

  const handleChangeCellSize = useCallback(
    (event: Parameters<NonNullable<InputProps['onChange']>>[0]) => {
      const updatedCellSize = parseInt(event.detail.value, 10);
      setCellSize(updatedCellSize);
    },
    [setCellSize]
  );

  const handleChangeHeight = useCallback(
    (event: Parameters<NonNullable<InputProps['onChange']>>[0]) => {
      const updatedHeight = parseInt(event.detail.value, 10);
      setHeight(updatedHeight);
    },
    [setHeight]
  );

  const handleChangeWidth = useCallback(
    (event: Parameters<NonNullable<InputProps['onChange']>>[0]) => {
      const updatedWidth = parseInt(event.detail.value, 10);
      setWidth(updatedWidth);
    },
    [setWidth]
  );

  return (
    <SettingsFields>
      <DefaultViewportDatePicker />
      <DashboardDecimalPlacesSelect />

      <FormField
        label='Dashboard cell size'
        constraintText='Must be a positive number.'
      >
        <Input
          type='number'
          value={cellSize.toFixed()}
          onChange={handleChangeCellSize}
        />
      </FormField>

      <FormField
        label='Dashboard height (cells)'
        constraintText='Must be a positive number.'
      >
        <Input
          type='number'
          value={height.toFixed()}
          onChange={handleChangeHeight}
        />
      </FormField>

      <FormField
        label='Dashboard width (cells)'
        constraintText='Must be a positive number.'
      >
        <Input
          type='number'
          value={width.toFixed()}
          onChange={handleChangeWidth}
        />
      </FormField>
    </SettingsFields>
  );
}

const SettingsFields = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;

  & > * + * {
    margin-top: 12px;
  }
`;
