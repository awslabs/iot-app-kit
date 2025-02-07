import { memo, useState } from 'react';
import { type SVGIcon } from '~/features/widget-plugins/plugin';

export interface WidgetIconProps {
  widgetName: string;
  icon: {
    light: SVGIcon;
    dark: SVGIcon;
  };
}

export const WidgetIcon = memo(({ widgetName, icon }: WidgetIconProps) => {
  const [over, setOver] = useState(false);

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <span onMouseOver={() => setOver(true)} onMouseOut={() => setOver(false)}>
      <img
        src={(over ? icon.dark : icon.light) as unknown as string}
        alt={`${widgetName} widget`}
      />
    </span>
  );
});
