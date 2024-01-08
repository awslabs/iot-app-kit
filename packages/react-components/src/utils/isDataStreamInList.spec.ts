import { DATA_STREAM, DATA_STREAM_2 } from '../testing/mockWidgetProperties';
import { isDataStreamInList } from './isDataStreamInList';

it('returns true if the data stream is in the list', () => {
  expect(
    isDataStreamInList([DATA_STREAM, DATA_STREAM_2])(DATA_STREAM)
  ).toBeTrue();
});

it('returns false if the data stream is not in the list', () => {
  expect(isDataStreamInList([DATA_STREAM])(DATA_STREAM_2)).toBeFalse();
});
