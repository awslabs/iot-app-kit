import SegmentedControl from '@cloudscape-design/components/segmented-control';
import React, { useState } from 'react';

export const BROWSE_SEGMENT_ID = 'browse-assets';
export const SEARCH_SEGMENT_ID = 'search-assets';

type SegmentId = typeof BROWSE_SEGMENT_ID | typeof SEARCH_SEGMENT_ID;

export interface BrowseSearchToggleProps {
  selectedSegment: SegmentId;
  onChange: (selectedSegment: SegmentId) => void;
}

export function BrowseSearchToggle({
  selectedSegment,
  onChange,
}: BrowseSearchToggleProps) {
  return (
    <SegmentedControl
      selectedId={selectedSegment}
      onChange={({ detail: { selectedId: selectedSegment } }) =>
        onChange(selectedSegment as SegmentId)
      }
      options={[
        { text: 'Browse', id: BROWSE_SEGMENT_ID },
        // { text: 'Search', id: SEARCH_SEGMENT_ID },
        { text: 'Search', id: SEARCH_SEGMENT_ID, disabled: true },
      ]}
    />
  );
}

export function useBrowseSearchToggle() {
  const DEFAULT_SEGMENT_ID = BROWSE_SEGMENT_ID;
  const [selectedSegment, setSelectedSegment] =
    useState<SegmentId>(DEFAULT_SEGMENT_ID);

  return { selectedSegment, onChangeSegment: setSelectedSegment };
}
