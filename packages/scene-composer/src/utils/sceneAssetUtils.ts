import path from 'path';

import { IntlFormatters } from '@formatjs/intl';

import { AssetType, ModelFileTypeList } from '../interfaces';
import { DisplayMessageCategory, IDisplayMessage } from '../store/internalInterfaces';

import { extractFileNameExtFromUrl } from './pathUtils';

export const TILESET_JSON = 'tileset.json';

export const evaluateModelType = (
  filePath: string,
  addMessages: (messages: IDisplayMessage[]) => void,
  formatMessage: IntlFormatters['formatMessage'],
): { modelName: string; modelType: AssetType } | undefined => {
  const [name, ext] = extractFileNameExtFromUrl(filePath);
  const modelType: AssetType = ext.toUpperCase() as AssetType;

  const fileName = `${name}.${ext}`;

  // Tiles3D asset type
  if (fileName === TILESET_JSON) {
    // Node name is the parent directory name
    const dir = path.dirname(filePath);
    const modelName = dir === '.' ? name : dir.split('/').pop();
    return {
      modelName: modelName!,
      modelType: AssetType.TILES_3D,
    };
  }

  if (!ModelFileTypeList.includes(modelType)) {
    const messageText = formatMessage(
      {
        defaultMessage: `File with extension {modelType} is not a supported model type`,
        description: 'Warning for selecting an unsupported file type',
      },
      { modelType },
    );
    addMessages([{ category: DisplayMessageCategory.Warning, messageText }]);
    return;
  }

  return {
    modelName: name,
    modelType: AssetType[modelType],
  };
};
