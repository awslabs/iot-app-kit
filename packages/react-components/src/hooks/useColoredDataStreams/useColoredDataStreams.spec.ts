import { renderHook } from '@testing-library/react';
import { useColoredDataStreams } from './useColoredDataStreams';
import { DataStream } from '@iot-app-kit/core';
import { Colorizer } from '@iot-app-kit/core-util';

const PALETTE = [
  'red',
  'white',
  'blue',
  'cyan',
  'mauve',
  'orange',
  'lime',
  'pink',
  'gold',
];

it('Applies a default color to each stream', () => {
  const DATA_STREAM_1: DataStream = {
    id: 'abc-1',
    data: [],
    resolution: 0,
    name: 'my-name',
  };
  const DATA_STREAM_2: DataStream = {
    id: 'abc-2',
    data: [],
    resolution: 0,
    name: 'my-name',
  };
  const DATA_STREAM_3: DataStream = {
    id: 'abc-3',
    data: [],
    resolution: 0,
    name: 'my-name',
  };
  const colorer = Colorizer(PALETTE);
  const {
    result: { current: dataStreams },
  } = renderHook(() =>
    useColoredDataStreams({
      colorer,
      dataStreams: [DATA_STREAM_1, DATA_STREAM_2, DATA_STREAM_3],
    })
  );

  const stream1Color = dataStreams.at(0)?.color;
  const stream2Color = dataStreams.at(1)?.color;
  const stream3Color = dataStreams.at(2)?.color;

  expect(stream1Color).toEqual('red');
  expect(stream2Color).toEqual('white');
  expect(stream3Color).toEqual('blue');
});

it('preserves the same default colors between renders', () => {
  const DATA_STREAM_1: DataStream = {
    id: 'abc-1',
    data: [],
    resolution: 0,
    name: 'my-name',
  };
  const DATA_STREAM_2: DataStream = {
    id: 'abc-2',
    data: [],
    resolution: 0,
    name: 'my-name',
  };
  const DATA_STREAM_3: DataStream = {
    id: 'abc-3',
    data: [],
    resolution: 0,
    name: 'my-name',
  };
  const DATA_STREAM_4: DataStream = {
    id: 'abc-4',
    data: [],
    resolution: 0,
    name: 'my-name',
  };
  const colorer = Colorizer(PALETTE);
  const { result, rerender } = renderHook(
    (dataStreams) =>
      useColoredDataStreams({
        colorer,
        dataStreams,
      }),
    {
      initialProps: [DATA_STREAM_1, DATA_STREAM_2],
    }
  );

  const stream1Color = result.current.at(0)?.color;
  const stream2Color = result.current.at(1)?.color;

  expect(stream1Color).toEqual('red');
  expect(stream2Color).toEqual('white');

  rerender([DATA_STREAM_1, DATA_STREAM_2, DATA_STREAM_3, DATA_STREAM_4]);

  const updatedStream1Color = result.current.at(0)?.color;
  const updatedStream2Color = result.current.at(1)?.color;
  const stream3Color = result.current.at(2)?.color;
  const stream4Color = result.current.at(3)?.color;

  expect(updatedStream1Color).toEqual('red');
  expect(updatedStream2Color).toEqual('white');
  expect(stream3Color).toEqual('blue');
  expect(stream4Color).toEqual('cyan');
});
