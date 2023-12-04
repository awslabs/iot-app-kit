import React, { useState } from 'react';

interface widgetIconProps {
  widget: string;
  defaultIcon: string;
  darkIcon: string;
}

const WidgetIcon = ({ widget, defaultIcon, darkIcon }: widgetIconProps) => {
  const [over, setOver] = useState(false);
  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <span onMouseOver={() => setOver(true)} onMouseOut={() => setOver(false)}>
      <img src={over ? darkIcon : defaultIcon} alt={`${widget} widget`} />
    </span>
  );
};

export default WidgetIcon;
