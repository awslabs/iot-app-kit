export const mockLiveURL = 'mockLiveURL';
export const mockOnDemandURL = 'mockOnDemandURL';
export const mockGetAvailableTimeRangeResponse = [
  [
    { start: 1630005300000, end: 1630005400000, src: 'mockOnDemandURL-1' },
    { start: 1630005400000, end: 1630005500000, src: 'mockOnDemandURL-2' },
    { start: 1630005800000, end: 1630005850000, src: 'mockOnDemandURL-3' },
  ],
  [
    { start: 1630005400000, end: 1630005600000 },
    { start: 1630005800000, end: 1630005900000 },
  ],
];

export const mockVideoData = {
  getKvsStreamSrc: jest.fn().mockResolvedValue('kvsStreamSrc'),
  getAvailableTimeRanges: jest.fn(),
  triggerLiveVideoUpload: jest.fn(),
  triggerOnDemandVideoUploadRequest: jest.fn(),
};
