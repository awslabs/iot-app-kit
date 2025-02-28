import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../testing/alarms/mockStatuses';
import { combineStatusForQueries, getStatusForQuery } from './queryStatus';

describe('getStatusForQuery', () => {
  it('combines statuses', () => {
    expect(
      getStatusForQuery(mockLoadingStatus, mockLoadingStatus)
    ).toMatchObject(mockLoadingStatus);
    expect(
      getStatusForQuery(mockLoadingStatus, mockSuccessStatus)
    ).toMatchObject(mockLoadingStatus);
  });
});

describe('combineStatusForQueries', () => {
  it('combines statuses', () => {
    expect(
      combineStatusForQueries(
        [mockLoadingStatus, mockLoadingStatus],
        mockLoadingStatus
      )
    ).toMatchObject(mockLoadingStatus);
    expect(
      combineStatusForQueries(
        [mockLoadingStatus, mockLoadingStatus],
        mockSuccessStatus
      )
    ).toMatchObject(mockLoadingStatus);
  });

  it('combines statuses', () => {
    expect(
      combineStatusForQueries(
        [mockLoadingStatus, mockLoadingStatus],
        mockLoadingStatus
      )
    ).toMatchObject(mockLoadingStatus);
    expect(
      combineStatusForQueries(
        [mockLoadingStatus, mockLoadingStatus],
        mockSuccessStatus
      )
    ).toMatchObject(mockLoadingStatus);
  });
});
