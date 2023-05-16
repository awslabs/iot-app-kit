import { useInfiniteQuery } from "@tanstack/react-query";

import { listDataStreams } from "../services/list-data-streams";
import { createTimeSeriesViewModel } from "../helpers/transforms";

const TIME_SERIES_QUERY_KEY = ["resources", "sitewise", "time series"];

function createTimeSeriesQueryKey(
  dataStreamType: "ALL" | "MODELED" | "UNMODELED"
) {
  return [...TIME_SERIES_QUERY_KEY, dataStreamType];
}

interface UseTimeSeriesProps {
  dataStreamType: "ALL" | "MODELED" | "UNMODELED";
  pageSize: number;
}

export function useTimeSeries(props: UseTimeSeriesProps) {
  return useInfiniteQuery({
    queryKey: createTimeSeriesQueryKey(props.dataStreamType),
    queryFn: async ({ pageParam }) => {
      const { timeSeries, nextToken } = await listDataStreams({
        dataStreamType: props.dataStreamType,
        pageSize: props.pageSize,
        nextToken: pageParam,
      });

      return {
        timeSeries: timeSeries.map(createTimeSeriesViewModel),
        nextToken,
      };
    },
    getNextPageParam: ({ nextToken }) => nextToken,
  });
}
