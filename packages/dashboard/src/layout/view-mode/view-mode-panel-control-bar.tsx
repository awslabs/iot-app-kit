import React, { memo } from 'react';
import {
  PanelControlBar,
  PanelToggleButton,
} from '~/features/dashboard-panels';

export const ViewModePanelControlBar = memo(function () {
  return (
    <PanelControlBar>
      <PanelToggleButton
        title='Resources'
        mode='view'
        panelType='assistant'
        iconType='gen-ai'
      />
    </PanelControlBar>
  );
});
