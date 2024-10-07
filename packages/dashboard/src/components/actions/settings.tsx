/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import {
  Button,
  Box,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components';

import LabeledInput from '../util/labeledInput';
import { useGridSettings } from './useGridSettings';
import { numberFromDetail } from '~/util/inputEvent';
import DecimalPlaces from '../decimalPlaces';
import { isNumeric } from '@iot-app-kit/core-util';
import { DefaultViewport } from '../defaultViewport';
import { Viewport } from '@iot-app-kit/core';
import { useDefaultViewport } from '../defaultViewport/useDefaultViewport';

export type DashboardSettingsProps = {
  onClose: () => void;
  isVisible: boolean;
};

const DashboardSettings: React.FC<DashboardSettingsProps> = ({
  onClose,
  isVisible,
}) => {
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

  const [changedSignificantDigits, setSignificantDigits] =
    useState<number>(significantDigits);
  const [changedCellSize, setCellSize] = useState<number>(cellSize);
  const [changedNumberRows, setNumberRows] = useState<number>(rows);
  const [changedNumberColumns, setNumberColumns] = useState<number>(columns);
  const [changedViewport, setViewport] = useState<Viewport | undefined>(
    defaultViewport
  );

  useEffect(() => {
    setViewport(defaultViewport);
  }, [JSON.stringify(defaultViewport), setViewport]);

  const onSignificantDigitsChange = (value: string) => {
    const newValue = (isNumeric(value) && parseInt(value)) || 0;
    if (newValue >= 0 && newValue <= 100) {
      setSignificantDigits(newValue);
    }
  };

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
      header='Dashboard Settings'
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
          <DefaultViewport
            defaultViewport={changedViewport}
            onViewportChange={(viewport) => setViewport(viewport)}
          />
          <DecimalPlaces
            showFormFieldLabel={true}
            onSignificantDigitsChange={onSignificantDigitsChange}
            significantDigits={changedSignificantDigits}
            shouldClearErrors={isVisible}
          />
          <LabeledInput
            label='Cell Size'
            type='number'
            value={changedCellSize.toFixed()}
            onChange={(event) => setCellSize(numberFromDetail(event))}
          />
          <LabeledInput
            label='Number of Rows'
            type='number'
            value={changedNumberRows.toFixed()}
            onChange={(event) => setNumberRows(numberFromDetail(event))}
          />
          <LabeledInput
            label='Number of Columns'
            type='number'
            value={changedNumberColumns.toFixed()}
            onChange={(event) => setNumberColumns(numberFromDetail(event))}
          />
        </SpaceBetween>
      </Box>
    </Modal>
  );
};

export default DashboardSettings;
