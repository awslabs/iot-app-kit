import Box from '@cloudscape-design/components/box';

interface ModeledDataStreamTableEmptyStateProps {
  isAssetSelected: boolean;
}

export function ModeledDataStreamTableEmptyState({
  isAssetSelected,
}: ModeledDataStreamTableEmptyStateProps) {
  return (
    <Box textAlign='center' color='inherit'>
      <b>No modeled data streams</b>

      <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
        {isAssetSelected
          ? 'No modeled data streams found for selected asset.'
          : 'Select an asset to see its data streams.'}
      </Box>
    </Box>
  );
}
