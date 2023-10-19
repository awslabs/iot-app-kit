import React from 'react';
import type { FC } from 'react';

import ExpandableSection from '@cloudscape-design/components/expandable-section';

import { LineStyleDropdown } from '../components/lineStyleDropdown';
import { LineThicknessDropdown } from '../components/lineThicknessDropdown';
import { SpaceBetween } from '@cloudscape-design/components';

type LineStyleSectionOptions = {
  lineStyle?: string;
  lineThickness?: number;
  updatelineStyle: (lineStyle: string) => void;
  updateLineThickness: (lineThickness: number) => void;
};

export const LineStyleSection: FC<LineStyleSectionOptions> = ({
  lineStyle,
  lineThickness,
  updatelineStyle,
  updateLineThickness,
}) => {
  return (
    <ExpandableSection headerText='Line style' defaultExpanded>
      <SpaceBetween size='m'>
        <LineStyleDropdown lineStyle={lineStyle} updatelineStyle={updatelineStyle} />
        <LineThicknessDropdown
          lineThickness={lineThickness?.toString() ?? '2'}
          updateLineThickness={(thickness: string) => {
            updateLineThickness(parseInt(thickness));
          }}
        />
      </SpaceBetween>
    </ExpandableSection>
  );
};
