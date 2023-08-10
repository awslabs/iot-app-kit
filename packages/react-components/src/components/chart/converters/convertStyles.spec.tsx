import React from 'react';
import { renderHook } from '@testing-library/react';
import { getChartStyleSettingsFromMap, useChartStyleSettings } from './convertStyles';
import { colorPalette } from '@iot-app-kit/core-util';
import { ChartOptions } from '../types';

const DATA_STREAM = { id: 'abc-1', data: [], resolution: 0, name: 'my-name' };
const DATA_STREAM_WITH_REF = { id: 'abc-2', refId: 'custom', data: [], resolution: 0, name: 'my-name' };

it('can get the correct style settings from the style settings map', () => {
  const { result } = renderHook(() => useChartStyleSettings([DATA_STREAM, DATA_STREAM_WITH_REF], {}), {
    wrapper: ({ children }) => <div>{children}</div>,
  });
  const [map] = result.current;
  expect(getChartStyleSettingsFromMap(map)(DATA_STREAM)).toEqual(map[DATA_STREAM.id]);
});

it('converts default styles for all datastreams', () => {
  const chartStyleSettings = {
    // none
  };
  const { result } = renderHook(() => useChartStyleSettings([DATA_STREAM], chartStyleSettings), {
    wrapper: ({ children }) => <div>{children}</div>,
  });

  const [styles, getStyles] = result.current;
  expect(styles).toHaveProperty(DATA_STREAM.id);

  const mappedStyles = getStyles(DATA_STREAM);
  expect(mappedStyles).toHaveProperty('visualizationType', 'line');
  expect(mappedStyles).toHaveProperty('color', colorPalette[0]);
});

it('converts styles with custom options for all datastreams', () => {
  const chartStyleSettings: Pick<ChartOptions, 'defaultVisualizationType' | 'styleSettings'> = {
    defaultVisualizationType: 'scatter',
    styleSettings: {
      custom: {
        color: '#4a238b',
      },
    },
  };
  const { result } = renderHook(() => useChartStyleSettings([DATA_STREAM_WITH_REF], chartStyleSettings), {
    wrapper: ({ children }) => <div>{children}</div>,
  });

  const [styles, getStyles] = result.current;
  expect(styles).toHaveProperty(DATA_STREAM_WITH_REF.id);

  const mappedStyles = getStyles(DATA_STREAM_WITH_REF);
  expect(mappedStyles).toHaveProperty('visualizationType', 'scatter');
  expect(mappedStyles).toHaveProperty('color', '#4a238b');
});
