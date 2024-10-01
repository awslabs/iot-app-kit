import React from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Checkbox from '@cloudscape-design/components/checkbox';
import Modal from '@cloudscape-design/components/modal';
import { Box } from '@cloudscape-design/components';

type ChartPreferencesModalOptions = {
  onHide: () => void;
  visible: boolean;
  onChangeShowBadDataIcons: (showBadDataIcons: boolean) => void;
  showBadDataIcons?: boolean;
  onChangeShowUncertainDataIcons: (showUncertainDataIcons: boolean) => void;
  showUncertainDataIcons?: boolean;
  showAlarmIcons?: boolean;
  onChangeShowAlarmIcons: (showAlarmIcons: boolean) => void;
};
export const ChartPreferencesModal = ({
  visible,
  onHide,
  showBadDataIcons,
  showUncertainDataIcons,
  showAlarmIcons,
  onChangeShowBadDataIcons,
  onChangeShowUncertainDataIcons,
  onChangeShowAlarmIcons,
}: ChartPreferencesModalOptions) => {
  return (
    <Modal onDismiss={onHide} visible={visible} header='Chart Settings'>
      <SpaceBetween direction='vertical' size='s'>
        <SpaceBetween direction='vertical' size='xs'>
          <Box variant='h4'>Data Quality</Box>
          <Checkbox
            onChange={({ detail }) => onChangeShowBadDataIcons(detail.checked)}
            checked={!!showBadDataIcons}
          >
            Show bad data quality icons
          </Checkbox>

          <Checkbox
            onChange={({ detail }) =>
              onChangeShowUncertainDataIcons(detail.checked)
            }
            checked={!!showUncertainDataIcons}
          >
            Show uncertain data quality icons
          </Checkbox>
        </SpaceBetween>

        <SpaceBetween direction='vertical' size='xs'>
          <Box variant='h4'>Alarms</Box>
          <Checkbox
            onChange={({ detail }) => onChangeShowAlarmIcons(detail.checked)}
            checked={!!showAlarmIcons}
          >
            Show alarm icons
          </Checkbox>
        </SpaceBetween>
      </SpaceBetween>
    </Modal>
  );
};
