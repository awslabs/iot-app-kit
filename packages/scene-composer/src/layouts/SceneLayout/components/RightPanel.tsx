import React, { FC } from 'react';
import styled from 'styled-components';

import FoldableContainer from './FoldableContainer';
import TabbedPanelContainer from './TabbedPanelContainer';
import { Direction } from './utils';

const FixedWidthDiv = styled.div`
  width: 400px;
  height: 100%;
  overflow-y: auto;
`;

const RightPanel: FC<Record<string, JSX.Element>> = (props) => (
  <FoldableContainer direction={Direction.Right}>
    <FixedWidthDiv>
      <TabbedPanelContainer panels={props} />
    </FixedWidthDiv>
  </FoldableContainer>
);

export default RightPanel;
