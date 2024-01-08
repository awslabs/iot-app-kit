import Header from '@cloudscape-design/components/header';
import React from 'react';

interface AssetTableHeaderProps {
  totalItemCount: number;
  selectedItemCount?: number;
}

export function AssetTableHeader({
  totalItemCount,
  selectedItemCount,
}: AssetTableHeaderProps) {
  return (
    <Header
      variant='h3'
      description='Browse through your asset hierarchy and select an asset to view its associated data streams.'
      counter={
        selectedItemCount
          ? `(${selectedItemCount}/${totalItemCount})`
          : `(${totalItemCount})`
      }
    >
      Browse assets
    </Header>
  );
}
