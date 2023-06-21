import React from 'react';

import { Box, Checkbox, Modal, SpaceBetween } from '@cloudscape-design/components';

import LabeledInput from '../util/labeledInput';
import { useGridSettings } from './useGridSettings';
import { numberFromDetail } from '~/util/inputEvent';

export type DashboardSettingsProps = {
  onClose: () => void;
  isVisible: boolean;
};

const DashboardSettings: React.FC<DashboardSettingsProps> = ({ onClose, isVisible }) => {
  const {
    rows,
    columns,
    cellSize,
    stretchToFit,
    significantDigits,
    onChangeCellSize,
    onChangeNumberOfColumns,
    onChangeNumberOfRows,
    onToggleStretchToFit,
    onChangeSignificantDigits,
  } = useGridSettings();

  return (
    <Modal onDismiss={onClose} visible={isVisible} closeAriaLabel='Close modal' header='Dashboard Settings'>
      <Box>
        <SpaceBetween direction='vertical' size='l'>
          <LabeledInput
            label='Decimal Places'
            type='number'
            value={significantDigits.toFixed()}
            onChange={(event) => onChangeSignificantDigits(numberFromDetail(event))}
          />
          <Checkbox onChange={({ detail }) => onToggleStretchToFit(detail.checked)} checked={stretchToFit}>
            Stretch grid to fit screen size.
          </Checkbox>
          <LabeledInput
            label='Cell Size'
            disabled={stretchToFit}
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
            onChange={(event) => onChangeNumberOfColumns(numberFromDetail(event))}
          />
        </SpaceBetween>
      </Box>
    </Modal>
  );
};

export default DashboardSettings;
