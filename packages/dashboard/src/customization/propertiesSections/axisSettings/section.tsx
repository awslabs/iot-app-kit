import type { InputProps, ToggleProps } from '@cloudscape-design/components';
import {
  Box,
  Input,
  SpaceBetween,
  Toggle,
} from '@cloudscape-design/components';
import * as awsui from '@cloudscape-design/design-tokens';
import type { FC } from 'react';
import type { AxisSettings } from '../../settings';
import {
  FormLabel,
  StyledExpandableSection,
} from '../components/styledComponents';
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
  const toggleShowX: NonNullable<ToggleProps['onChange']> = ({
    detail: { checked },
  }) => {
    updateAxis({ ...axis, showX: checked });
  };

  const toggleShowY: NonNullable<ToggleProps['onChange']> = ({
    detail: { checked },
  }) => {
    updateAxis({ ...axis, showY: checked });
  };

  const updateLabel: NonNullable<InputProps['onChange']> = ({
    detail: { value },
  }) => {
    updateAxis({
      ...axis,
      yAxisLabel: value,
    });
  };

  return (
    <StyledExpandableSection
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
              <FormLabel
                htmlFor='axis-label-y'
                data-test-id='axis-setting-y-label-content'
              >
                {defaultMessages.yLabelContent}
              </FormLabel>
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
    </StyledExpandableSection>
  );
};

export default AxisSection;
