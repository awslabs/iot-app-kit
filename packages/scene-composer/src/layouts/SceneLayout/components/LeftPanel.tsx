import React, { FC } from 'react';
import styled from 'styled-components';

import { Direction } from './utils';
import FoldableContainer from './FoldableContainer';
import TabbedPanelContainer from './TabbedPanelContainer';

const FixedWidthDiv = styled.div`
  width: 400px;
  height: 100%;
  overflow-y: auto;
`;

const LeftPanel: FC<Record<string, JSX.Element>> = (props) => (
  <FoldableContainer direction={Direction.Left}>
    <FixedWidthDiv>
      <TabbedPanelContainer panels={props} />
    </FixedWidthDiv>
  </FoldableContainer>
);

export default LeftPanel;
