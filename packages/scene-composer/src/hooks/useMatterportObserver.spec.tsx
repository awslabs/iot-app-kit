import { cleanup, renderHook } from '@testing-library/react';
import useMatterportObserver from './useMatterportObserver';
import * as globalSettings from '../common/GlobalSettings';

const matterTagSubscribe = vi.fn();
const tagSubscribe = vi.fn();

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

beforeEach(() => {
  vi.clearAllMocks();
});

it('should subscribe to mattertag and tag', () => {
  vi.spyOn(globalSettings, 'getMatterportSdk').mockImplementation(() => {
    return matterportSdk;
  });

  renderHook(() => useMatterportObserver()).result.current;

  expect(matterTagSubscribe).toBeCalled();
  expect(tagSubscribe).toBeCalled();

  cleanup();
});
