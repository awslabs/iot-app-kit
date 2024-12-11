import { type StyleSettingsMap } from '@iot-app-kit/core';
import { Colorizer } from '@iot-app-kit/core-util';
import uniq from 'lodash-es/uniq';
import { compact } from '@iot-app-kit/helpers';
import { type StyledAssetQuery } from '../../types';

const colorsFromProperties = ({
  properties,
}: {
  properties: { color?: string }[];
}) => compact(properties.map(({ color }) => color));

const applyDefault =
  (colorizer: ReturnType<typeof Colorizer>) =>
  <T extends { color?: string }>(item: T) => {
    if (item.color != null) return item;
    return colorizer.nextApply(item);
  };

export const colorerFromStyledQuery = (query: StyledAssetQuery) => {
  const assets = query.assets ?? [];
  const assetModels = query.assetModels ?? [];
  const properties = query.properties ?? [];

  const assetsColors = assets.flatMap(colorsFromProperties);
  const assetModelsColors = assetModels.flatMap(colorsFromProperties);
  const propertiesColors = colorsFromProperties({ properties });

  const existingColors = uniq([
    ...assetsColors,
    ...assetModelsColors,
    ...propertiesColors,
  ]);

  const colorer = Colorizer();
  colorer.remove(existingColors);

  return applyDefault(colorer);
};

export const colorerFromStyleSettings = (styleSettings: StyleSettingsMap) => {
  const existingColors = compact(
    Object.values(styleSettings).map(({ color }) => color)
  );

  const colorer = Colorizer();
  colorer.remove(existingColors);

  return applyDefault(colorer);
};
