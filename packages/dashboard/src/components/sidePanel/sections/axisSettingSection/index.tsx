import React, { FC } from 'react';
import { DashboardMessages } from '../../../../messages';
import {
  ExpandableSection,
  Grid,
  Input,
  InputProps,
  SpaceBetween,
  Toggle,
  ToggleProps,
} from '@cloudscape-design/components';
import ExpandableSectionHeader from '../../shared/expandableSectionHeader';
import { useAppKitWidgetInput } from '../../utils';
import { Axis } from '@synchro-charts/core';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';

const defaultAxisSetting: Axis.Options = {
  labels: {
    yAxis: {
      content: '',
    },
  },
  showY: true,
  showX: true,
};
const AxisSetting: FC<{ messageOverrides: DashboardMessages }> = ({
  messageOverrides: {
    sidePanel: { axisMessages },
  },
}) => {
  const [axisSetting = defaultAxisSetting, updateAxisSettings] = useAppKitWidgetInput('axis');

  const toggleShowX: NonCancelableEventHandler<ToggleProps.ChangeDetail> = ({ detail: { checked } }) => {
    updateAxisSettings({ ...axisSetting, showX: checked });
  };

  const toggleShowY: NonCancelableEventHandler<ToggleProps.ChangeDetail> = ({ detail: { checked } }) => {
    updateAxisSettings({ ...axisSetting, showY: checked });
  };

  const updateLabel: NonCancelableEventHandler<InputProps.ChangeDetail> = ({ detail: { value } }) => {
    updateAxisSettings({
      ...axisSetting,
      labels: {
        yAxis: {
          content: value,
        },
      },
    });
  };

  return (
    <ExpandableSection
      headerText={<ExpandableSectionHeader>{axisMessages.header}</ExpandableSectionHeader>}
      defaultExpanded
    >
      <SpaceBetween size={'xs'} direction={'vertical'}>
        <Grid disableGutters gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
          <Toggle checked={!!axisSetting.showX} onChange={toggleShowX} data-test-id="axis-setting-x-toggle">
            {axisMessages.toggleXLabel}
          </Toggle>
          <Toggle checked={!!axisSetting.showY} onChange={toggleShowY} data-test-id="axis-setting-y-toggle">
            {axisMessages.toggleXLabel}
          </Toggle>
        </Grid>
        <Grid disableGutters gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
          <div className="align-items-center" data-test-id="axis-setting-y-label-content">
            {axisMessages.yLabelContent}
          </div>
          <div>
            <Input
              value={axisSetting.labels?.yAxis?.content || ''}
              onChange={updateLabel}
              data-test-id="axis-setting-y-label-input"
            />
          </div>
        </Grid>
      </SpaceBetween>
    </ExpandableSection>
  );
};

export default AxisSetting;
