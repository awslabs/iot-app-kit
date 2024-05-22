import React from 'react';

import { Box, Modal, SpaceBetween } from '@cloudscape-design/components';

import LabeledInput from '../util/labeledInput';
import { useGridSettings } from './useGridSettings';
import { numberFromDetail } from '~/util/inputEvent';
import DecimalPlaces from '../decimalPlaces';
import { isNumeric } from '@iot-app-kit/core-util';
import { DefaultViewport } from '../defaultViewport';

export type DashboardSettingsProps = {
  onClose: () => void;
  isVisible: boolean;
};

const DashboardSettings: React.FC<DashboardSettingsProps> = ({
  onClose,
  isVisible,
}) => {
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

  const onSignificantDigitsChange = (value: string) => {
    const newValue = (isNumeric(value) && parseInt(value)) || 0;
    if (newValue >= 0 && newValue <= 100) {
      onChangeSignificantDigits(newValue);
    }
  };

  return (
    <Modal
      onDismiss={onClose}
      visible={isVisible}
      closeAriaLabel='Close modal'
      header='Dashboard Settings'
    >
      <Box>
        <SpaceBetween direction='vertical' size='l'>
          <DefaultViewport />
          <DecimalPlaces
            showFormFieldLabel={true}
            onSignificantDigitsChange={onSignificantDigitsChange}
            significantDigits={significantDigits}
            shouldClearErrors={isVisible}
          />
          <LabeledInput
            label='Cell Size'
            type='number'
            value={cellSize.toFixed()}
            onChange={(event) => onChangeCellSize(numberFromDetail(event))}
          />
          <LabeledInput
            label='Number of Rows'
            type='number'
            value={rows.toFixed()}
            onChange={(event) => onChangeNumberOfRows(numberFromDetail(event))}
          />
          <LabeledInput
            label='Number of Columns'
            type='number'
            value={columns.toFixed()}
            onChange={(event) =>
              onChangeNumberOfColumns(numberFromDetail(event))
            }
          />
        </SpaceBetween>
      </Box>
    </Modal>
  );
};

export default DashboardSettings;
