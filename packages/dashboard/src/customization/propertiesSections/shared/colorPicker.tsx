import React from 'react';
import './styles.css';
import type { FC } from 'react';

const ColorPicker: FC<{ color: string; updateColor: (newColor: string) => void }> = ({
  color,
  updateColor,
  ...other
}) => {
  return (
    <input
      aria-label='color picker'
      type='color'
      value={color}
      onChange={(e) => {
        updateColor(e.target.value);
      }}
      className='color-picker'
      style={{ backgroundColor: color }}
      {...other}
    />
  );
};

export default ColorPicker;
