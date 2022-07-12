import { COMPARISON_OPERATOR, DataType, Threshold } from '@synchro-charts/core';
import { audioAlertPlayer, AudioAlert } from './audioAlert';
import { initializeAudioAlerts, playThresholdAudioAlert } from './audioAlertManager';
import { liveDataTimeBuffer } from './constants';

const sev2Threshold: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
  value: 250,
  label: {
    text: '2',
    show: true,
  },
  showValue: true,
  color: 'green',
  id: 'green-y-threshold',
  severity: 2,
};

const sev1Threshold: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
  value: 350,
  label: {
    text: '1',
    show: true,
  },
  showValue: true,
  color: 'red',
  id: 'red-y-threshold',
  severity: 1,
};
const VIEWPORT = { start: new Date(2000), end: new Date(2001, 0, 0), yMin: 100, yMax: 500 };

const dataStream = {
  id: 'data-stream',
  name: 'some name',
  color: 'red',
  resolution: 0,
  data: [],
  dataType: DataType.NUMBER,
};

describe('initializeAudioAlerts', () => {
  it('returns empty map if not given any thresholds', () => {
    const audioAlerts = initializeAudioAlerts(undefined, []);
    expect(audioAlerts.size).toBe(0);
  });

  it('returns map with all provided thresholds', () => {
    const audioAlerts = initializeAudioAlerts(undefined, [sev1Threshold, sev2Threshold]);
    expect(audioAlerts.size).toBe(2);
    expect(audioAlerts.has(sev1Threshold.id ?? sev1Threshold)).toBeTrue();
    expect(audioAlerts.has(sev2Threshold.id ?? sev2Threshold)).toBeTrue();
  });

  it('initializes AudioAlert for newly added threshold and maintains prexisting ones', () => {
    let audioAlerts = new Map<Threshold | string, AudioAlert>();
    audioAlerts.set(sev1Threshold.id ?? sev1Threshold, new AudioAlert({ isMuted: true, severity: 1 }));
    expect(audioAlerts.has(sev1Threshold.id ?? sev1Threshold)).toBeTrue();
    audioAlerts = initializeAudioAlerts(audioAlerts, [sev1Threshold, sev2Threshold]);
    expect(audioAlerts.has(sev1Threshold.id ?? sev1Threshold)).toBeTrue();
    expect(audioAlerts.has(sev2Threshold.id ?? sev2Threshold)).toBeTrue();
    expect(audioAlerts.get(sev1Threshold.id ?? sev1Threshold)?.isMuted()).toBeTrue();
  });
});

describe('playThresholdAudioAlert', () => {
  it("doesn't play an audio alert if not in live mode", () => {
    playThresholdAudioAlert({
      dataStreams: [dataStream],
      viewport: { start: new Date(1998, 0, 0), end: new Date(1999, 0, 0) },
      annotations: { y: [sev1Threshold] },
      audioAlerts: undefined,
    });
    expect(audioAlertPlayer.isPlaying()).toBeFalse();
  });

  it('plays an audio alert if in Live mode and most recent point breaches a threshold', () => {
    playThresholdAudioAlert({
      dataStreams: [
        {
          ...dataStream,
          data: [{ x: Date.now(), y: 200 }],
        },
      ],
      viewport: { duration: '1m' },
      annotations: { y: [sev1Threshold] },
      audioAlerts: undefined,
    });
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });

  it('plays an audio alert if viewport is past current date and most recent point breaches a threshold', () => {
    playThresholdAudioAlert({
      dataStreams: [
        {
          ...dataStream,
          data: [{ x: Date.now(), y: 200 }],
        },
      ],
      viewport: {
        ...VIEWPORT,
        end: new Date(Date.now() + liveDataTimeBuffer * 2),
      },
      annotations: { y: [sev1Threshold] },
      audioAlerts: undefined,
    });
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });
});
