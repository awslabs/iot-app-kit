import React from 'react';

import Box from '@cloudscape-design/components/box';

import CustomOrangeButton from '~/components/customOrangeButton';

type AssetModelSaveOptions = {
  onSave: () => void;
};

export const AssetModelSave = ({ onSave }: AssetModelSaveOptions) => {
  return (
    <Box float='right'>
      <CustomOrangeButton title='Save' handleClick={onSave} />
    </Box>
  );
};
