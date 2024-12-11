import { memo } from 'react';
import { PanelControlBar } from '#features/panels/panelControlBar';
import { PanelToggleButton } from '#features/panels/panelToggleButton';

export const EditModePanelControlBar = memo(() => {
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
