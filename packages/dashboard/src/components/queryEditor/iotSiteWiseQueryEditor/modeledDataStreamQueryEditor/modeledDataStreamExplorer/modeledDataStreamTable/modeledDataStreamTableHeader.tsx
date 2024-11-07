import Header from '@cloudscape-design/components/header';

interface ModeledDataStreamTableHeaderProps {
  totalItemCount: number;
  selectedItemCount?: number;
}

export function ModeledDataStreamTableHeader({
  totalItemCount,
  selectedItemCount,
}: ModeledDataStreamTableHeaderProps) {
  return (
    <Header
      variant='h3'
      description='Select a modeled data stream to add a selected widget.'
      counter={
        selectedItemCount
          ? `(${selectedItemCount}/${totalItemCount})`
          : `(${totalItemCount})`
      }
    >
      Modeled data streams
    </Header>
  );
}
