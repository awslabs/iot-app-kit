import React from 'react';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { LineScatterChartWidget, QueryWidget, TableWidget } from '~/customization/widgets/types';
import { DashboardWidget } from '~/types';
import { GeneralPropertiesAlarmsSection } from './section';
import { StyledPropertiesAlarmsSection } from './styledSection';

// exclude table because it is handled specially
const isQueryWidgetExcludesTable = (w: DashboardWidget): w is QueryWidget =>
  'queryConfig' in w.properties && w.type !== 'table' && w.type !== 'line-scatter-chart';
const isTableWidget = (w: DashboardWidget): w is TableWidget => w.type === 'table';
const isStyledWidget = (w: DashboardWidget): w is LineScatterChartWidget => w.type === 'line-scatter-chart';

export const PropertiesAndAlarmsSettingsConfiguration: React.FC = () => (
  <>
    <PropertiesSection
      isVisible={isStyledWidget}
      render={({ useProperty }) => {
        const [queryConfig, updateQueryConfig] = useProperty(
          (properties) => properties.queryConfig,
          (properties, updatedQueryConfig) => ({ ...properties, queryConfig: updatedQueryConfig })
        );
        return <StyledPropertiesAlarmsSection queryConfig={queryConfig} updateQueryConfig={updateQueryConfig} />;
      }}
    />
    <PropertiesSection
      isVisible={isQueryWidgetExcludesTable}
      render={({ useProperty }) => {
        const [queryConfig, updateQueryConfig] = useProperty(
          (properties) => properties.queryConfig,
          (properties, updatedQueryConfig) => ({ ...properties, queryConfig: updatedQueryConfig })
        );
        const [styleSettings, updateStyleSettings] = useProperty(
          (properties) => properties.styleSettings,
          (properties, updatedStyleSettings) => ({ ...properties, styleSettings: updatedStyleSettings })
        );
        return (
          <GeneralPropertiesAlarmsSection
            queryConfig={queryConfig}
            updateQueryConfig={updateQueryConfig}
            styleSettings={styleSettings}
            updateStyleSettings={updateStyleSettings}
          />
        );
      }}
    />
    <PropertiesSection
      isVisible={isTableWidget}
      render={({ useProperty }) => {
        const [queryConfig, updateQueryConfig] = useProperty(
          (properties) => properties.queryConfig,
          (properties, updatedQueryConfig) => ({ ...properties, queryConfig: updatedQueryConfig })
        );
        const [styleSettings, updateStyleSettings] = useProperty(
          (properties) => properties.styleSettings,
          (properties, updatedStyleSettings) => ({ ...properties, styleSettings: updatedStyleSettings })
        );

        return (
          <GeneralPropertiesAlarmsSection
            queryConfig={queryConfig}
            updateQueryConfig={updateQueryConfig}
            styleSettings={styleSettings}
            updateStyleSettings={updateStyleSettings}
            colorable={false}
          />
        );
      }}
    />
  </>
);
