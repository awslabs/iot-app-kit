import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon, IconProps } from '@awsui/components-react';
import * as awsui from '@awsui/design-tokens';

import { Direction } from './utils';

const WrapperFoldLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
`;

const WrapperFoldRight = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: stretch;
  height: 100%;
`;

const Content = styled.div`
  flex: 1;
`;

const Handle = styled.div`
  flex: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-left: 1px solid ${awsui.colorBorderDividerDefault};
  border-right: 1px solid ${awsui.colorBorderDividerDefault};

  &:hover {
    background-color: ${awsui.colorBackgroundDropdownItemHover};
  }
`;

type FoldableContainerProps = React.PropsWithChildren<{
  direction: Direction;
}>;

const FoldableContainer: React.FC<FoldableContainerProps> = ({ direction, children }: FoldableContainerProps) => {
  const [fold, setFold] = useState(false);

  let iconName: IconProps.Name;
  if ((fold && direction === 'Left') || (!fold && direction === 'Right')) {
    iconName = 'angle-right';
  } else {
    iconName = 'angle-left';
  }

  const Wrapper = direction === 'Left' ? WrapperFoldLeft : WrapperFoldRight;
  return (
    <Wrapper>
      {!fold && <Content>{children}</Content>}
      <Handle data-testid={'handle'} onClick={() => setFold(!fold)}>
        <Icon name={iconName} size='small' variant='normal' />
      </Handle>
    </Wrapper>
  );
};

export default FoldableContainer;
