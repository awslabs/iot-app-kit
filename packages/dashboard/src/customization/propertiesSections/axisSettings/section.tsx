import * as React from 'react';
import Box from '@cloudscape-design/components/box';

import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Input from '@cloudscape-design/components/input';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Toggle from '@cloudscape-design/components/toggle';
import type { FC } from 'react';
import type { InputProps } from '@cloudscape-design/components/input';
import type { ToggleProps } from '@cloudscape-design/components/toggle';
import type { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import type { AxisSettings } from '../../settings';

import * as awsui from '@cloudscape-design/design-tokens';

import './section.css';

const defaultAxisSetting: AxisSettings = {
  yAxisLabel: '',
  showY: true,
  showX: true,
};

const defaultMessages = {
  header: 'Axis',
  yLabelContent: 'Y axis Label',
  toggleXLabel: 'View X axis',
  toggleYLabel: 'View Y axis',
};

type AxisSectionProps = {
  usesYAxis: boolean;
  axis?: AxisSettings;
  updateAxis: (newValue: AxisSettings | undefined) => void;
};

const AxisSection: FC<AxisSectionProps> = ({
  usesYAxis,
  axis = defaultAxisSetting,
  updateAxis,
}) => {
  const toggleShowX: NonCancelableEventHandler<ToggleProps.ChangeDetail> = ({
    detail: { checked },
  }) => {
    updateAxis({ ...axis, showX: checked });
  };

  const toggleShowY: NonCancelableEventHandler<ToggleProps.ChangeDetail> = ({
    detail: { checked },
  }) => {
    updateAxis({ ...axis, showY: checked });
  };

  const updateLabel: NonCancelableEventHandler<InputProps.ChangeDetail> = ({
    detail: { value },
  }) => {
    updateAxis({
      ...axis,
      yAxisLabel: value,
    });
  };

  return (
    <ExpandableSection
      className='accordian-header'
      headerText={defaultMessages.header}
      defaultExpanded
      variant='footer'
    >
      <Box padding='s'>
        <SpaceBetween size='m' direction='vertical'>
          <SpaceBetween size='s' direction='horizontal'>
            <Toggle
              checked={!!axis.showX}
              onChange={toggleShowX}
              data-test-id='axis-setting-x-toggle'
            >
              {defaultMessages.toggleXLabel}
            </Toggle>

            {usesYAxis && (
              <Toggle
                checked={!!axis.showY}
                onChange={toggleShowY}
                data-test-id='axis-setting-y-toggle'
              >
                {defaultMessages.toggleYLabel}
              </Toggle>
            )}
          </SpaceBetween>

          {usesYAxis && (
            <div
              className='axis-property-label'
              style={{ gap: awsui.spaceScaledS }}
            >
              <label
                htmlFor='axis-label-y'
                data-test-id='axis-setting-y-label-content'
              >
                {defaultMessages.yLabelContent}
              </label>
              <div className='axis-property-label-y'>
                <Input
                  controlId='axis-label-y'
                  value={axis.yAxisLabel || ''}
                  onChange={updateLabel}
                  data-test-id='axis-setting-y-label-input'
                />
              </div>
            </div>
          )}
        </SpaceBetween>
      </Box>
    </ExpandableSection>
  );
};

export default AxisSection;
