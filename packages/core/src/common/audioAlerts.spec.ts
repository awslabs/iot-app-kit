import { AudioAlertPlayer, AudioAlert } from './audioAlerts';

const playAudioAlert = (player: AudioAlertPlayer) => {
  if (player) {
    return player.play({
      severity: 3,
      volume: 0.5,
    });
  }
  return;
};

const initializeAudioAlertEnvironment = (): {
  audioAlertPlayer: AudioAlertPlayer;
  audioAlert1: AudioAlert;
  audioAlert2: AudioAlert;
} => {
  const audioAlertPlayer = new AudioAlertPlayer();
  const audioAlert1 = new AudioAlert({
    isMuted: false,
    audioAlertPlayer: audioAlertPlayer,
    volume: 0.5,
    severity: 2,
  });

  const audioAlert2 = new AudioAlert({
    isMuted: false,
    audioAlertPlayer: audioAlertPlayer,
  });
  return { audioAlertPlayer: audioAlertPlayer, audioAlert1: audioAlert1, audioAlert2: audioAlert2 };
};

describe('AudioAlertPlayer', () => {
  it('automatically plays audio', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    playAudioAlert(audioAlertPlayer);
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });

  it('mutes but continues to play audio', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    playAudioAlert(audioAlertPlayer);
    audioAlertPlayer.mute();
    expect(audioAlertPlayer.isMuted()).toBeTrue();
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });

  it('unmutes and continues to play audio', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    audioAlertPlayer.mute();
    playAudioAlert(audioAlertPlayer);
    audioAlertPlayer.unmute();
    expect(audioAlertPlayer.isMuted()).toBeFalse();
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });

  it('stops playing audio', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    playAudioAlert(audioAlertPlayer);
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
    audioAlertPlayer.stop();
    expect(audioAlertPlayer.isPlaying()).toBeFalse();
  });

  it('sets max volume', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    audioAlertPlayer.setMaxVolume(0.1);
    expect(audioAlertPlayer.getMaxVolume()).toBe(0.1);
  });

  it('enforces max volume range', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    audioAlertPlayer.setMaxVolume(1.5);
    expect(audioAlertPlayer.getMaxVolume()).toBe(1.0);
    audioAlertPlayer.setMaxVolume(-1.5);
    expect(audioAlertPlayer.getMaxVolume()).toBe(0.0);
  });

  it('plays higher severity audio', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    audioAlertPlayer.stop();
    const { player: player1 } = audioAlertPlayer.play({
      severity: 3,
      volume: 0.5,
    });
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
    const { player: player2 } = audioAlertPlayer.play({
      severity: 2,
      volume: 0.8,
    });
    expect(player2).not.toBe(player1);
  });

  it("doesn't switch to lower severity alert", () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    audioAlertPlayer.stop();
    audioAlertPlayer.play({
      severity: 2,
      volume: 0.5,
    });
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
    const { player } = audioAlertPlayer.play({
      severity: 3,
      volume: 0.8,
    });
    expect(player).toBe(undefined);
  });
});

describe('AudioAlert', () => {
  it('player plays when called on by audio alerts', () => {
    const { audioAlert1 } = initializeAudioAlertEnvironment();
    audioAlert1.play();
    const player = audioAlert1.getAudioAlertPlayer();
    expect(player.isPlaying()).toBeTrue();
  });

  it("mutes audio alert and doesn't play", () => {
    const { audioAlert1 } = initializeAudioAlertEnvironment();
    audioAlert1.mute();
    expect(audioAlert1.isMuted()).toBeTrue();
    const player = audioAlert1.play();
    expect(player).toBe(undefined);
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

  it('plays lower severity alert if higher severity is muted', () => {
    const { audioAlert1, audioAlert2 } = initializeAudioAlertEnvironment();
    audioAlert1.mute();
    const player1 = audioAlert1.play();
    expect(player1).toBe(undefined);
    const player2 = audioAlert2.play();
    expect(player2).not.toBe(undefined);
  });

  it('plays higher severity audio alert', () => {
    const { audioAlert1, audioAlert2 } = initializeAudioAlertEnvironment();
    audioAlert1.getAudioAlertPlayer().stop();
    const player1 = audioAlert2.play();
    expect(player1).not.toBe(undefined);
    const player2 = audioAlert1.play();
    expect(player2).not.toBe(undefined);
    expect(player2).not.toBe(player1);
  });

  it("doesn't switch to lower severity alert", () => {
    const { audioAlert1, audioAlert2 } = initializeAudioAlertEnvironment();
    audioAlert1.getAudioAlertPlayer().stop();
    const player1 = audioAlert1.play();
    expect(player1).not.toBe(undefined);
    const player2 = audioAlert2.play();
    expect(player2).toBe(undefined);
    expect(player2).not.toBe(player1);
  });

  // it("sets the volume", () => {
  //     let { audioAlert1 } = initializeAudioAlertEnvironment();
  //     expect(audioAlert1.setVolume(0.2)).toBe(0.2);
  //     expect(audioAlert1.setVolume(1.5)).toBe(1.0);
  //     expect(audioAlert1.setVolume(-1.5)).toBe(0.0);
  // });

  // it("sets the severity", () => {
  //     let { audioAlert1 } = initializeAudioAlertEnvironment();
  //     expect(audioAlert1.setSeverity(1)).toBe(1);
  //     expect(audioAlert1.setSeverity(minimumSeverity + 1)).toBe(minimumSeverity);
  //     expect(audioAlert1.setSeverity(-1)).toBe(1);
  // });
});
