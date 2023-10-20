import Toggle from '@cloudscape-design/components/toggle';
import React from 'react';

export interface AnnotationsSettingsProps {
  colorBreachedData: boolean;
  toggleColorBreachedData: (colorBreachedData: boolean) => void;
}

export function AnnotationsSettings({ colorBreachedData, toggleColorBreachedData }: AnnotationsSettingsProps) {
  return (
    <Toggle checked={colorBreachedData} onChange={(e) => toggleColorBreachedData(e.detail.checked)}>
      Apply threshold color across all data
    </Toggle>
  );
}
