import React from 'react';

import { Box, Checkbox, Modal, NonCancelableCustomEvent, SpaceBetween } from '@cloudscape-design/components';
import { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';

import LabeledInput from '../util/labeledInput';
import { useGridSettings } from './useGridSettings';

// Should never return NaN
const numberFromDetail = (event: NonCancelableCustomEvent<BaseChangeDetail>) => parseInt(event.detail.value) || 0;

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
    onChangeCellSize,
    onChangeNumberOfColumns,
    onChangeNumberOfRows,
    onToggleStretchToFit,
  } = useGridSettings();

  return (
    <Modal onDismiss={onClose} visible={isVisible} closeAriaLabel='Close modal' header='Dashboard Settings'>
      <Box>
        <SpaceBetween direction='vertical' size='l'>
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
