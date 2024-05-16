import CloudscapeHeader from '@cloudscape-design/components/header';
import React from 'react';

export interface ResourceTableTitleProps {
  selectedResourceCount: number;
  totalResourceCount: number;
  pluralResourceName: string;
  titleExtension?: React.ReactNode;
}

export function ResourceTableTitle({
  selectedResourceCount,
  totalResourceCount,
  pluralResourceName,
  titleExtension,
}: ResourceTableTitleProps) {
  return (
    <>
      <CloudscapeHeader
        variant='h3'
        counter={
          selectedResourceCount > 0
            ? `(${selectedResourceCount}/${totalResourceCount})`
            : `(${totalResourceCount})`
        }
      >
        {pluralResourceName}
      </CloudscapeHeader>

      {titleExtension}
    </>
  );
}
