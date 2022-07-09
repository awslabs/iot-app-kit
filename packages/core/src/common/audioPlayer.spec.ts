import { AudioPlayer } from './audioPlayer';

const playAudio = (player: AudioPlayer) => {
  if (player) {
    return player.play({
      severity: 3,
      volume: 0.5,
    });
  }
  return;
};

describe('play', () => {
  const audioAlertPlayer = new AudioPlayer();
  it('automatically plays audio', () => {
    playAudio(audioAlertPlayer);
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });
});

describe('mute and unmute', () => {
  let audioAlertPlayer: AudioPlayer;

  beforeEach(() => {
    audioAlertPlayer = new AudioPlayer();
    playAudio(audioAlertPlayer);
  });

  it('mutes but continues to play audio', () => {
    audioAlertPlayer.mute();
    expect(audioAlertPlayer.isMuted()).toBeTrue();
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });

  it('unmutes and continues to play audio', () => {
    audioAlertPlayer.mute();
    audioAlertPlayer.unmute();
    expect(audioAlertPlayer.isMuted()).toBeFalse();
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });
});

describe('stop', () => {
  const audioAlertPlayer = new AudioPlayer();
  playAudio(audioAlertPlayer);

  it('stops playing audio', () => {
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
    audioAlertPlayer.stop();
    expect(audioAlertPlayer.isPlaying()).toBeFalse();
  });
});

describe('setMaxVolume', () => {
  const audioAlertPlayer = new AudioPlayer();

  it('sets max volume', () => {
    audioAlertPlayer.setMaxVolume(0.1);
    expect(audioAlertPlayer.getMaxVolume()).toBe(0.1);
  });

  it('enforces maximum max volume', () => {
    audioAlertPlayer.setMaxVolume(1.5);
    expect(audioAlertPlayer.getMaxVolume()).toBe(1.0);
  });

  it('enforces minumum max volume', () => {
    audioAlertPlayer.setMaxVolume(1.5);
    expect(audioAlertPlayer.getMaxVolume()).toBe(1.0);
  });
});

describe('severity', () => {
  let audioAlertPlayer: AudioPlayer;

  beforeEach(() => {
    audioAlertPlayer = new AudioPlayer();
  });

  it('plays higher severity audio', () => {
    const play1 = audioAlertPlayer.play({
      severity: 3,
      volume: 0.5,
    });
    expect(play1).toBeTrue();
    expect(audioAlertPlayer.config.severity).toBe(3);
    const play2 = audioAlertPlayer.play({
      severity: 2,
      volume: 0.8,
    });
    expect(play2).toBeTrue();
    expect(audioAlertPlayer.config.severity).toBe(2);
  });

  it("doesn't switch to lower severity alert", () => {
    audioAlertPlayer.stop();
    const play1 = audioAlertPlayer.play({
      severity: 2,
      volume: 0.5,
    });
    expect(play1).toBeTrue();
    expect(audioAlertPlayer.config.severity).toBe(2);
    const play2 = audioAlertPlayer.play({
      severity: 3,
      volume: 0.8,
    });
    expect(play2).toBeFalse();
    expect(audioAlertPlayer.config.severity).toBe(2);
  });
});
