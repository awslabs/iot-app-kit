import React from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Checkbox from '@cloudscape-design/components/checkbox';
import Modal from '@cloudscape-design/components/modal';

type DataQualityPreferencesModalOptions = {
  onHide: () => void;
  visible: boolean;
  onChangeShowBadDataIcons: (showBadDataIcons: boolean) => void;
  showBadDataIcons?: boolean;
  onChangeShowUncertainDataIcons: (showUncertainDataIcons: boolean) => void;
  showUncertainDataIcons?: boolean;
};
export const DataQualityPreferencesModal = ({
  visible,
  onHide,
  showBadDataIcons,
  showUncertainDataIcons,
  onChangeShowBadDataIcons,
  onChangeShowUncertainDataIcons,
}: DataQualityPreferencesModalOptions) => {
  return (
    <Modal onDismiss={onHide} visible={visible} header='Data quality'>
      <SpaceBetween direction='vertical' size='xs'>
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
    </Modal>
  );
};
