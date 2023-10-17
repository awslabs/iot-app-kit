import React from 'react';

import FormField from '@cloudscape-design/components/form-field';
import { AssetForAssetModelSelect, AssetForAssetModelSelectOptions } from './assetForAssetModelSelect';

export const AssetForAssetModelSelectForm = (props: AssetForAssetModelSelectOptions) => (
  <FormField label='Default asset' description='Which asset would you like to see in edit mode?'>
    <AssetForAssetModelSelect {...props} />
  </FormField>
);
