import Pagination, {
  type PaginationProps,
} from "@cloudscape-design/components/pagination";
import React from "react";

interface ExplorerPaginationProps
  extends Pick<
    PaginationProps,
    "onChange" | "currentPageIndex" | "pagesCount"
  > {
    fetchNextPage?: () => void;
  }

export function ExplorerPagination(props: ExplorerPaginationProps) {
  return (
    <Pagination
      {...props}
      openEnd
      onNextPageClick={() => {
        const isAtLastPage = props.currentPageIndex === props.pagesCount;

        if (isAtLastPage && props.fetchNextPage) {
          props.fetchNextPage();
        }
      }}
    />
  );
}
