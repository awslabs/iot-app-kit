import React from 'react';
import type { FC } from 'react';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { LineStyleDropdown } from '../components/lineStyleDropdown';
import { LineThicknessDropdown } from '../components/lineThicknessDropdown';
import { Box, SpaceBetween } from '@cloudscape-design/components';
import { LineTypeSection } from '../components/lineTypeDropdown';
import { DataPointStyleSection } from '../components/dataPointStyleSection';
import { defaultThickness } from './constant';
import './lineAndScatterStyleSettings.css';

type LineStyleSectionOptions = {
  lineType?: string;
  lineStyle?: string;
  lineThickness?: number;
  dataPointStyle?: string;
  updateType: (lineType: string) => void;
  updatelineStyle: (lineStyle: string) => void;
  updateLineThickness: (lineThickness: number) => void;
  updateDataPointStyle: (dataPointStyle: string) => void;
};

export const LineStyleSection: FC<LineStyleSectionOptions> = ({
  lineType,
  lineStyle,
  lineThickness,
  dataPointStyle,
  updateType,
  updatelineStyle,
  updateLineThickness,
  updateDataPointStyle,
}) => {
  return (
    <ExpandableSection className='accordian-header' headerText='Widget style' defaultExpanded variant='footer'>
      <Box padding='s'>
        <SpaceBetween size='m'>
          <LineTypeSection type={lineType} updateType={updateType} />
          <LineStyleDropdown lineStyle={lineStyle} updatelineStyle={updatelineStyle} />
          <LineThicknessDropdown
            lineThickness={lineThickness?.toString() ?? defaultThickness}
            updateLineThickness={(thickness: string) => {
              updateLineThickness(parseInt(thickness));
            }}
          />
          <DataPointStyleSection dataPointStyle={dataPointStyle} updateDataPointStyle={updateDataPointStyle} />
        </SpaceBetween>
      </Box>
    </ExpandableSection>
  );
};
