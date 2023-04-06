import { cleanup, renderHook } from '@testing-library/react-hooks';

const matterTagSubscribe = jest.fn();
const tagSubscribe = jest.fn();

const matterportSdk = {
  Mattertag: {
    data: {
      subscribe: matterTagSubscribe,
    },
  },
  Tag: {
    data: {
      subscribe: tagSubscribe,
    },
  },
};

const getMatterportSdkMock = jest.fn();
jest.mock('../common/GlobalSettings', () => {
  return {
    getMatterportSdk: getMatterportSdkMock,
  };
});
getMatterportSdkMock.mockImplementation(() => {
  return matterportSdk;
});

import useMatterportObserver from './useMatterportObserver';

describe('useMatterportTags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should subscribe to mattertag and tag', () => {
    renderHook(() => useMatterportObserver()).result.current;

    expect(matterTagSubscribe).toBeCalled();
    expect(tagSubscribe).toBeCalled();

    cleanup();
  });
});
