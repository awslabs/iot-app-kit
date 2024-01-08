import React from 'react';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import {
  LineScatterChartWidget,
  QueryWidget,
  TableWidget,
} from '~/customization/widgets/types';
import { DashboardWidget } from '~/types';
import { GeneralPropertiesAlarmsSection } from './section';
import { StyledPropertiesAlarmsSection } from './styledSection';
import { PropertyLens } from '~/customization/propertiesSection';
import { useClients } from '~/components/dashboard/clientContext';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';

// exclude table because it is handled specially
const isQueryWidgetExcludesTable = (w: DashboardWidget): w is QueryWidget =>
  'queryConfig' in w.properties && w.type !== 'table' && w.type !== 'xy-plot';
const isTableWidget = (w: DashboardWidget): w is TableWidget =>
  w.type === 'table';
const isStyledWidget = (w: DashboardWidget): w is LineScatterChartWidget =>
  w.type === 'xy-plot';

const RenderPropertiesSectionWithStyledQuery = ({
  useProperty,
}: {
  useProperty: PropertyLens<LineScatterChartWidget>;
}) => {
  const { iotSiteWiseClient } = useClients();

  const [queryConfig, updateQueryConfig] = useProperty(
    (properties) => properties.queryConfig,
    (properties, updatedQueryConfig) => ({
      ...properties,
      queryConfig: updatedQueryConfig,
    })
  );

  if (!iotSiteWiseClient) return null;

  return (
    <StyledPropertiesAlarmsSection
      queryConfig={queryConfig}
      updateQueryConfig={updateQueryConfig}
      client={iotSiteWiseClient}
    />
  );
};

const RenderPropertiesSectionWithoutTable = ({
  useProperty,
}: {
  useProperty: PropertyLens<QueryWidget>;
}) => {
  const { iotSiteWiseClient } = useClients();

  const [queryConfig, updateQueryConfig] = useProperty(
    (properties) => properties.queryConfig,
    (properties, updatedQueryConfig) => ({
      ...properties,
      queryConfig: updatedQueryConfig,
    })
  );
  const [styleSettings, updateStyleSettings] = useProperty(
    (properties) => properties.styleSettings,
    (properties, updatedStyleSettings) => ({
      ...properties,
      styleSettings: updatedStyleSettings,
    })
  );

  if (!iotSiteWiseClient) return null;

  return (
    <GeneralPropertiesAlarmsSection
      queryConfig={queryConfig}
      updateQueryConfig={updateQueryConfig}
      styleSettings={styleSettings}
      updateStyleSettings={updateStyleSettings}
      client={iotSiteWiseClient}
    />
  );
};

const RenderPropertiesSectionForTables = ({
  useProperty,
}: {
  useProperty: PropertyLens<TableWidget>;
}) => {
  const { iotSiteWiseClient } = useClients();

  const [queryConfig, updateQueryConfig] = useProperty(
    (properties) => properties.queryConfig,
    (properties, updatedQueryConfig) => ({
      ...properties,
      queryConfig: updatedQueryConfig,
    })
  );
  const [styleSettings, updateStyleSettings] = useProperty(
    (properties) => properties.styleSettings,
    (properties, updatedStyleSettings) => ({
      ...properties,
      styleSettings: updatedStyleSettings,
    })
  );

  if (!iotSiteWiseClient) return null;

  return (
    <GeneralPropertiesAlarmsSection
      queryConfig={queryConfig}
      updateQueryConfig={updateQueryConfig}
      styleSettings={styleSettings}
      updateStyleSettings={updateStyleSettings}
      colorable={false}
      client={iotSiteWiseClient}
    />
  );
};

const propertiesAndAlarmSettingstyle = {
  padding: spaceScaledXs,
};

export const PropertiesAndAlarmsSettingsConfiguration: React.FC = () => (
  <div style={propertiesAndAlarmSettingstyle}>
    <PropertiesSection
      isVisible={isStyledWidget}
      render={({ useProperty }) => (
        <RenderPropertiesSectionWithStyledQuery useProperty={useProperty} />
      )}
    />
    <PropertiesSection
      isVisible={isQueryWidgetExcludesTable}
      render={({ useProperty }) => (
        <RenderPropertiesSectionWithoutTable useProperty={useProperty} />
      )}
    />
    <PropertiesSection
      isVisible={isTableWidget}
      render={({ useProperty }) => (
        <RenderPropertiesSectionForTables useProperty={useProperty} />
      )}
    />
  </div>
);
