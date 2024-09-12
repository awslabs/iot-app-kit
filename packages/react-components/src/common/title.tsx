import { colorTextHeadingDefault } from '@cloudscape-design/design-tokens';
import React, { CSSProperties } from 'react';
import './title.css';

type TitleProps = {
  text?: string;
  style?: CSSProperties;
};

export const getAdjustedChartHeight = (hasTitle: boolean, height: number) => {
  return hasTitle ? height - 30 : height;
};

export const Title = ({ text, style = {}, ...rest }: TitleProps) => {
  if (!text) return null;

  return (
    <h3
      className='iot-app-kit-component-title'
      style={{ color: colorTextHeadingDefault, ...style }}
      {...rest}
    >
      {text}
    </h3>
  );
};
