import React from 'react';

import FormField from '@cloudscape-design/components/form-field';
import {
  AssetForAssetModelSelect,
  AssetForAssetModelSelectOptions,
} from './assetForAssetModelSelect';

export const AssetForAssetModelSelectForm = (
  props: AssetForAssetModelSelectOptions
) => (
  <FormField
    label='Default asset'
    description='This asset will be the default view in both edit and preview mode.'
  >
    <AssetForAssetModelSelect {...props} />
  </FormField>
);
