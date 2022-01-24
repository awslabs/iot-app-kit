import { bindStylesToDataStreams } from './bindStylesToDataStreams';
import { DATA_STREAM, DATA_STREAM_2 } from '../../testing/mockWidgetProperties';

it('returns empty array when provided no data streams', () => {
  expect(
    bindStylesToDataStreams({
      dataStreams: [],
      styleSettings: { someStyle: { color: 'red' } },
    })
  ).toEqual([]);
});

it('returns data streams when no matching styles', () => {
  expect(
    bindStylesToDataStreams({
      dataStreams: [DATA_STREAM],
      styleSettings: { someStyle: { color: 'red' } },
    })
  ).toEqual([DATA_STREAM]);
});

it('associates styles to corresponding data stream', () => {
  expect(
    bindStylesToDataStreams({
      dataStreams: [{ ...DATA_STREAM, refId: 'someStyle' }],
      styleSettings: { someStyle: { color: 'red' } },
    })
  ).toEqual([{ ...DATA_STREAM, refId: 'someStyle', color: 'red' }]);
});

it('associates styles to corresponding data stream for multiple data streams', () => {
  expect(
    bindStylesToDataStreams({
      dataStreams: [
        { ...DATA_STREAM, refId: 'someStyle' },
        { ...DATA_STREAM_2, refId: 'someStyle2' },
      ],
      styleSettings: { someStyle: { color: 'red' }, someStyle2: { color: 'blue' } },
    })
  ).toEqual([
    { ...DATA_STREAM, refId: 'someStyle', color: 'red' },
    { ...DATA_STREAM_2, refId: 'someStyle2', color: 'blue' },
  ]);
});

it('returns data stream when no matching refId', () => {
  expect(
    bindStylesToDataStreams({
      dataStreams: [{ ...DATA_STREAM, refId: 'someStyle100' }],
      styleSettings: { someStyle: { color: 'red' } },
    })
  ).toEqual([{ ...DATA_STREAM, refId: 'someStyle100' }]);
});
