import { render } from '@testing-library/react';
import React from 'react';
let disposed = false;

jest.doMock('video.js', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    dispose: jest.fn().mockImplementation(() => (disposed = true)),
    reset: jest.fn(),
    isDisposed: jest.fn().mockReturnValue(disposed),
    pause: jest.fn(),
    createModal: jest.fn(),
    src: jest.fn(),
  }),
}));

import { VideoPlayer } from '.';
import {
  mockGetAvailableTimeRangeResponse,
  mockLiveURL,
  mockOnDemandURL,
  mockVideoData,
} from './__mocks__/MockVideoPlayerProps';
import flushPromises from 'flush-promises';
import { PLAYBACKMODE_LIVE, PLAYBACKMODE_ON_DEMAND } from './constants';

beforeEach(() => {
  jest.clearAllMocks();

  disposed = false;
});

it('sets video player for LIVE playback mode', async () => {
  const getKvsStreamSrcFn = jest.spyOn(mockVideoData, 'getKvsStreamSrc').mockResolvedValue(mockLiveURL);
  const triggerLiveVideoUploadFn = jest.spyOn(mockVideoData, 'triggerLiveVideoUpload').mockResolvedValue(true);
  render(<VideoPlayer viewport={{ duration: '0' }} videoData={mockVideoData} />);
  await flushPromises();
  expect(triggerLiveVideoUploadFn).toBeCalledTimes(1);
  expect(getKvsStreamSrcFn).toBeCalledWith(PLAYBACKMODE_LIVE);
});

it('throws exception when setting video player for LIVE playback mode', async () => {
  const getKvsStreamSrcFn = jest.spyOn(mockVideoData, 'getKvsStreamSrc').mockRejectedValue(new Error());
  const triggerLiveVideoUploadFn = jest.spyOn(mockVideoData, 'triggerLiveVideoUpload');
  render(<VideoPlayer viewport={{ duration: '0' }} videoData={mockVideoData} />);

  await flushPromises();
  expect(triggerLiveVideoUploadFn).toBeCalledTimes(0);
  expect(getKvsStreamSrcFn).toBeCalledWith(PLAYBACKMODE_LIVE);
});

it('sets video player for ON_DEMAND playback mode', async () => {
  const getKvsStreamSrcFn = jest.spyOn(mockVideoData, 'getKvsStreamSrc').mockResolvedValue(mockOnDemandURL);
  const getAvailableTimeRangesFn = jest
    .spyOn(mockVideoData, 'getAvailableTimeRanges')
    .mockResolvedValue(mockGetAvailableTimeRangeResponse);
  const startTime = new Date();
  const endTime = new Date();
  render(<VideoPlayer viewport={{ start: startTime, end: endTime }} videoData={mockVideoData} />);

  await flushPromises();
  expect(getAvailableTimeRangesFn).toBeCalledTimes(1);
  expect(getKvsStreamSrcFn).toBeCalledWith(PLAYBACKMODE_ON_DEMAND, startTime, endTime);
});

it('sets video player for ON_DEMAND playback mode with KVS component type (No available time ranges)', async () => {
  const getKvsStreamSrcFn = jest.spyOn(mockVideoData, 'getKvsStreamSrc').mockResolvedValue(mockOnDemandURL);
  const getAvailableTimeRangesFn = jest.spyOn(mockVideoData, 'getAvailableTimeRanges').mockRejectedValue(undefined);
  const startTime = new Date();
  const endTime = new Date();
  render(<VideoPlayer viewport={{ start: startTime, end: endTime }} videoData={mockVideoData} />);

  await flushPromises();
  expect(getAvailableTimeRangesFn).toBeCalledTimes(1);
  expect(getKvsStreamSrcFn).toBeCalledWith(PLAYBACKMODE_ON_DEMAND, startTime, endTime);
});

it('should not update session URL when fields are the same for on demand mode', async () => {
  const getKvsStreamSrcFn = jest.spyOn(mockVideoData, 'getKvsStreamSrc').mockResolvedValue(mockOnDemandURL);
  const startTime = new Date();
  const endTime = new Date();
  const { rerender } = render(<VideoPlayer viewport={{ start: startTime, end: endTime }} videoData={mockVideoData} />);

  rerender(<VideoPlayer viewport={{ start: startTime, end: endTime }} videoData={mockVideoData} />);

  await flushPromises();
  expect(getKvsStreamSrcFn).toBeCalledTimes(1);
  expect(getKvsStreamSrcFn).toBeCalledWith(PLAYBACKMODE_ON_DEMAND, startTime, endTime);
});

it('should not update session URL when fields are the same for live mode', async () => {
  const getKvsStreamSrcFn = jest.spyOn(mockVideoData, 'getKvsStreamSrc').mockResolvedValue(mockLiveURL);
  const { rerender } = render(<VideoPlayer viewport={{ duration: '0' }} videoData={mockVideoData} />);

  rerender(<VideoPlayer viewport={{ duration: '0' }} videoData={mockVideoData} />);

  await flushPromises();
  expect(getKvsStreamSrcFn).toBeCalledTimes(1);
  expect(getKvsStreamSrcFn).toBeCalledWith(PLAYBACKMODE_LIVE);
});

it('should update session URL when playback mode changes', async () => {
  const getKvsStreamSrcFn = jest.spyOn(mockVideoData, 'getKvsStreamSrc').mockResolvedValue(mockLiveURL);
  const getAvailableTimeRangesFn = jest
    .spyOn(mockVideoData, 'getAvailableTimeRanges')
    .mockResolvedValue(mockGetAvailableTimeRangeResponse);
  const triggerLiveVideoUploadFn = jest.spyOn(mockVideoData, 'triggerLiveVideoUpload').mockResolvedValue(true);
  const startTime = new Date();
  const endTime = new Date();
  const { rerender } = render(<VideoPlayer viewport={{ start: startTime, end: endTime }} videoData={mockVideoData} />);

  rerender(<VideoPlayer viewport={{ duration: '0' }} videoData={mockVideoData} />);

  await flushPromises();
  expect(getKvsStreamSrcFn).toBeCalledTimes(2);
  expect(getAvailableTimeRangesFn).toBeCalledTimes(1);
  expect(triggerLiveVideoUploadFn).toBeCalledTimes(1);
  expect(getKvsStreamSrcFn).toBeCalledWith(PLAYBACKMODE_ON_DEMAND, startTime, endTime);
  expect(getKvsStreamSrcFn).toBeCalledWith(PLAYBACKMODE_LIVE);
});
