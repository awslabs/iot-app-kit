import { shouldImmediatelyCallRequest } from './shouldImmediatelyCallRequest';

import { MINUTE_IN_MS } from '../../common/time';
import { ALARM_STREAM_INFO, DATA_STREAM_INFO, STRING_INFO_1 } from '../../iotsitewise/__mocks__/mockWidgetProperties';

describe('whether a request for data should be made immediately', () => {
  describe('requests immediately when', () => {
    it('when previous viewport data stream info is undefined, even when view port is near present time', () => {
      expect(
        shouldImmediatelyCallRequest(undefined, [DATA_STREAM_INFO], {
          start: new Date(Date.now() - 5 * MINUTE_IN_MS),
          end: new Date(Date.now() - MINUTE_IN_MS),
        })
      ).toBeTrue();
    });

    it('viewport in the past has changed', () => {
      expect(
        shouldImmediatelyCallRequest([DATA_STREAM_INFO], [DATA_STREAM_INFO], {
          start: new Date(2001, 0, 0),
          end: new Date(2002, 0, 0),
        })
      ).toBeTrue();
    });

    it('has a data stream is added', () => {
      expect(
        shouldImmediatelyCallRequest([DATA_STREAM_INFO], [DATA_STREAM_INFO, STRING_INFO_1], {
          start: new Date(2000, 0, 0),
          end: new Date(2001, 0, 0),
        })
      ).toBeTrue();
    });

    it('has a data stream is replaced with a different data stream', () => {
      expect(
        shouldImmediatelyCallRequest([DATA_STREAM_INFO], [STRING_INFO_1], {
          start: new Date(2000, 0, 0),
          end: new Date(2001, 0, 0),
        })
      ).toBeTrue();
    });

    it('has no change in data stream infos and is in past', () => {
      expect(
        shouldImmediatelyCallRequest([DATA_STREAM_INFO], [DATA_STREAM_INFO], {
          start: new Date(2000, 0, 0),
          end: new Date(2001, 0, 0),
        })
      ).toBeTrue();
    });

    it('has duration in the viewport object and has a new data stream added', () => {
      expect(
        shouldImmediatelyCallRequest([DATA_STREAM_INFO], [DATA_STREAM_INFO, ALARM_STREAM_INFO], {
          duration: new Date().getTime(),
        })
      ).toBeTrue();
    });
  });

  describe('does not request immediately when', () => {
    it('has a data stream removed in present', () => {
      expect(
        shouldImmediatelyCallRequest([DATA_STREAM_INFO, STRING_INFO_1], [DATA_STREAM_INFO], {
          start: new Date(2000, 0, 0),
          end: new Date(),
        })
      ).toBeFalse();
    });

    it('has no data stream infos', () => {
      expect(
        shouldImmediatelyCallRequest([], [], {
          start: new Date(Date.now() - 5 * MINUTE_IN_MS),
          end: new Date(Date.now() - MINUTE_IN_MS),
        })
      ).toBeFalse();
    });

    it('has a viewport close to the present time', () => {
      expect(
        shouldImmediatelyCallRequest([DATA_STREAM_INFO], [DATA_STREAM_INFO], {
          start: new Date(Date.now() - 5 * MINUTE_IN_MS),
          end: new Date(Date.now() - MINUTE_IN_MS),
        })
      ).toBeFalse();
    });
  });
});
