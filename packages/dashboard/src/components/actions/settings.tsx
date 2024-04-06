import React from 'react';

import { Box, Modal, SpaceBetween } from '@cloudscape-design/components';

import LabeledInput from '../util/labeledInput';
import { useGridSettings } from './useGridSettings';
import { numberFromDetail } from '~/util/inputEvent';
import DecimalPlaces from './decimalPlaces';

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

  return (
    <Modal
      onDismiss={onClose}
      visible={isVisible}
      closeAriaLabel='Close modal'
      header='Dashboard Settings'
    >
      <Box>
        <SpaceBetween direction='vertical' size='l'>
          <DecimalPlaces
            onChangeSignificantDigits={onChangeSignificantDigits}
            significantDigits={significantDigits}
            isVisible={isVisible}
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
