import React from 'react';
import './styles.css';
import type { FC } from 'react';

const ColorPicker: FC<{
  id?: string;
  color: string;
  updateColor: (newColor: string) => void;
}> = ({ id, color, updateColor, ...other }) => {
  return (
    <input
      id={id}
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
