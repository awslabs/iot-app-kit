import { isInputPropertyRequest } from './isInputPropertyRequest';

describe('isInputPropertyRequest', () => {
  it('is false if there is no inputPropertyId in the request', () => {
    expect(
      isInputPropertyRequest({
        request: {
          assetId: 'asset-1',
        },
        alarmDatas: [],
      })
    ).toBeFalse();
  });

  it('is true if there is an inputPropertyId in the request', () => {
    expect(
      isInputPropertyRequest({
        request: {
          assetId: 'asset-1',
          inputPropertyId: 'inputPropertyId',
        },
        alarmDatas: [],
      })
    ).toBeTrue();
  });
});
