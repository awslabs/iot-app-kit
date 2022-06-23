import { AudioAlertPlayer } from './audioAlertPlayer';
import { AudioAlert } from './audioAlert';
import { mostSevere, leastSevere } from './constants';

describe('initializes', () => {
  const audioAlertPlayer = new AudioAlertPlayer();
  let audioAlert: AudioAlert;

  it('properly initializes with the given attributes', () => {
    audioAlert = new AudioAlert({
      audioAlertPlayer: audioAlertPlayer,
      isMuted: true,
      volume: 0.6,
      severity: 1,
      audioSrc: 'test string',
    });
    expect(audioAlert.audioAlertPlayer).toBe(audioAlertPlayer);
    expect(audioAlert.isMuted()).toBeTrue();
    expect(audioAlert.volume).toBe(0.6);
    expect(audioAlert.severity).toBe(1);
    expect(audioAlert.audioSrc).toBe('test string');
  });
});

describe('play', () => {
  let audioAlertPlayer: AudioAlertPlayer;
  let audioAlert: AudioAlert;

  beforeEach(() => {
    audioAlertPlayer = new AudioAlertPlayer();
  });

  it('player plays when called on by audio alerts', () => {
    audioAlert = new AudioAlert({
      audioAlertPlayer: audioAlertPlayer,
    });
    expect(audioAlert.play()).toBeTrue();
  });

  it("player doesn't plays when called on by a muted audio alerts", () => {
    audioAlert = new AudioAlert({
      audioAlertPlayer: audioAlertPlayer,
      isMuted: true,
    });
    expect(audioAlert.isMuted()).toBeTrue();
    expect(audioAlert.play()).toBeFalse();
  });
});

describe('mute and unmute', () => {
  let audioAlert: AudioAlert;

  beforeEach(() => {
    const audioAlertPlayer = new AudioAlertPlayer();
    audioAlert = new AudioAlert({
      audioAlertPlayer: audioAlertPlayer,
    });
  });

  it("mutes audio alert and doesn't play", () => {
    audioAlert.play();
    expect(audioAlert.audioAlertPlayer.isPlaying()).toBeTrue();
    audioAlert.mute();
    expect(audioAlert.isMuted()).toBeTrue();
    expect(audioAlert.audioAlertPlayer.isPlaying()).toBeFalse();
  });

  it('unmutes audio alert', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    const audioAlert = new AudioAlert({
      isMuted: true,
      audioAlertPlayer: audioAlertPlayer,
    });
    audioAlert.unmute();
    expect(audioAlert.isMuted()).toBeFalse();
  });
});

describe('setVolume', () => {
  let audioAlert: AudioAlert;

  beforeEach(() => {
    const audioAlertPlayer = new AudioAlertPlayer();
    audioAlert = new AudioAlert({
      audioAlertPlayer: audioAlertPlayer,
    });
  });

  it('sets volume', () => {
    audioAlert.setVolume(0.2);
    expect(audioAlert.volume).toBe(0.2);
  });

  it('enforces maximum volume', () => {
    audioAlert.setVolume(1.5);
    expect(audioAlert.volume).toBe(1.0);
  });

  it('enforces minimum volume', () => {
    audioAlert.setVolume(-1.5);
    expect(audioAlert.volume).toBe(0.0);
  });
});

describe('setSeverity', () => {
  let audioAlert: AudioAlert;

  beforeEach(() => {
    const audioAlertPlayer = new AudioAlertPlayer();
    audioAlert = new AudioAlert({
      audioAlertPlayer: audioAlertPlayer,
    });
  });

  it('sets severity', () => {
    audioAlert.setSeverity(mostSevere);
    expect(audioAlert.severity).toBe(mostSevere);
  });

  it('enforces most severity', () => {
    // lower number corresponds to more severity
    audioAlert.setSeverity(mostSevere - 1);
    expect(audioAlert.severity).toBe(mostSevere);
  });

  it('enforces minimum volume', () => {
    // higher number corresponds to less severity
    audioAlert.setSeverity(leastSevere + 1);
    expect(audioAlert.severity).toBe(leastSevere);
  });
});

describe('setAudioSrc', () => {
  const audioAlertPlayer = new AudioAlertPlayer();
  const audioAlert = new AudioAlert({
    audioAlertPlayer: audioAlertPlayer,
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
    const audioAlertPlayer = new AudioAlertPlayer();
    audioAlert1 = new AudioAlert({
      audioAlertPlayer: audioAlertPlayer,
      isMuted: false,
      volume: 0.8,
      severity: 3,
    });
    audioAlert2 = new AudioAlert({
      audioAlertPlayer: audioAlertPlayer,
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
