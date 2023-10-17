import React from 'react';

import Box from '@cloudscape-design/components/box';
import CustomOrangeButton from '~/components/customOrangeButton';

type AssetModelDataStreamSaveOptions = {
  onSave: () => void;
  disabled?: boolean;
};

export const AssetModelDataStreamSave = ({ onSave, disabled }: AssetModelDataStreamSaveOptions) => {
  return (
    <Box padding='s' float='right'>
      <CustomOrangeButton title='Add' onClick={onSave} disabled={disabled} />
    </Box>
  );
};
