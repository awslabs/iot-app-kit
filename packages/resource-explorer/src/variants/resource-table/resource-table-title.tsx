import CloudscapeHeader from '@cloudscape-design/components/header';
import CloudscapeSpinner from '@cloudscape-design/components/spinner';
import React from 'react';

export interface ResourceTableTitleProps {
  selectedResourceCount: number;
  totalResourceCount: number;
  pluralResourceName: string;
  titleExtension?: React.ReactNode;
  description?: string;
  isLoadingResources?: boolean;
}

export function ResourceTableTitle({
  selectedResourceCount,
  totalResourceCount,
  pluralResourceName,
  titleExtension,
  description,
  isLoadingResources,
}: ResourceTableTitleProps) {
  return (
    <>
      <CloudscapeHeader
        actions={isLoadingResources && <CloudscapeSpinner size='normal' />}
        variant='h3'
        counter={
          selectedResourceCount > 0
            ? `(${selectedResourceCount}/${totalResourceCount})`
            : `(${totalResourceCount})`
        }
        description={description}
      >
        {pluralResourceName}
      </CloudscapeHeader>

      {titleExtension}
    </>
  );
}
