import Pagination, {
  type PaginationProps,
} from '@cloudscape-design/components/pagination';
import React from 'react';

type ModeledDataStreamTablePaginationProps = PaginationProps;

export function ModeledDataStreamTablePagination({
  ...props
}: ModeledDataStreamTablePaginationProps) {
  return <Pagination {...props} />;
}
