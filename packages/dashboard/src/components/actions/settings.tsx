/* eslint-disable react-hooks/exhaustive-deps */
import { type Viewport } from '@iot-app-kit/core';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useEffect, useState } from 'react';
import { DefaultViewportField } from '~/components/default-viewport/default-viewport-field';
import { useDefaultViewport } from '~/components/default-viewport/use-default-viewport';
import { useGridSettings } from './useGridSettings';
import { DecimalPlacesField } from '~/features/widget-customization/common/decimal-places-field';
import { NumberField } from '~/features/widget-customization/atoms/number-input';

export interface DashboardSettingsProps {
  onClose: VoidFunction;
  isVisible: boolean;
}

export const DashboardSettings = ({
  onClose,
  isVisible,
}: DashboardSettingsProps) => {
  const { defaultViewport, onUpdateDefaultViewport } = useDefaultViewport();
  const {
    rows,
    columns,
    cellSize,
    significantDigits,
    onChangeCellSize,
    onChangeNumberOfColumns,
    onChangeNumberOfRows,
    onChangeSignificantDigits,
  } = useGridSettings();

  const [changedSignificantDigits, setSignificantDigits] = useState<
    number | undefined
  >(significantDigits);
  const [changedCellSize, setCellSize] = useState<number>(cellSize);
  const [changedNumberRows, setNumberRows] = useState<number>(rows);
  const [changedNumberColumns, setNumberColumns] = useState<number>(columns);
  const [changedViewport, setViewport] = useState<Viewport | undefined>(
    defaultViewport
  );

  useEffect(() => {
    setViewport(defaultViewport);
  }, [JSON.stringify(defaultViewport), setViewport]);

  const onApplyChanges = () => {
    changedSignificantDigits !== significantDigits &&
      onChangeSignificantDigits(changedSignificantDigits);
    changedCellSize !== cellSize && onChangeCellSize(changedCellSize);
    changedNumberRows !== rows && onChangeNumberOfRows(changedNumberRows);
    changedNumberColumns !== columns &&
      onChangeNumberOfColumns(changedNumberColumns);
    changedViewport !== defaultViewport &&
      onUpdateDefaultViewport(JSON.stringify(changedViewport));
    onClose();
  };

  return (
    <Modal
      onDismiss={onClose}
      visible={isVisible}
      closeAriaLabel='Close modal'
      header='Dashboard settings'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button onClick={onClose} variant='link'>
              Cancel
            </Button>
            <Button onClick={onApplyChanges} variant='primary'>
              Apply changes
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Box>
        <SpaceBetween direction='vertical' size='l'>
          <DefaultViewportField
            defaultViewport={changedViewport}
            onViewportChange={(viewport) => setViewport(viewport)}
          />
          <DecimalPlacesField
            decimalPlaces={changedSignificantDigits}
            setDecimalPlaces={setSignificantDigits}
          />
          <NumberField
            label='Cell size'
            settingValue={changedCellSize}
            setSettingValue={setCellSize}
          />
          <NumberField
            label='Number of rows'
            settingValue={changedNumberRows}
            setSettingValue={setNumberRows}
          />
          <NumberField
            label='Number of columns'
            settingValue={changedNumberColumns}
            setSettingValue={setNumberColumns}
          />
        </SpaceBetween>
      </Box>
    </Modal>
  );
};
