import FormField from '@cloudscape-design/components/form-field';
import {
  AssetForAssetModelSelect,
  type AssetForAssetModelSelectOptions,
} from './assetForAssetModelSelect';

export const AssetForAssetModelSelectForm = (
  props: AssetForAssetModelSelectOptions
) => (
  <FormField
    label='Default asset'
    description='This asset is the default view in both Edit and Preview modes.'
  >
    <AssetForAssetModelSelect {...props} />
  </FormField>
);
