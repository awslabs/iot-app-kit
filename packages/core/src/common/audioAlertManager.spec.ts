import { COMPARISON_OPERATOR, Threshold } from '@synchro-charts/core';
import { AudioAlert } from './audioAlert';
import { initializeAudioAlerts } from './audioAlertManager';
import { AudioAlertPlayer } from './audioAlertPlayer';

const sev_3: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
  value: 25,
  label: {
    text: '3',
    show: true,
  },
  showValue: true,
  color: 'blue',
  id: 'blue-y-threshold',
  severity: 3,
};

const sev_2: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
  value: 26,
  label: {
    text: '2',
    show: true,
  },
  showValue: true,
  color: 'green',
  id: 'green-y-threshold',
  severity: 2,
};

const sev_1: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
  value: 22,
  label: {
    text: '1',
    show: true,
  },
  showValue: true,
  color: 'red',
  id: 'red-y-threshold',
  severity: 1,
};

describe('initializeAudioAlerts', () => {
  const audioAlertPlayer = new AudioAlertPlayer();
  it('returns empty map', () => {
    const audioAlerts = initializeAudioAlerts(undefined, audioAlertPlayer, []);
    expect(audioAlerts.size).toBe(0);
  });

  it('returns map with all provided', () => {
    const audioAlerts = initializeAudioAlerts(undefined, audioAlertPlayer, [sev_1, sev_2, sev_3]);
    expect(audioAlerts.size).toBe(3);
    expect(audioAlerts.has(sev_1.id ?? sev_1)).toBeTrue();
    expect(audioAlerts.has(sev_2.id ?? sev_2)).toBeTrue();
    expect(audioAlerts.has(sev_3.id ?? sev_3)).toBeTrue();
  });

  it('initializes AudioAlert for newly added threshold and maintains prexisting ones', () => {
    let audioAlerts = new Map<Threshold | string, AudioAlert>();
    audioAlerts.set(
      sev_1.id ?? sev_1,
      new AudioAlert({ audioAlertPlayer: audioAlertPlayer, isMuted: true, severity: 1 })
    );
    expect(audioAlerts.has(sev_1.id ?? sev_1)).toBeTrue();
    audioAlerts = initializeAudioAlerts(audioAlerts, audioAlertPlayer, [sev_1, sev_2, sev_3]);
    expect(audioAlerts.has(sev_1.id ?? sev_1)).toBeTrue();
    expect(audioAlerts.has(sev_2.id ?? sev_2)).toBeTrue();
    expect(audioAlerts.has(sev_3.id ?? sev_3)).toBeTrue();
    expect(audioAlerts.get(sev_1.id ?? sev_1)?.isMuted()).toBeTrue();
  });
});
