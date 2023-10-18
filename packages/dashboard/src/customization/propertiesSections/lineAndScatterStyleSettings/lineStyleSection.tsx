import React from 'react';
import type { FC } from 'react';

import ExpandableSection from '@cloudscape-design/components/expandable-section';

import { LineStyleDropdown } from '../components/lineStyleDropdown';
import { LineThicknessDropdown } from '../components/lineThicknessDropdown';
import { SpaceBetween } from '@cloudscape-design/components';

type LineStyleSectionOptions = {
  lineStyle?: string;
  updatelineStyle: (lineStyle: string) => void;
};

export const LineStyleSection: FC<LineStyleSectionOptions> = ({ lineStyle, updatelineStyle }) => {
  return (
    <ExpandableSection headerText='Line style' defaultExpanded>
      <SpaceBetween size='m'>
        <LineStyleDropdown lineStyle={lineStyle} updatelineStyle={updatelineStyle} />
        <LineThicknessDropdown /> {/* TODO */}
      </SpaceBetween>
    </ExpandableSection>
  );
};
