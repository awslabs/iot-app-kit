import SegmentedControl from '@cloudscape-design/components/segmented-control';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';

export const BROWSE_SEGMENT_ID = 'browse-assets';
export const ASSET_MODEL_SEGMENT_ID = 'asset-model-assets';
export const SEARCH_SEGMENT_ID = 'search-assets';

type SegmentId =
  | typeof BROWSE_SEGMENT_ID
  | typeof ASSET_MODEL_SEGMENT_ID
  | typeof SEARCH_SEGMENT_ID;

export interface BrowseSearchToggleProps {
  onChange: (selectedSegment: SegmentId) => void;
  selectedSegment: SegmentId;
}

export function BrowseSearchToggle({
  onChange,
  selectedSegment,
}: BrowseSearchToggleProps) {
  const isEdgeModeEnabled = useSelector(
    (state: DashboardState) => state.isEdgeModeEnabled
  );

  return (
    <SegmentedControl
      selectedId={selectedSegment}
      onChange={({ detail: { selectedId: selectedSegment } }) =>
        onChange(selectedSegment as SegmentId)
      }
      options={[
        { text: 'Browse', id: BROWSE_SEGMENT_ID },
        { text: 'Find', id: ASSET_MODEL_SEGMENT_ID },
        { text: 'Search', id: SEARCH_SEGMENT_ID, disabled: isEdgeModeEnabled },
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
