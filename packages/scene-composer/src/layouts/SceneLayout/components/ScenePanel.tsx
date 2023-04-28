import React, { FC, useState } from 'react';

import { PanelType } from '../../../interfaces';

import FoldableContainer from './FoldableContainer';
import TabbedPanelContainer from './TabbedPanelContainer';
import './ScenePanel.scss';

const ScenePanel: FC<PanelType> = (props: PanelType) => {
  const { direction, panels } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <FoldableContainer direction={direction} open={isOpen} setIsOpen={setIsOpen}>
      <div className={'tm-collapse-panel ' + `${isOpen ? 'open' : ''}`}>
        <TabbedPanelContainer panels={panels} />
      </div>
    </FoldableContainer>
  );
};

export default ScenePanel;
