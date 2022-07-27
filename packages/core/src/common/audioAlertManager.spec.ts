import { isLiveData, playThresholdAudioAlert, audioAlertPlayer } from './audioAlertManager';
import { liveDataTimeBufferMs } from './constants';
import { THRESHOLD_1, THRESHOLD_2, DATA_STREAM } from '../mockWidgetProperties';

describe('isLiveData', () => {
  it('returns true if viewport has duration', () => {
    const viewport = { duration: '5m' };
    expect(isLiveData(viewport)).toBeTrue();
  });

  it('returns true if viewport end is past current date and time', () => {
    const viewport = { start: new Date(2000, 1, 1), end: new Date(Date.now() + liveDataTimeBufferMs * 2) };
    expect(isLiveData(viewport)).toBeTrue();
  });

  it('returns false if viewport end is not past current date and time', () => {
    const viewport = { start: new Date(2000, 1, 1), end: new Date(Date.now() - liveDataTimeBufferMs * 2) };
    expect(isLiveData(viewport)).toBeFalse();
  });
});

describe('playThresholdAudioAlert', () => {
  beforeEach(() => {
    audioAlertPlayer.stop();
  });

  it('plays an audio alert if in Live mode and most recent point breaches a threshold', () => {
    playThresholdAudioAlert({
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [{ x: Date.now(), y: 20 }],
        },
      ],
      viewport: { duration: '1m' },
      annotations: { y: [THRESHOLD_1] },
    });
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });

  it('plays an audio alert if viewport end is past current date and most recent point in viewport breaches a threshold', () => {
    playThresholdAudioAlert({
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [{ x: Date.now(), y: 20 }],
        },
      ],
      viewport: {
        start: new Date(2000),
        end: new Date(Date.now() + liveDataTimeBufferMs * 2),
      },
      annotations: { y: [THRESHOLD_1] },
    });
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });

  it("doesn't play an audio alert if the breached threshold doesn't have an Audio Alert", () => {
    playThresholdAudioAlert({
      dataStreams: [DATA_STREAM],
      viewport: { duration: '1d' },
      annotations: { y: [THRESHOLD_2] },
    });
    expect(audioAlertPlayer.isPlaying()).toBeFalse();
  });

  it("doesn't play an audio alert if not in live mode", () => {
    playThresholdAudioAlert({
      dataStreams: [DATA_STREAM],
      viewport: { start: new Date(1998, 0, 0), end: new Date(1999, 0, 0) },
      annotations: { y: [THRESHOLD_1] },
    });
    expect(audioAlertPlayer.isPlaying()).toBeFalse();
  });

  it("doesn't play an audio alert if no annotations are given", () => {
    playThresholdAudioAlert({
      dataStreams: [DATA_STREAM],
      viewport: { duration: '5m' },
      annotations: undefined,
    });
    expect(audioAlertPlayer.isPlaying()).toBeFalse();
  });
});
