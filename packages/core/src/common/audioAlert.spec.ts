import { audioAlertPlayer, AudioAlert } from './audioAlert';
import { mostSevere, leastSevere } from './constants';

describe('initializes', () => {
  it('properly initializes with the given attributes', () => {
    const audioAlert = new AudioAlert({
      isMuted: true,
      volume: 0.6,
      severity: 1,
      audioSrc: 'test string',
    });
    expect(audioAlert.isMuted()).toBeTrue();
    expect(audioAlert.volume).toBe(0.6);
    expect(audioAlert.severity).toBe(1);
    expect(audioAlert.audioSrc).toBe('test string');
  });
});

describe('play', () => {
  beforeEach(() => {
    audioAlertPlayer.stop();
  });

  it('player plays when called on by audio alerts', () => {
    const audioAlert = new AudioAlert({});
    expect(audioAlert.play()).toBeTrue();
  });

  it("player doesn't plays when called on by a muted audio alerts", () => {
    const audioAlert = new AudioAlert({
      isMuted: true,
    });
    expect(audioAlert.isMuted()).toBeTrue();
    expect(audioAlert.play()).toBeFalse();
  });
});

describe('mute and unmute', () => {
  beforeEach(() => {
    audioAlertPlayer.stop();
  });

  it("mutes audio alert and doesn't tell audio alert player to play", () => {
    const audioAlert = new AudioAlert({});
    audioAlert.play();
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
    audioAlert.mute();
    expect(audioAlert.isMuted()).toBeTrue();
    expect(audioAlertPlayer.isPlaying()).toBeFalse();
  });

  it('unmutes audio alert and audio alert player plays', () => {
    const audioAlert = new AudioAlert({
      isMuted: true,
    });
    audioAlert.unmute();
    expect(audioAlert.isMuted()).toBeFalse();
    audioAlert.play();
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });
});

describe('setVolume', () => {
  let audioAlert: AudioAlert;

  beforeEach(() => {
    audioAlert = new AudioAlert({});
  });

  it('sets volume', () => {
    audioAlert.setVolume(0.2);
    expect(audioAlert.volume).toBe(0.2);
  });

  it('enforces maximum volume of 1.0', () => {
    audioAlert.setVolume(1.5);
    expect(audioAlert.volume).toBe(1.0);
  });

  it('enforces minimum volume of 0.0', () => {
    audioAlert.setVolume(-1.5);
    expect(audioAlert.volume).toBe(0.0);
  });
});

describe('setSeverity', () => {
  let audioAlert: AudioAlert;

  beforeEach(() => {
    audioAlert = new AudioAlert({});
  });

  it('sets severity', () => {
    audioAlert.setSeverity(mostSevere);
    expect(audioAlert.severity).toBe(mostSevere);
  });

  it('enforces highest severity', () => {
    // lower number corresponds to more severity
    audioAlert.setSeverity(mostSevere - 1);
    expect(audioAlert.severity).toBe(mostSevere);
  });

  it('enforces least severity', () => {
    // higher number corresponds to less severity
    audioAlert.setSeverity(leastSevere + 1);
    expect(audioAlert.severity).toBe(leastSevere);
  });
});

describe('setAudioSrc', () => {
  const audioAlert = new AudioAlert({
    audioSrc: 'test 1',
  });

  it('sets audioSrc', () => {
    audioAlert.setAudioSrc('test 2');
    expect(audioAlert.audioSrc).toBe('test 2');
  });
});

describe('severity', () => {
  let audioAlert1: AudioAlert;
  let audioAlert2: AudioAlert;

  beforeEach(() => {
    audioAlertPlayer.stop();
    audioAlert1 = new AudioAlert({
      isMuted: false,
      volume: 0.8,
      severity: 3,
    });
    audioAlert2 = new AudioAlert({
      severity: 2,
    });
  });

  it('plays higher severity audio alert', () => {
    expect(audioAlert1.play()).toBeTrue();
    expect(audioAlert2.play()).toBeTrue();
  });

  it("doesn't switch to lower severity alert", () => {
    expect(audioAlert2.play()).toBeTrue();
    expect(audioAlert1.play()).toBeFalse();
  });

  it('plays lower severity alert if higher severity is muted', () => {
    audioAlert2.mute();
    expect(audioAlert2.play()).toBeFalse();
    expect(audioAlert1.play()).toBeTrue();
  });
});
