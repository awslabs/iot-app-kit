import { type DataPoint } from '@iot-app-kit/core';
import { type ConvertSymbolOptions, convertSymbol } from './convertSymbol';

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

const setup = (props?: Partial<ConvertSymbolOptions>) => {
  const mergedProps = {
    symbolStyle: 'triangle',
    showBadDataIcons: true,
    showUncertainDataIcons: true,
    ...props,
  };
  const callback = convertSymbol(mergedProps);
  if (callback === undefined || typeof callback === 'string') {
    throw new Error('echarts callback function type unexpected');
  }
  return callback;
};

describe('convertSymbol', () => {
  it('returns the symbol style by default', () => {
    const convertSymbol = setup({ symbolStyle: 'rectangle' });
    expect(convertSymbol(GOOD_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(
      'rectangle'
    );
  });

  it('returns the bad data path if the quality is BAD', () => {
    const convertSymbol = setup();
    expect(convertSymbol(BAD_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(
      'emptyCircle'
    );
  });

  it('returns the uncertain data path if the quality is UNCERTAIN', () => {
    const convertSymbol = setup();
    expect(convertSymbol(UNCERTAIN_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(
      'triangle'
    );
  });

  it('does not return the uncertain data path if show uncertain icons is false', () => {
    const convertSymbol = setup({
      showUncertainDataIcons: false,
      symbolStyle: 'rectangle',
    });
    expect(convertSymbol(UNCERTAIN_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(
      'rectangle'
    );
  });

  it('does not return the bad data path if show bad icons is false', () => {
    const convertSymbol = setup({
      showBadDataIcons: false,
      symbolStyle: 'rectangle',
    });
    expect(convertSymbol(BAD_POINT, DEFAULT_ECHARTS_PARAMS)).toEqual(
      'rectangle'
    );
  });
});
