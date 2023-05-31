import React from 'react';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { QueryWidget, TableWidget } from '~/customization/widgets/types';
import { DashboardWidget } from '~/types';
import { maybeWithDefault } from '~/util/maybe';
import { GeneralPropertiesAlarmsSection, TablePropertiesAlarmsSection } from './section';

// exclude table because it is handled specially
const isQueryWidgetExcludesTable = (w: DashboardWidget): w is QueryWidget =>
  'queryConfig' in w.properties && w.type !== 'table';
const isTableWidget = (w: DashboardWidget): w is TableWidget => w.type === 'table';

export const PropertiesAndAlarmsSettingsConfiguration: React.FC = () => (
  <>
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
        const [items, updateItems] = useProperty(
          (properties) => properties.items,
          (properties, updatedItems) => ({ ...properties, items: updatedItems })
        );

        return (
          <TablePropertiesAlarmsSection
            items={maybeWithDefault([], items)}
            updateItems={updateItems}
            queryConfig={queryConfig}
            updateQueryConfig={updateQueryConfig}
            styleSettings={styleSettings}
            updateStyleSettings={updateStyleSettings}
          />
        );
      }}
    />
  </>
);
