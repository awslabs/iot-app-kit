import Box from '@cloudscape-design/components/box';

import Button from '@cloudscape-design/components/button';

export interface AssetModelSaveButtonProps {
  onSave: VoidFunction;
  disabled?: boolean;
}

export const AssetModelSaveButton = ({
  onSave,
  disabled,
}: AssetModelSaveButtonProps) => {
  return (
    <Box float='right'>
      <Button disabled={disabled} onClick={onSave}>
        Set asset model
      </Button>
    </Box>
  );
};
