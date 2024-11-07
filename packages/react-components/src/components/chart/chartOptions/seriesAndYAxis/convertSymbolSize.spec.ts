import { type DataPoint } from '@iot-app-kit/core';
import {
  BAD_DATA_ICON_SIZE,
  UNCERTAIN_DATA_ICON_SIZE,
} from '../../eChartsConstants';
import {
  type ConvertSymbolSizeOptions,
  convertSymbolSize,
} from './convertSymbolSize';
import { type Emphasis } from '../../utils/getStyles';

const DEFAULT_ECHARTS_PARAMS = {
  componentType: '',
  componentSubType: '',
  componentIndex: 0,
  name: '',
  dataIndex: 0,
  data: '',
  value: '',
  $vars: [],
};

const GOOD_POINT: DataPoint = {
  x: 1,
  y: 1,
  quality: 'GOOD',
};

const BAD_POINT: DataPoint = {
  x: 1,
  y: 1,
  quality: 'BAD',
};

const UNCERTAIN_POINT: DataPoint = {
  x: 1,
  y: 1,
  quality: 'UNCERTAIN',
};

const setup = (props?: Partial<ConvertSymbolSizeOptions>) => {
  const mergedProps = {
    symbolSize: 4,
    emphasis: 'none' as Emphasis,
    showBadDataIcons: true,
    showUncertainDataIcons: true,
    ...props,
  };
  const callback = convertSymbolSize(mergedProps);
  if (
    callback === undefined ||
    typeof callback === 'number' ||
    Array.isArray(callback)
  ) {
    throw new Error('echarts callback function type unexpected');
  }
  return callback;
};

describe('convertSymbolSize', () => {
  it('returns the symbol size by default', () => {
    const convertSymbolSize = setup({ symbolSize: 4 });
    expect(convertSymbolSize(GOOD_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(4);
  });

  it('returns the bad data icon size if the quality is BAD', () => {
    const convertSymbolSize = setup();
    expect(convertSymbolSize(BAD_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(
      BAD_DATA_ICON_SIZE
    );
  });

  it('returns the uncertain data icon size if the quality is UNCERTAIN', () => {
    const convertSymbolSize = setup();
    expect(convertSymbolSize(UNCERTAIN_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(
      UNCERTAIN_DATA_ICON_SIZE
    );
  });

  it('scales the symbol size if in emphasis mode', () => {
    const convertSymbolSize = setup({ emphasis: 'emphasize', symbolSize: 4 });
    expect(convertSymbolSize(GOOD_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(6);
  });

  it('scales the bad data icon symbol size if in emphasis mode', () => {
    const convertSymbolSize = setup({ emphasis: 'emphasize' });
    expect(convertSymbolSize(BAD_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(22);
  });

  it('scales the uncertain data icon symbol size if in emphasis mode', () => {
    const convertSymbolSize = setup({ emphasis: 'emphasize' });
    expect(convertSymbolSize(UNCERTAIN_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(
      22
    );
  });

  it('does not return the bad data icon size if show bad data is false', () => {
    const convertSymbolSize = setup({ showBadDataIcons: false });
    expect(convertSymbolSize(BAD_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(4);
  });

  it('does not return the uncertain data icon size if show bad data is false', () => {
    const convertSymbolSize = setup({ showUncertainDataIcons: false });
    expect(convertSymbolSize(UNCERTAIN_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(
      4
    );
  });
});
