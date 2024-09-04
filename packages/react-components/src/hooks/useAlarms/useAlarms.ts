import { useDescribeAssets } from '../../queries/useDescribeAssets/useDescribeAssets';
import { AlarmData, UseAlarmsHookProps } from './types';

type UseAlarmsHook<T> = (
  options: UseAlarmsHookProps<T>
) => T[];

export const useAlarms = <T>({
  iotSiteWiseClient,
  // iotEventsClient,
  requests,
  // viewport,
  // settings,
  transform = (alarmData: AlarmData) => alarmData,
}: UseAlarmsHookProps<T>): T[] => {
  const assetsQuery = useDescribeAssets({
    client: iotSiteWiseClient,
    assetIds: requests?.map(request => request.assetId)
  });

  // const assetModelQuery = useDescribeAssetsModel();

  // const properties = selectFrom([assetQuery, assetModelQuery])

  // const state = useTimeSeriesDatas(properties);
  // const alarmModels = useDescribeAlarmModel();

  // const transformFn = useCallback(transform, [tranform])

  // const model = toModel()

  const queriesList = [assetsQuery];

  const isLoading = queriesList.some(queries => queries.some(({ isLoading }) => isLoading));
  const isRefetching = queriesList.some(queries => queries.some(({ isRefetching }) => isRefetching));
  const isSuccess = queriesList.some(queries => queries.some(({ isSuccess }) => isSuccess));
  const isError = queriesList.some(queries => queries.some(({ isError }) => isError));
  
  const alarmDataList: AlarmData[] = requests?.map((_, index) => ({
    assetId: assetsQuery[index].data?.assetId,
    state: {
      property: {
        id: '',
        name: '',
        dataType: undefined,
      }
    },
    type: {
      property: {
        id: '',
        name: '',
        dataType: undefined,
      }
    },
    status: {
      isLoading,
      isRefetching,
      isSuccess,
      isError
    }
  })) || [];

  return alarmDataList.map(transform);
};

type a = {
  random: string;
};

const b = useAlarms<a>({});
const c = b[0].random;