import React from 'react';
import * as awsui from '@awsui/design-tokens';
import styled from 'styled-components';

import { colors } from '../../../../utils/styleUtils';

interface ISliderProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  showValue?: boolean;
}

const Div = styled.div`
  // background-color: grey;

  // :hover {
  //   background-color: red
  // }
`;

export const Slider: React.FC<ISliderProps> = (props) => {
  return (
    <Div
      style={{
        backgroundColor: awsui.colorBackgroundInputDisabled,
        display: 'inline-block',
        accentColor: colors.infoBlue,
      }}
    >
      {props.showValue && (
        <div style={{ display: 'flex', marginLeft: '12px', marginRight: '12px', marginTop: '6px' }}>
          Current value: {props.value}
        </div>
      )}
      <input
        data-testid={'slider'}
        {...props}
        type={'range'}
        style={{
          width: '186px',
          height: '32px',
          marginLeft: '12px',
          marginRight: '12px',
          display: 'flex',
        }}
      />
    </Div>
  );
};
