import React from 'react';
import { ExpandableSection, Input, SpaceBetween, Toggle } from '@cloudscape-design/components';
import ExpandableSectionHeader from '../../shared/expandableSectionHeader';
import { useWidgetLense } from '../../utils/useWidgetLense';
import type { FC } from 'react';
import type { InputProps, ToggleProps } from '@cloudscape-design/components';
import type { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import type { Widget } from '~/types';
import type { BarChartWidget, LineChartWidget, ScatterChartWidget } from '~/customization/widgets/types';
import type { AxisSettings } from '../../../../customization/settings';

import * as awsui from '@cloudscape-design/design-tokens';

import './index.css';

export type AxisWidget = LineChartWidget | ScatterChartWidget | BarChartWidget;

export const isAxisSettingsSupported = (widget: Widget): widget is AxisWidget =>
  ['line-chart', 'scatter-chart', 'bar-chart'].some((t) => t === widget.type);

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

const AxisSetting: FC<AxisWidget> = (widget) => {
  const [axisSetting = defaultAxisSetting, updateAxisSettings] = useWidgetLense<AxisWidget, AxisSettings | undefined>(
    widget,
    (w) => w.properties.axis,
    (w, axis) => ({
      ...w,
      properties: {
        ...w.properties,
        axis,
      },
    })
  );

  const toggleShowX: NonCancelableEventHandler<ToggleProps.ChangeDetail> = ({ detail: { checked } }) => {
    updateAxisSettings({ ...axisSetting, showX: checked });
  };

  const toggleShowY: NonCancelableEventHandler<ToggleProps.ChangeDetail> = ({ detail: { checked } }) => {
    updateAxisSettings({ ...axisSetting, showY: checked });
  };

  const updateLabel: NonCancelableEventHandler<InputProps.ChangeDetail> = ({ detail: { value } }) => {
    updateAxisSettings({
      ...axisSetting,
      yAxisLabel: value,
    });
  };

  return (
    <ExpandableSection
      headerText={<ExpandableSectionHeader>{defaultMessages.header}</ExpandableSectionHeader>}
      defaultExpanded
    >
      <SpaceBetween size='m' direction='vertical'>
        <SpaceBetween size='s' direction='horizontal'>
          <Toggle checked={!!axisSetting.showX} onChange={toggleShowX} data-test-id='axis-setting-x-toggle'>
            {defaultMessages.toggleXLabel}
          </Toggle>
          <Toggle checked={!!axisSetting.showY} onChange={toggleShowY} data-test-id='axis-setting-y-toggle'>
            {defaultMessages.toggleYLabel}
          </Toggle>
        </SpaceBetween>

        <div className='axis-property-label' style={{ gap: awsui.spaceScaledS }}>
          <label htmlFor='axis-label-y' data-test-id='axis-setting-y-label-content'>
            {defaultMessages.yLabelContent}
          </label>
          <div className='axis-property-label-y'>
            <Input
              controlId='axis-label-y'
              value={axisSetting.yAxisLabel || ''}
              onChange={updateLabel}
              data-test-id='axis-setting-y-label-input'
            />
          </div>
        </div>
      </SpaceBetween>
    </ExpandableSection>
  );
};

export default AxisSetting;
