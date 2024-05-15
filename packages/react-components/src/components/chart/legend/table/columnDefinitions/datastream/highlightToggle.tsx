import {
  borderRadiusDropdown,
  colorBackgroundButtonNormalDefault,
  colorBackgroundDropdownItemHover,
} from '@cloudscape-design/design-tokens';
import React, { useRef } from 'react';
import { useHoverDirty } from 'react-use';

type HighlightToggleOptions = {
  title?: string;
  disabled?: boolean;
  color?: string;
  highlighted: boolean;
  onToggle: () => void;
};

export const HighlightToggle = ({
  title,
  disabled,
  color,
  highlighted,
  onToggle,
}: HighlightToggleOptions) => {
  const titleText = highlighted
    ? `Un-Highlight ${title} Property`
    : `Highlight ${title} Proprerty`;
  const hoverRef = useRef<HTMLDivElement>(null);
  const isHovering = useHoverDirty(hoverRef);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || e.key.toLowerCase() !== 'enter') return;
    onToggle();
  };

  return (
    <div
      ref={hoverRef}
      style={{
        backgroundColor: isHovering
          ? colorBackgroundDropdownItemHover
          : colorBackgroundButtonNormalDefault, //white background color matches surroundings to display that it is diabled
        borderRadius: borderRadiusDropdown,
      }}
      className={`base-chart-legend-row-line-container ${
        disabled ? 'disabled' : ''
      }`}
      onKeyDown={handleKeyDown}
      onClick={onToggle}
      aria-disabled={disabled}
      title={titleText}
      role='button'
      tabIndex={disabled ? -1 : 0}
    >
      <div
        className={`base-chart-legend-row-line-ind ${
          highlighted ? 'base-chart-legend-row-line-ind-highlighted' : ''
        }`}
        style={{
          backgroundColor: color ?? 'black',
        }}
      />
    </div>
  );
};
