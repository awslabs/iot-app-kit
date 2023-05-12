import React, { useRef, useState } from 'react';

import { Direction } from './utils';
import FoldableContainer from './FoldableContainer';
import TabbedPanelContainer from './TabbedPanelContainer';
import './ScenePanel.scss';

interface PanelType {
  direction: typeof Direction.Left | typeof Direction.Right;
  panels: Record<string, JSX.Element>;
}

const ScenePanel = (props: PanelType) => {
  const { direction, panels } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<React.ReactFragment>(null);

  return (
    <FoldableContainer ref={ref} direction={direction} open={isOpen} setIsOpen={setIsOpen}>
      <div className={'tm-collapse-panel ' + `${isOpen ? 'open' : ''}`}>
        <TabbedPanelContainer panels={panels} />
      </div>
    </FoldableContainer>
  );
};
export default ScenePanel;
