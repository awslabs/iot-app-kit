import { memo } from 'react';
import { PanelControlBar } from '#features/panels/panelControlBar';
import { PanelToggleButton } from '#features/panels/panelToggleButton';

export const ViewModePanelControlBar = memo(() => {
  return (
    <PanelControlBar>
      <PanelToggleButton
        title='Assistant'
        mode='view'
        panelType='assistant'
        iconType='gen-ai'
      />
    </PanelControlBar>
  );
});
