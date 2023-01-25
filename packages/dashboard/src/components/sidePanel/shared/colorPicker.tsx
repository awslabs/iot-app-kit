import React, { FC } from 'react';
import './styles.css';

const ColorPicker: FC<{ color: string; updateColor: (newColor: string) => void }> = ({
  color,
  updateColor,
  ...other
}) => {
  return (
    <div className="color-picker-container" style={{ backgroundColor: color }} {...other}>
      <input
        type="color"
        value={color}
        onChange={(e) => {
          updateColor(e.target.value);
        }}
      />
    </div>
  );
};

export default ColorPicker;
