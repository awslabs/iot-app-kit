import FormField from '@cloudscape-design/components/form-field';
import {
  AssetForAssetModelSelect,
  type AssetForAssetModelSelectProps,
} from './assetForAssetModelSelect';

export const AssetForAssetModelSelectForm = (
  props: AssetForAssetModelSelectProps
) => (
  <FormField
    label='Default asset'
    description='This asset is the default view in both Edit and Preview modes.'
  >
    <AssetForAssetModelSelect {...props} />
  </FormField>
);
