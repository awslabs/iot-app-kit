import React from 'react';

import { PropertiesSection, PropertiesSectionProps } from '~/customization/propertiesSectionComponent';
import { AxisSettings } from '~/customization/settings';
import { DashboardWidget } from '~/types';
import { maybeWithDefault } from '~/util/maybe';
import AxisSection from './section';

const axisWidgetTypes: readonly string[] = ['line-chart', 'scatter-chart', 'bar-chart', 'status-timeline'];
// The <StatusTimeline /> widget does not support the Y axis
const axisWidgetTypesThatSupportYAxis: readonly string[] = ['line-chart', 'scatter-chart', 'bar-chart'];

type AxisWidget = DashboardWidget<{ axis?: AxisSettings }>;
const isAxisWidget = (w: DashboardWidget): w is AxisWidget => axisWidgetTypes.some((t) => t === w.type);
const supportsYAxis = (w: DashboardWidget): w is AxisWidget =>
  axisWidgetTypesThatSupportYAxis.some((t) => t === w.type);

const isAxisWidgetWithYAxis = (w: DashboardWidget): w is AxisWidget => isAxisWidget(w) && supportsYAxis(w);
const isAxisWidgetWithoutYAxis = (w: DashboardWidget): w is AxisWidget => isAxisWidget(w) && !supportsYAxis(w);

const AxisSettingSection = ({
  isVisible,
  usesYAxis,
}: {
  isVisible: PropertiesSectionProps<AxisWidget>['isVisible'];
  usesYAxis: boolean;
}) => (
  <PropertiesSection
    isVisible={isVisible}
    render={({ useProperty }) => {
      const [axis, updateAxis] = useProperty(
        (properties) => properties.axis,
        (properties, updatedAxis) => ({ ...properties, axis: updatedAxis })
      );

      return <AxisSection axis={maybeWithDefault(undefined, axis)} updateAxis={updateAxis} usesYAxis={usesYAxis} />;
    }}
  />
);

export const AxisSettingsConfiguration: React.FC = () => (
  <>
    <AxisSettingSection isVisible={isAxisWidgetWithYAxis} usesYAxis={true} />
    <AxisSettingSection isVisible={isAxisWidgetWithoutYAxis} usesYAxis={false} />
  </>
);
