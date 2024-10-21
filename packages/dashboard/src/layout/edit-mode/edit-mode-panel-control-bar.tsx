import React, { memo } from 'react';
import {
  PanelControlBar,
  PanelToggleButton,
} from '~/features/dashboard-panels';

export const EditModePanelControlBar = memo(function () {
  return (
    <PanelControlBar>
      <PanelToggleButton
        title='Resources'
        mode='edit'
        panelType='resources'
        iconType='folder'
      />

      <PanelToggleButton
        title='Customization'
        mode='edit'
        panelType='customization'
        iconType='edit'
      />

      <PanelToggleButton
        title='Settings'
        mode='edit'
        panelType='settings'
        iconType='settings'
      />
    </PanelControlBar>
  );
});
