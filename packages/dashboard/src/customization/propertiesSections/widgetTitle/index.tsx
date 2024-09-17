import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { DashboardWidget } from '~/types';
import { TitleSection } from './titleSection';
import { maybeWithDefault } from '~/util/maybe';
import { PropertyLens } from '~/customization/propertiesSection';
import type { CommonChartProperties } from '~/customization/widgets/types';

const isWidgetTitle = (
  w: DashboardWidget
): w is DashboardWidget<CommonChartProperties> =>
  'queryConfig' in w.properties && !(w.type === 'text');

const RenderWidgetTitleSection = ({
  useProperty,
}: {
  useProperty: PropertyLens<DashboardWidget<CommonChartProperties>>;
}) => {
  const [titleMaybe, updateTitle] = useProperty(
    (properties) => properties.title,
    (properties, updatedTitle) => ({
      ...properties,
      title: updatedTitle,
    })
  );

  const title = maybeWithDefault(undefined, titleMaybe);

  return (
    <SpaceBetween size='s' direction='vertical'>
      <TitleSection title={title} updateTitle={updateTitle} />
    </SpaceBetween>
  );
};

export const WidgetTitle: React.FC = () => (
  <PropertiesSection
    isVisible={isWidgetTitle}
    render={({ useProperty }) => (
      <RenderWidgetTitleSection useProperty={useProperty} />
    )}
  />
);
