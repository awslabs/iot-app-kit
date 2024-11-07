import Box from '@cloudscape-design/components/box';

export function AssetTableEmptyState() {
  return (
    <Box textAlign='center' color='inherit'>
      <b>No assets.</b>

      <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
        No assets to display.
      </Box>
    </Box>
  );
}
