import React, { useState } from 'react';

interface widgetIconProps {
  widget: string;
  defaultIcon: string;
  darkIcon: string;
}

const WidgetIcon = ({ widget, defaultIcon, darkIcon }: widgetIconProps) => {
  const [over, setOver] = useState(false);
  return (
    <span onMouseOver={() => setOver(true)} onMouseOut={() => setOver(false)}>
      <img src={over ? darkIcon : defaultIcon} alt={`${widget} widget`} />
    </span>
  );
};

export default WidgetIcon;
