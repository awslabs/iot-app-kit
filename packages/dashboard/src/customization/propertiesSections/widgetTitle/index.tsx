import SpaceBetween from '@cloudscape-design/components/space-between';
import { type PropertyLens } from '../../../customization/propertiesSection';
import { PropertiesSection } from '../../../customization/propertiesSectionComponent';
import type { CommonChartProperties } from '../../../customization/widgets/types';
import { type DashboardWidget } from '../../../types';
import { maybeWithDefault } from '../../../util/maybe';
import { TitleSection } from './titleSection';

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
