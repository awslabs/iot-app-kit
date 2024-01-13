import { Button } from '@cloudscape-design/components';
import {
  borderRadiusDropdown,
  colorBackgroundDropdownItemHover,
} from '@cloudscape-design/design-tokens';
import React, { useRef } from 'react';
import { useHoverDirty } from 'react-use';

import Hide from './hide.svg';
import Show from './show.svg';

type VisibilityToggleOptions = {
  title?: string;
  visible: boolean;
  onToggle: () => void;
};

const VisibleIcon = ({ visible }: { visible: boolean }) => {
  return visible ? (
    <img alt='show Property' src={Show} />
  ) : (
    <img alt='hide Property' src={Hide} />
  );
};

export const VisibilityToggle = ({
  title = '',
  visible,
  onToggle,
}: VisibilityToggleOptions) => {
  const hoverRef = useRef<HTMLDivElement>(null);
  const isHovering = useHoverDirty(hoverRef);
  const titleText = visible
    ? `Hide ${title} Property`
    : `Show ${title} Proprerty`;
  const icon = <VisibleIcon visible={visible} />;

  return (
    <div
      ref={hoverRef}
      style={{
        backgroundColor: isHovering
          ? colorBackgroundDropdownItemHover
          : undefined,
        borderRadius: borderRadiusDropdown,
      }}
      className='base-chart-legend-row-line-container'
    >
      <div title={titleText}>
        <Button onClick={onToggle} variant='icon' iconSvg={icon} />
      </div>
    </div>
  );
};
