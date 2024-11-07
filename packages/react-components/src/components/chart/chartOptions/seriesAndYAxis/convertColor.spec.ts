import {
  BAD_DATA_ICON_COLOR,
  UNCERTAIN_DATA_ICON_COLOR,
} from '../../eChartsConstants';
import { convertColor, type ConvertColorOptions } from './convertColor';

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

const GOOD_POINT = {
  ...DEFAULT_ECHARTS_PARAMS,
  data: {
    x: 1,
    y: 1,
    quality: 'GOOD',
  },
};

const BAD_POINT = {
  ...DEFAULT_ECHARTS_PARAMS,
  data: {
    x: 1,
    y: 1,
    quality: 'BAD',
  },
};

const UNCERTAIN_POINT = {
  ...DEFAULT_ECHARTS_PARAMS,
  data: {
    x: 1,
    y: 1,
    quality: 'UNCERTAIN',
  },
};

const setup = (props?: Partial<ConvertColorOptions>) => {
  const mergedProps = {
    color: 'pink',
    showBadDataIcons: true,
    showUncertainDataIcons: true,
    ...props,
  };
  const callback = convertColor(mergedProps)?.color;
  if (callback === undefined || typeof callback !== 'function') {
    throw new Error('echarts callback function type unexpected');
  }
  return callback;
};

describe('convertColor', () => {
  it('returns the symbol color by default', () => {
    const convertColor = setup({ color: 'blue' });
    expect(convertColor(GOOD_POINT)).toEqual('blue');
  });

  it('returns the bad data symbol color if the point is bad data', () => {
    const convertColor = setup();
    expect(convertColor(BAD_POINT)).toEqual(BAD_DATA_ICON_COLOR);
  });

  it('returns the uncertain data symbol color if the point is bad data', () => {
    const convertColor = setup();
    expect(convertColor(UNCERTAIN_POINT)).toEqual(UNCERTAIN_DATA_ICON_COLOR);
  });

  it('returns the symbol color if the point is bad data but show bad data is false', () => {
    const convertColor = setup({ showBadDataIcons: false, color: 'blue' });
    expect(convertColor(BAD_POINT)).toEqual('blue');
  });

  it('returns the symbol color if the point is uncertain data but show uncertain data is false', () => {
    const convertColor = setup({
      showUncertainDataIcons: false,
      color: 'blue',
    });
    expect(convertColor(UNCERTAIN_POINT)).toEqual('blue');
  });
});
