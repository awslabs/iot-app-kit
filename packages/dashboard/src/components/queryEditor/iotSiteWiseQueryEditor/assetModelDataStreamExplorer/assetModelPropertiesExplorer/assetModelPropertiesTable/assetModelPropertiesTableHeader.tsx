import Header from '@cloudscape-design/components/header';
import React from 'react';

interface AssetModelPropertiesTableHeaderProps {
  totalItemCount: number;
  selectedItemCount?: number;
}

export function AssetModelPropertiesTableHeader({
  totalItemCount,
  selectedItemCount,
}: AssetModelPropertiesTableHeaderProps) {
  return (
    <Header
      variant='h3'
      description='Select an asset model property to add a selected widget.'
      counter={selectedItemCount ? `(${selectedItemCount}/${totalItemCount})` : `(${totalItemCount})`}
    >
      Asset Model properties
    </Header>
  );
}
