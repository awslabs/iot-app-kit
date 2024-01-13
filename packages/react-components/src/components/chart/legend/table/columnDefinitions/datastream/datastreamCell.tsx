import React, { useCallback, useMemo } from 'react';
import { DataStreamInformation } from '../../types';
import { VisibilityToggle } from './visibilityToggle';
import { useVisibleDataStreams } from '../../../../hooks/useVisibleDataStreams';
import { useHighlightedDataStreams } from '../../../../hooks/useHighlightedDataStreams';
import { HighlightToggle } from './highlightToggle';
import { spaceStaticXxs } from '@cloudscape-design/design-tokens';
import { LEGEND_NAME_MIN_WIDTH_FACTOR } from '../../../../eChartsConstants';
import { useTruncate } from '../../../../../../hooks/useTruncate';

export const DataStreamCell = ({
  id,
  name,
  color,
  width,
}: DataStreamInformation & { width: number }) => {
  const { toggleVisibility, isDataStreamHidden } = useVisibleDataStreams();

  const isHidden = useMemo(
    () => isDataStreamHidden({ id }),
    [isDataStreamHidden, id]
  );

  const onToggleVisibility = useCallback(() => {
    toggleVisibility({ id });
  }, [toggleVisibility, id]);

  const { toggleHighlighted, isDataStreamHighlighted } =
    useHighlightedDataStreams();

  const isHighlighted = useMemo(
    () => isDataStreamHighlighted({ id }),
    [isDataStreamHighlighted, id]
  );

  const onToggleHighlighted = useCallback(() => {
    toggleHighlighted({ id });
  }, [toggleHighlighted, id]);

  const { truncateRef, truncate } = useTruncate<HTMLDivElement>();

  return (
    <div className='base-chart-legend-row-data-container'>
      <VisibilityToggle
        title={name}
        visible={!isHidden}
        onToggle={onToggleVisibility}
      />
      <HighlightToggle
        title={name}
        color={color}
        highlighted={isHighlighted}
        onToggle={onToggleHighlighted}
        disabled={isHidden}
      />
      <div
        className={`base-chart-legend-row-data ${
          isHidden ? 'hidden-legend' : ''
        }`}
        style={{
          marginBlock: spaceStaticXxs,
          minWidth: `${width / LEGEND_NAME_MIN_WIDTH_FACTOR}px`,
        }}
        ref={truncateRef}
        title={truncate ? name : undefined}
      >
        {name}
      </div>
    </div>
  );
};
