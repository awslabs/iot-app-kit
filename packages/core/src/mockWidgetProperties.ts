import { DATA_TYPE } from './common/constants';
import type { DataStream } from './data-module/types';

export const DATA_STREAM: DataStream = {
  id: 'some-asset-id---some-property-id',
  resolution: 0,
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  dataType: DATA_TYPE.NUMBER,
  data: [],
};

export const ALARM = 'alarm';
