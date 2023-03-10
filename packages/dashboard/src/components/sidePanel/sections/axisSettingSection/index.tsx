import React, { FC } from 'react';
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
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { Widget } from '~/types';
import { useWidgetLense } from '../../utils/useWidgetLense';
import { BarChartWidget, LineChartWidget, ScatterChartWidget } from '~/customization/widgets/types';
import { merge } from 'lodash';
import { AxisSettings } from '../../../../customization/settings';

export const isAxisSettingsSupported = (widget: Widget): boolean =>
  ['iot-line', 'iot-scatter', 'iot-bar'].some((t) => t === widget.type);

export type AxisWidget = LineChartWidget | ScatterChartWidget | BarChartWidget;

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
    (w, axis) => merge(w, { properties: { axis } })
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
      <SpaceBetween size='xs' direction='vertical'>
        <Grid disableGutters gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
          <Toggle checked={!!axisSetting.showX} onChange={toggleShowX} data-test-id='axis-setting-x-toggle'>
            {defaultMessages.toggleXLabel}
          </Toggle>
          <Toggle checked={!!axisSetting.showY} onChange={toggleShowY} data-test-id='axis-setting-y-toggle'>
            {defaultMessages.toggleXLabel}
          </Toggle>
        </Grid>
        <Grid disableGutters gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
          <div className='align-items-center' data-test-id='axis-setting-y-label-content'>
            {defaultMessages.yLabelContent}
          </div>
          <div>
            <Input
              value={axisSetting.yAxisLabel || ''}
              onChange={updateLabel}
              data-test-id='axis-setting-y-label-input'
            />
          </div>
        </Grid>
      </SpaceBetween>
    </ExpandableSection>
  );
};

export default AxisSetting;
