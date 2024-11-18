import { useState } from 'react';

import { type Direction } from './utils';
import FoldableContainer from './FoldableContainer';
import TabbedPanelContainer from './TabbedPanelContainer';
import './ScenePanel.scss';

interface PanelType {
  direction: typeof Direction.Left | typeof Direction.Right;
  panels: Record<string, JSX.Element>;
  collapse?: boolean;
}

const ScenePanel = (props: PanelType) => {
  const { direction, collapse = false, panels } = props;
  const [isOpen, setIsOpen] = useState<boolean>(!collapse);

  return (
    <FoldableContainer direction={direction} open={isOpen} setIsOpen={setIsOpen}>
      <div className={'tm-collapse-panel ' + `${isOpen ? 'open' : ''}`}>
        <TabbedPanelContainer panels={panels} />
      </div>
    </FoldableContainer>
  );
};
export default ScenePanel;
