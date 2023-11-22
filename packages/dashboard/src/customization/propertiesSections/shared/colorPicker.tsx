import React from 'react';
import './styles.css';
import type { FC } from 'react';

const ColorPicker: FC<{ color: string; updateColor: (newColor: string) => void }> = ({
  color,
  updateColor,
  ...other
}) => {
  return (
    <div className='color-picker-container' style={{ backgroundColor: color }} {...other}>
      <input
        aria-label='color picker'
        type='color'
        value={color}
        onChange={(e) => {
          updateColor(e.target.value);
        }}
      />
    </div>
  );
};

export default ColorPicker;
