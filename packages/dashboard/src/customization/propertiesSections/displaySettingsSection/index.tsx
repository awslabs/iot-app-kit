import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import {
  type GaugeWidget,
  type KPIWidget,
} from '~/customization/widgets/types';
import { type DashboardWidget } from '~/types';
import { RenderGaugeDisplaySettingsSection } from './gaugeDisplaySettings';
import { RenderDisplaySettingsSection } from './kpiDisplaySettings';

const widgetWithCustomDisplaySettings: readonly string[] = ['kpi', 'status'];

export const isDisplaySettingsWidget = (
  widget: DashboardWidget
): widget is KPIWidget =>
  widgetWithCustomDisplaySettings.some((t) => t === widget.type);

export const isGaugeDisplaySettingsWidget = (
  widget: DashboardWidget
): widget is GaugeWidget => widget.type === 'gauge';

export const DisplaySettingsSection: React.FC = () => (
  <>
    <PropertiesSection
      isVisible={isDisplaySettingsWidget}
      render={({ useProperty }) => (
        <RenderDisplaySettingsSection useProperty={useProperty} />
      )}
    />
    <PropertiesSection
      isVisible={isGaugeDisplaySettingsWidget}
      render={({ useProperty }) => (
        <RenderGaugeDisplaySettingsSection useProperty={useProperty} />
      )}
    />
  </>
);
