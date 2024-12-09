import { type PropertyLens } from '../../../customization/propertiesSection';
import { PropertiesSection } from '../../../customization/propertiesSectionComponent';
import { type TextWidget } from '../../../customization/widgets/types';
import { type DashboardWidget } from '../../../types';
import { maybeWithDefault } from '../../../util/maybe';
import LinkSettings from './link';
import TextSettings from './text';

const isTextWidget = (w: DashboardWidget): w is TextWidget => w.type === 'text';

const RenderTextSettingsConfiguration = ({
  useProperty,
}: {
  useProperty: PropertyLens<TextWidget>;
}) => {
  const [fontColor, updateFontColor] = useProperty(
    (properties) => properties.fontSettings?.fontColor,
    (properties, updatedFontColor) => ({
      ...properties,
      fontSettings: { ...properties.fontSettings, fontColor: updatedFontColor },
    })
  );
  const [isBold, toggleBold] = useProperty(
    (properties) => properties.fontSettings?.isBold,
    (properties, updatedIsBold) => ({
      ...properties,
      fontSettings: { ...properties.fontSettings, isBold: updatedIsBold },
    })
  );
  const [isItalic, toggleItalic] = useProperty(
    (properties) => properties.fontSettings?.isItalic,
    (properties, updatedIsItalic) => ({
      ...properties,
      fontSettings: { ...properties.fontSettings, isItalic: updatedIsItalic },
    })
  );
  const [isUnderlined, toggleUnderlined] = useProperty(
    (properties) => properties.fontSettings?.isUnderlined,
    (properties, updatedIsUnderlined) => ({
      ...properties,
      fontSettings: {
        ...properties.fontSettings,
        isUnderlined: updatedIsUnderlined,
      },
    })
  );
  const [fontSize, updateFontSize] = useProperty(
    (properties) => properties.fontSettings?.fontSize,
    (properties, updatedFontSize) => ({
      ...properties,
      fontSettings: { ...properties.fontSettings, fontSize: updatedFontSize },
    })
  );

  const [href, updateHref] = useProperty(
    (properties) => properties.href,
    (properties, updatedHref) => ({ ...properties, href: updatedHref })
  );
  const [isUrl, toggleIsUrl] = useProperty(
    (properties) => properties.isUrl,
    (properties, updatedIsUrl) => ({ ...properties, isUrl: updatedIsUrl })
  );

  const textSettingsProps = {
    fontColor: maybeWithDefault(undefined, fontColor),
    updateFontColor,
    isBold: maybeWithDefault(undefined, isBold),
    toggleBold,
    isItalic: maybeWithDefault(undefined, isItalic),
    toggleItalic,
    isUnderlined: maybeWithDefault(undefined, isUnderlined),
    toggleUnderlined,
    fontSize: maybeWithDefault(undefined, fontSize),
    updateFontSize,
  };

  const linkSettingsProps = {
    href: maybeWithDefault(undefined, href),
    updateHref,
    isUrl: maybeWithDefault(undefined, isUrl),
    toggleIsUrl,
  };

  return (
    <>
      <TextSettings {...textSettingsProps} />
      <LinkSettings {...linkSettingsProps} />
    </>
  );
};

export const TextSettingsConfiguration: React.FC = () => (
  <PropertiesSection
    isVisible={isTextWidget}
    render={({ useProperty }) => (
      <RenderTextSettingsConfiguration useProperty={useProperty} />
    )}
  />
);
