import Pagination, { type PaginationProps } from '@cloudscape-design/components/pagination';
import React from 'react';

export type AssetModelPropertiesTablePaginationProps = PaginationProps;

export function AssetModelPropertiesTablePagination({ ...props }: AssetModelPropertiesTablePaginationProps) {
  return (
    <Pagination
      {...props}
      ariaLabels={{
        nextPageLabel: 'Next page asset model properties',
        paginationLabel: 'Asset model properties explorer pagination',
        previousPageLabel: 'Previous page asset model properties',
        pageLabel: (pageNumber) => `Page ${pageNumber} asset model properties`,
      }}
    />
  );
}
